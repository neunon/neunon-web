/** 広告流入のための固定形式だけを残し、任意のURLクエリをGoogleへ渡さない。 */
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id'];
const safeValue = /^[A-Za-z0-9_-]{1,64}$/;

/** @param {string} rawUrl */
export function safeCampaignLocation(rawUrl) {
  const url = new URL(rawUrl);
  const clean = new URL(url.pathname, url.origin);
  for (const key of campaignKeys) {
    const value = url.searchParams.get(key);
    if (value && safeValue.test(value) && url.searchParams.getAll(key).length === 1) {
      clean.searchParams.set(key, value);
    }
  }
  return clean.href;
}

/** 外部リファラーはホスト名まで、同一サイトはクエリを除いたパスまで。 */
/** @param {string} rawReferrer @param {string} siteOrigin */
export function safePageReferrer(rawReferrer, siteOrigin) {
  if (!rawReferrer) return '';
  try {
    const referrer = new URL(rawReferrer);
    if (!['http:', 'https:'].includes(referrer.protocol)) return '';
    return referrer.origin === siteOrigin ? `${referrer.origin}${referrer.pathname}` : referrer.origin;
  } catch {
    return '';
  }
}
