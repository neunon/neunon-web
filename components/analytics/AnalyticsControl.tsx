'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type Status = 'checking' | 'active' | 'stopped' | 'outside' | 'unavailable';
type LeadEvent = { event: 'contact_submit_success'; source: 'existing_customers' | 'other' };

const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? '';
const configuredEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_REGION_ENDPOINT ?? '';
const contactEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? '';
const enabled = process.env.NEXT_PUBLIC_GA4_ENABLED === 'true' && /^G-[A-Z0-9]+$/.test(measurementId);
const preferenceKey = 'neunon-analytics-opt-out-v1';
const preferenceCookie = 'nc_analytics_opt_out';

function regionEndpoint() {
  try {
    return configuredEndpoint || (contactEndpoint ? new URL('/analytics-region', contactEndpoint).href : '');
  } catch {
    return '';
  }
}

function isOptedOut() {
  try { if (localStorage.getItem(preferenceKey) === '1') return true; } catch { /* Cookie fallback below. */ }
  return document.cookie.split('; ').some((item) => item === `${preferenceCookie}=1`);
}

function saveOptOut(stopped: boolean) {
  try {
    if (stopped) localStorage.setItem(preferenceKey, '1');
    else localStorage.removeItem(preferenceKey);
  } catch { /* Cookie fallback below. */ }
  const domain = /(^|\.)neun-on\.com$/.test(location.hostname) ? '; Domain=.neun-on.com' : '';
  document.cookie = `${preferenceCookie}=${stopped ? '1; Max-Age=31536000' : '0; Max-Age=0'}; Path=/; SameSite=Lax${domain}${location.protocol === 'https:' ? '; Secure' : ''}`;
  return isOptedOut() === stopped;
}

function disableTag() {
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
  for (const item of document.cookie.split('; ')) {
    const name = item.split('=')[0];
    if (!/^_ga(?:_|$)/.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${location.hostname}`;
  }
}

function analyticsWindow() {
  return window as unknown as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
}

function startTag() {
  const target = analyticsWindow();
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;
  if (target.gtag) return;
  target.dataLayer = target.dataLayer ?? [];
  target.gtag = (...args: unknown[]) => { target.dataLayer?.push(args); };
  target.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  target.gtag('js', new Date());
  target.gtag('config', measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

/** 国内の訪問者だけ自動計測。地域を確認できなければタグを読み込まない。 */
export function AnalyticsControl() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const statusRef = useRef<Status>('checking');
  const regionRequest = useRef(0);
  const pendingLeads = useRef<LeadEvent[]>([]);
  const handledLeads = useRef(new WeakSet<object>());
  const [status, setStatus] = useState<Status>('checking');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  function changeStatus(next: Status) {
    statusRef.current = next;
    setStatus(next);
    if (next === 'active') {
      for (const lead of pendingLeads.current) sendLead(lead);
    }
    pendingLeads.current = [];
  }

  function sendLead(lead: LeadEvent) {
    analyticsWindow().gtag?.('event', 'generate_lead', { lead_source: lead.source });
  }

  async function checkRegion() {
    const requestId = ++regionRequest.current;
    const endpoint = regionEndpoint();
    if (!endpoint) { changeStatus('unavailable'); return; }
    changeStatus('checking');
    try {
      const response = await fetch(endpoint, { credentials: 'omit', cache: 'no-store' });
      if (!response.ok) throw new Error('region unavailable');
      const result = await response.json() as { country?: string | null };
      if (requestId !== regionRequest.current) return;
      if (isOptedOut()) { changeStatus('stopped'); return; }
      if (result.country !== 'JP') { changeStatus(result.country ? 'outside' : 'unavailable'); return; }
      startTag();
      changeStatus('active');
    } catch {
      if (requestId === regionRequest.current) changeStatus('unavailable');
    }
  }

  useEffect(() => {
    if (!enabled) return;
    if (isOptedOut()) { disableTag(); changeStatus('stopped'); return; }
    void checkRegion();
    return () => { regionRequest.current++; };
    // 初回の地域判定だけを行う。以降は設定ボタンで明示的に変更する。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!enabled) return;
    function onLead(event: Event) {
      const lead = (event as CustomEvent<LeadEvent>).detail;
      if (!lead || lead.event !== 'contact_submit_success' || handledLeads.current.has(lead)) return;
      handledLeads.current.add(lead);
      if (statusRef.current === 'active') sendLead(lead);
      else if (statusRef.current === 'checking') pendingLeads.current.push(lead);
    }
    window.addEventListener('neunon:lead', onLead);
    for (const item of analyticsWindow().dataLayer ?? []) {
      if (typeof item === 'object' && item !== null && 'event' in item && item.event === 'contact_submit_success') {
        onLead(new CustomEvent<LeadEvent>('neunon:lead', { detail: item as LeadEvent }));
      }
    }
    return () => window.removeEventListener('neunon:lead', onLead);
  }, []);

  useEffect(() => {
    if (!enabled || status !== 'active' || !pathname) return;
    // URL パラメータには個人情報が入り得るため、パスだけを送る。
    analyticsWindow().gtag?.('event', 'page_view', {
      page_path: pathname,
      page_location: `${location.origin}${pathname}`,
    });
  }, [pathname, status]);

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  if (!enabled) return null;

  function stop() {
    regionRequest.current++;
    disableTag();
    pendingLeads.current = [];
    const saved = saveOptOut(true);
    changeStatus('stopped');
    setMessage(saved ? 'アクセス解析を停止しました。' : 'この画面では停止しましたが、設定を保存できませんでした。ブラウザの保存設定をご確認ください。');
  }

  function resume() {
    if (!saveOptOut(false)) { setMessage('設定を保存できませんでした。ブラウザの保存設定をご確認ください。'); return; }
    setMessage('');
    void checkRegion();
  }

  const active = status === 'active';
  const stopped = status === 'stopped';
  return (
    <>
      <button className="nc-analytics-open" type="button" onClick={() => { setMessage(''); setOpen(true); }}>
        アクセス解析の設定
      </button>
      <dialog className="nc-analytics-dialog" ref={dialogRef} onClose={() => setOpen(false)}>
        <div className="nc-analytics-dialog-inner">
          <button className="nc-analytics-close" type="button" onClick={() => setOpen(false)} aria-label="閉じる">×</button>
          <h2>アクセス解析の設定</h2>
          <p>サイトの改善とお問い合わせの効果測定のため、Google アナリティクスを利用します。氏名やお問い合わせ内容は送信しません。</p>
          <p className="nc-analytics-state" role="status">
            {active ? '現在、アクセス解析を利用しています。' : stopped ? 'アクセス解析は停止中です。' : status === 'checking' ? '利用地域を確認しています。' : 'この地域・環境ではアクセス解析を行っていません。'}
          </p>
          {message && <p className="nc-analytics-message" role="status">{message}</p>}
          <div className="nc-analytics-actions">
            {stopped ? <button type="button" onClick={resume}>解析を再開する</button> : <button type="button" onClick={stop}>{active ? '解析を停止する' : '今後の解析を停止する'}</button>}
            <a href="/privacy/#cookie">詳しく見る</a>
          </div>
        </div>
      </dialog>
    </>
  );
}
