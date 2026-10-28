'use client';

import { useEffect } from 'react';
import {
  CONTACT_SUCCESS_KEY, CONTACT_SUCCESS_MAX_AGE_MS, EXISTING_CUSTOMERS_SOURCE,
  type ContactSuccessMarker,
} from '@/lib/lead-attribution';

type AnalyticsWindow = Window & { dataLayer?: Array<Record<string, string | number | boolean>> };

/** Worker が送信を受け付けた直後の遷移でだけ、重複しない問い合わせ完了イベントを出す。 */
export function ContactConversionTracker() {
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(CONTACT_SUCCESS_KEY);
      sessionStorage.removeItem(CONTACT_SUCCESS_KEY);
    } catch {
      return;
    }
    if (!raw) return;

    try {
      const marker = JSON.parse(raw) as ContactSuccessMarker;
      if (!Number.isFinite(marker.at) || Date.now() - marker.at > CONTACT_SUCCESS_MAX_AGE_MS || marker.at > Date.now()) return;
      const source = marker.source === EXISTING_CUSTOMERS_SOURCE ? EXISTING_CUSTOMERS_SOURCE : 'other';
      const analyticsWindow = window as AnalyticsWindow;
      analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
      analyticsWindow.dataLayer.push({ event: 'contact_submit_success', source });
    } catch {
      // 無効な一時データは計測せず破棄する。
    }
  }, []);
  return null;
}
