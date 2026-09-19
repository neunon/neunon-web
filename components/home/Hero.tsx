import Image from 'next/image';
import Link from 'next/link';
import { getHomeCopy } from '@/lib/seo';

/**
 * トップページ セクション1: ヒーロー（要件定義書 6.1）
 * キーメッセージ「次世代の成長を、企業の成長へ。」＋
 * 企業向け／学生向けの2分岐CTA（要件定義書 3. の設計上の重要事項）
 */
export function Hero() {
  const copy = getHomeCopy();
  return (
    <div className="nc-hero nc-home-wide">
      <div className="nc-hero-media" aria-hidden="true">
        <Image
          src="/home-hero-city.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
        />
      </div>
      <div className="wrap">
        <span className="nc-eyebrow rise" data-d="0">
          {copy.eyebrow}
        </span>
        <h1 className="rise" data-d="1">
          {copy.titleLine1}<br />{copy.titleLine2}
        </h1>
        <p className="nc-lead rise" data-d="2">
          {copy.lead}
        </p>
        <p className="nc-business-summary rise" data-d="2">{copy.businessSummary}</p>
        <div className="nc-acts rise" data-d="3">
          <Link href="/services" className="btn">
            {copy.companyCtaLabel}
          </Link>
          <Link href="/recruit" className="btn btn-ghost">
            {copy.studentCtaLabel}
          </Link>
        </div>
        <div className="nc-hero-proof rise" data-d="3" aria-label="Neunon Consultingの特長">
          <div><span>QUALITY</span><strong>高品質な成果物</strong></div>
          <div><span>COST</span><strong>合理的な低価格</strong></div>
          <div><span>FLEXIBILITY</span><strong>柔軟・迅速な支援体制</strong></div>
        </div>
      </div>
    </div>
  );
}
