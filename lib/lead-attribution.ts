/** 問い合わせ完了時に使う一時的な、個人情報を含まない計測マーカー。 */
export const EXISTING_CUSTOMERS_SOURCE = 'existing_customers';
export const CONTACT_SUCCESS_KEY = 'neunon:contact-success';
export const CONTACT_SUCCESS_MAX_AGE_MS = 5 * 60 * 1000;

export type ContactSuccessMarker = {
  source: typeof EXISTING_CUSTOMERS_SOURCE | 'other';
  at: number;
};
