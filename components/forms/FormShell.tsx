'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { validateAll, validateField, type FieldDef } from '@/lib/forms';
import { site } from '@/lib/site';

/**
 * 問い合わせ／エントリー共通のフォーム（要件定義書 6.8）
 *
 * 共通要件への対応:
 * - 送信前に確認画面またはバリデーション表示
 *     → 入力時のインライン検証と、送信前の確認画面の両方を実装
 * - 送信完了ページ            → 送信成功後に thanksPath へ遷移
 * - スパム対策                → honeypot（Formspree の _gotcha）+ 極端に速い送信の拒否
 * - 同意チェックなしでは送信不可 → 未チェックの間は送信ボタンを disabled
 *
 * 送信先が未設定の場合は送信できない状態にし、その旨を画面に出す。
 */

type Props = {
  fields: FieldDef[];
  endpoint: string;
  thanksPath: string;
  subject: string;
  submitLabel: string;
  /** 環境変数名。未設定時の案内に出す */
  envName: string;
};

const MIN_FILL_MS = 3000;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function FormShell({ fields, endpoint, thanksPath, subject, submitLabel, envName }: Props) {
  const router = useRouter();
  const formId = useId();
  const startedAt = useRef(Date.now());
  const submissionId = useRef(crypto.randomUUID());
  const turnstileContainer = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState(false);
  const [gotcha, setGotcha] = useState('');
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');

  const configured = endpoint !== '';
  const canProceed = consent && !sending && (!turnstileSiteKey || turnstileToken !== '');

  useEffect(() => {
    if (!turnstileSiteKey) return;

    let cancelled = false;
    const renderWidget = () => {
      if (cancelled || !window.turnstile || !turnstileContainer.current || turnstileWidgetId.current) return;
      turnstileWidgetId.current = window.turnstile.render(turnstileContainer.current, {
        sitekey: turnstileSiteKey,
        theme: 'light',
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });
    };

    const existing = document.querySelector<HTMLScriptElement>('script[data-neunon-turnstile]');
    if (existing) {
      existing.addEventListener('load', renderWidget);
      renderWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.neunonTurnstile = 'true';
      script.addEventListener('load', renderWidget);
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      existing?.removeEventListener('load', renderWidget);
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get('topic');
    const selectedTalents = params.getAll('talent').filter(Boolean);

    setValues((current) => {
      const next = { ...current };
      const topicField = fields.find((field) => field.name === 'topic');
      if (topic && topicField?.options?.includes(topic)) next.topic = topic;
      if (selectedTalents.length > 0 && fields.some((field) => field.name === 'talent')) {
        next.talent = selectedTalents.join('、');
      }
      return next;
    });
  }, [fields]);

  function setValue(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const field = fields.find((item) => item.name === name);
      if (field) {
        const error = validateField(field, value);
        setErrors((prev) => {
          const next = { ...prev };
          if (error) next[name] = error;
          else delete next[name];
          return next;
        });
      }
    }
  }

  function handleBlur(field: FieldDef) {
    setTouched((prev) => ({ ...prev, [field.name]: true }));
    const error = validateField(field, values[field.name] ?? '');
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[field.name] = error;
      else delete next[field.name];
      return next;
    });
  }

  function setFile(field: FieldDef, file: File | null) {
    setFiles((prev) => ({ ...prev, [field.name]: file }));
    setTouched((prev) => ({ ...prev, [field.name]: true }));
    setErrors((prev) => {
      const next = { ...prev };
      if (file && field.maxFileSize && file.size > field.maxFileSize) {
        next[field.name] = '添付ファイルは10MB以内にしてください。';
      } else {
        delete next[field.name];
      }
      return next;
    });
  }

  function goConfirm(event: React.FormEvent) {
    event.preventDefault();
    const found = validateAll(fields, values);
    for (const field of fields) {
      const file = files[field.name];
      if (field.type === 'file' && file && field.maxFileSize && file.size > field.maxFileSize) {
        found[field.name] = '添付ファイルは10MB以内にしてください。';
      }
    }
    setErrors(found);
    setTouched(Object.fromEntries(fields.map((field) => [field.name, true])));

    if (Object.keys(found).length > 0) {
      // 最初のエラー項目へアニメーションなしで移動する（要件定義書 5.2）
      const first = fields.find((field) => found[field.name]);
      if (first) {
        const el = document.getElementById(`${formId}-${first.name}`);
        el?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' });
        el?.focus({ preventScroll: true });
      }
      return;
    }
    setStep('confirm');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }

  async function handleSubmit() {
    if (!configured || !consent || sending) return;

    // スパム対策: honeypot に値が入っている、または入力が速すぎる場合は送らない
    if (gotcha !== '' || Date.now() - startedAt.current < MIN_FILL_MS) {
      setSendError('送信を確認できませんでした。少し時間をおいて、もう一度お試しください。');
      return;
    }

    setSending(true);
    setSendError(null);

    try {
      const payload = new FormData();
      payload.append('subject', subject);
      payload.append('submissionId', submissionId.current);
      payload.append('startedAt', String(startedAt.current));
      payload.append('_gotcha', gotcha);
      if (turnstileToken) payload.append('cf-turnstile-response', turnstileToken);
      const replyTo = (values.email ?? '').trim();
      if (replyTo) payload.append('replyTo', replyTo);
      for (const field of fields) {
        if (field.type === 'file') {
          const file = files[field.name];
          if (file) payload.append(field.name, file, file.name);
        } else {
          payload.append(field.name, (values[field.name] ?? '').trim());
        }
      }
      payload.append('privacyConsent', 'accepted');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: payload,
      });

      if (!response.ok) throw new Error(`status ${response.status}`);
      router.push(thanksPath);
    } catch {
      setSendError(
        '送信に失敗しました。時間をおいて再度お試しいただくか、フッター記載の電話番号までご連絡ください。',
      );
      setSending(false);
      setTurnstileToken('');
      if (turnstileWidgetId.current) window.turnstile?.reset(turnstileWidgetId.current);
    }
  }

  if (step === 'confirm') {
    return (
      <div className="nc-form">
        <p className="nc-form-step">入力内容の確認</p>
        <p className="nc-form-steplead">
          内容をご確認ください。修正が必要な場合は「修正する」から戻れます。
        </p>

        <dl className="nc-deflist nc-confirm">
          {fields.map((field) => (
            <div key={field.name}>
              <dt>{field.label}</dt>
              <dd>
                {field.type === 'file' && files[field.name] ? (
                  `${files[field.name]?.name}（${Math.ceil((files[field.name]?.size ?? 0) / 1024)}KB）`
                ) : (values[field.name] ?? '').trim() === '' ? (
                  <span className="nc-confirm-empty">（未入力）</span>
                ) : (
                  (values[field.name] ?? '').trim()
                )}
              </dd>
            </div>
          ))}
          <div>
            <dt>個人情報の取り扱い</dt>
            <dd>同意する</dd>
          </div>
        </dl>

        {!configured ? <EndpointNotice envName={envName} /> : null}
        {sendError ? (
          <p className="nc-form-error" role="alert">
            {sendError}
          </p>
        ) : null}

        <div className="nc-acts nc-form-acts">
          <button
            type="button"
            className="btn"
            onClick={handleSubmit}
            disabled={!configured || sending}
          >
            {sending ? '送信中…' : submitLabel}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setStep('input');
              setSendError(null);
              window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
            }}
            disabled={sending}
          >
            修正する
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="nc-form" onSubmit={goConfirm} noValidate>
      <p className="nc-form-step">入力</p>
      <p className="nc-form-steplead">
        <span aria-hidden="true" className="nc-req">
          必須
        </span>
        の項目は入力が必要です。送信前に確認画面が出ます。
      </p>

      {fields.map((field) => {
        const id = `${formId}-${field.name}`;
        const errorId = `${id}-error`;
        const helpId = `${id}-help`;
        const error = touched[field.name] ? errors[field.name] : undefined;
        const describedBy = [field.help ? helpId : null, error ? errorId : null]
          .filter(Boolean)
          .join(' ');

        return (
          <div className={`nc-field ${error ? 'has-error' : ''}`} key={field.name}>
            <label htmlFor={id}>
              {field.label}
              {field.required ? (
                <span className="nc-req">必須</span>
              ) : (
                <span className="nc-opt">任意</span>
              )}
            </label>

            {field.help ? (
              <p className="nc-field-help" id={helpId}>
                {field.help}
              </p>
            ) : null}

            {field.type === 'textarea' ? (
              <textarea
                id={id}
                name={field.name}
                rows={6}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                aria-required={field.required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy || undefined}
                value={values[field.name] ?? ''}
                onChange={(event) => setValue(field.name, event.target.value)}
                onBlur={() => handleBlur(field)}
              />
            ) : field.type === 'select' ? (
              <select
                id={id}
                name={field.name}
                aria-required={field.required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy || undefined}
                value={values[field.name] ?? ''}
                onChange={(event) => setValue(field.name, event.target.value)}
                onBlur={() => handleBlur(field)}
              >
                <option value="">選択してください</option>
                {field.options?.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'file' ? (
              <input
                id={id}
                name={field.name}
                type="file"
                accept={field.accept}
                aria-required={field.required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy || undefined}
                onChange={(event) => setFile(field, event.target.files?.[0] ?? null)}
              />
            ) : (
              <input
                id={id}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                autoComplete={field.autoComplete}
                aria-required={field.required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy || undefined}
                value={values[field.name] ?? ''}
                onChange={(event) => setValue(field.name, event.target.value)}
                onBlur={() => handleBlur(field)}
              />
            )}

            {error ? (
              <p className="nc-field-error" id={errorId} role="alert">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      {/* honeypot: 人間には見えない。入力されていたら送信しない */}
      <div className="nc-gotcha" aria-hidden="true">
        <label htmlFor={`${formId}-gotcha`}>この項目は入力しないでください</label>
        <input
          id={`${formId}-gotcha`}
          name="_gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={gotcha}
          onChange={(event) => setGotcha(event.target.value)}
        />
      </div>

      <div className="nc-consent">
        <label htmlFor={`${formId}-consent`}>
          <input
            id={`${formId}-consent`}
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          <span>
            <Link href="/privacy" className="nc-inline-link">
              プライバシーポリシー
            </Link>
            に同意します
            <span className="nc-req">必須</span>
          </span>
        </label>
        {!consent ? (
          <p className="nc-consent-note">同意いただくと、確認画面へ進めます。</p>
        ) : null}
      </div>

      {turnstileSiteKey ? (
        <div className="nc-turnstile">
          <div ref={turnstileContainer} />
          {!turnstileToken ? <p>迷惑送信防止の確認が完了すると、確認画面へ進めます。</p> : null}
        </div>
      ) : null}

      {!configured ? <EndpointNotice envName={envName} /> : null}

      <div className="nc-acts nc-form-acts">
        <button type="submit" className="btn" disabled={!canProceed}>
          入力内容を確認する
        </button>
      </div>
    </form>
  );
}

function EndpointNotice({ envName }: { envName: string }) {
  void envName;
  return (
    <p className="nc-pending nc-form-pending">
      現在、フォームは準備中です。お急ぎの場合は、
      <a href={'mailto:' + site.email} className="nc-inline-link">{site.email}</a>
      までご連絡ください。
    </p>
  );
}
