const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

const FORMS = {
  contact: {
    required: ['company', 'name', 'email', 'topic', 'message', 'privacyConsent'],
    labels: {
      company: '会社名', department: '部署名', name: 'お名前', email: 'メールアドレス',
      tel: '電話番号', topic: 'ご相談内容の種別', talent: '関心のある人材', message: 'ご相談内容',
    },
    notificationSubject: '【Neunon】企業お問い合わせ',
    autoTitle: 'お問い合わせを受け付けました',
  },
  entry: {
    required: ['name', 'email', 'school', 'experience', 'motivation', 'privacyConsent'],
    labels: {
      name: 'お名前', email: 'メールアドレス', school: '大学・学部・学年',
      experience: 'スキル・経験', motivation: '志望動機', portfolio: 'ポートフォリオURL',
      portfolioFile: 'ポートフォリオ・資料',
    },
    notificationSubject: '【Neunon】学生エントリー',
    autoTitle: 'エントリーを受け付けました',
  },
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env.ALLOWED_ORIGINS);
    if (!cors) return json({ error: '許可されていない送信元です。' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);

    const formType = new URL(request.url).pathname.split('/').filter(Boolean).at(-1);
    const config = FORMS[formType];
    if (!config) return json({ error: 'フォームが見つかりません。' }, 404, cors);
    if (!env.RESEND_API_KEY || !env.NOTIFICATION_EMAIL || !env.FROM_EMAIL) {
      return json({ error: '送信環境が設定されていません。' }, 503, cors);
    }

    try {
      const contentLength = Number(request.headers.get('Content-Length') || 0);
      if (contentLength > MAX_FILE_SIZE + 1024 * 1024) return json({ error: '送信サイズが大きすぎます。' }, 413, cors);
      const data = await request.formData();
      if (String(data.get('_gotcha') || '') !== '') return json({ ok: true }, 200, cors);

      const values = Object.fromEntries(
        Object.keys(config.labels).map((key) => [key, typeof data.get(key) === 'string' ? String(data.get(key)).trim() : '']),
      );
      const missing = config.required.filter((key) => String(data.get(key) || '').trim() === '');
      if (missing.length) return json({ error: '必須項目が不足しています。', fields: missing }, 400, cors);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || '')) return json({ error: 'メールアドレスが正しくありません。' }, 400, cors);

      if (env.TURNSTILE_SECRET) {
        const valid = await verifyTurnstile(String(data.get('cf-turnstile-response') || ''), request, env.TURNSTILE_SECRET);
        if (!valid) return json({ error: '迷惑送信防止の確認に失敗しました。' }, 400, cors);
      }

      const file = data.get('portfolioFile');
      const attachments = [];
      if (file instanceof File && file.size > 0) {
        if (file.size > MAX_FILE_SIZE) return json({ error: '添付ファイルは10MB以内にしてください。' }, 413, cors);
        if (!ALLOWED_FILE_TYPES.has(file.type)) return json({ error: '添付ファイルの形式が許可されていません。' }, 400, cors);
        attachments.push({ filename: safeFilename(file.name), content: toBase64(await file.arrayBuffer()) });
      }

      const submissionId = String(data.get('submissionId') || crypto.randomUUID()).slice(0, 100);
      const notificationText = buildNotificationText(formType, config, values, request);
      const senderName = values.name || 'ご担当者';
      const notification = sendEmail(env, {
        from: env.FROM_EMAIL,
        to: [env.NOTIFICATION_EMAIL],
        reply_to: values.email,
        subject: `${config.notificationSubject}｜${senderName}`,
        text: notificationText,
        html: textToHtml(notificationText),
        attachments,
      }, `${submissionId}-notification`);
      const autoReplyText = buildAutoReply(formType, senderName);
      const autoReply = sendEmail(env, {
        from: env.FROM_EMAIL,
        to: [values.email],
        reply_to: env.NOTIFICATION_EMAIL,
        subject: `【株式会社Neunon Consulting】${config.autoTitle}`,
        text: autoReplyText,
        html: textToHtml(autoReplyText),
      }, `${submissionId}-auto-reply`);

      await Promise.all([notification, autoReply]);
      return json({ ok: true }, 200, cors);
    } catch (error) {
      console.error('form submission failed', error);
      return json({ error: '送信処理に失敗しました。' }, 502, cors);
    }
  },
};

export function corsHeaders(origin, allowedOrigins = '') {
  const allowed = new Set(String(allowedOrigins).split(',').map((item) => item.trim()).filter(Boolean));
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) allowed.add(origin);
  if (!allowed.has(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

async function verifyTurnstile(token, request, secret) {
  if (!token) return false;
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) body.set('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const result = await response.json();
  return result.success === true;
}

async function sendEmail(env, payload, idempotencyKey) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

export function buildNotificationText(formType, config, values, request) {
  const lines = [config.notificationSubject, ''];
  for (const [key, label] of Object.entries(config.labels)) {
    if (key === 'portfolioFile' || !values[key]) continue;
    lines.push(`${label}:`, values[key], '');
  }
  if (formType === 'entry') lines.push('添付資料: 添付がある場合は本メールに同封されています。', '');
  lines.push(`受付日時: ${new Date().toISOString()}`, `送信元: ${request.headers.get('Origin') || 'unknown'}`);
  return lines.join('\n');
}

export function buildAutoReply(formType, name) {
  const noun = formType === 'entry' ? 'エントリー' : 'お問い合わせ';
  return `${name} 様\n\n${noun}を受け付けました。\n内容を確認のうえ、当日〜翌営業日を目安に担当者からご連絡いたします。\n\nこのメールにお心当たりがない場合は、keisakamoto@neun-on.com までご連絡ください。\n\n株式会社Neunon Consulting\nhttps://neun-on.com/`;
}

export function textToHtml(text) {
  return `<div style="font-family:Arial,'Noto Sans JP',sans-serif;line-height:1.8;color:#171717">${escapeHtml(text).replace(/\n/g, '<br>')}</div>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function safeFilename(value) {
  return String(value || 'attachment').replace(/[\\/:*?"<>|\r\n]/g, '_').slice(0, 160);
}

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  }
  return btoa(binary);
}

function json(body, status, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
