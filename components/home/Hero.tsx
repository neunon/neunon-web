import Image from 'next/image';
import Link from 'next/link';

/**
 * トップページ セクション1: ヒーロー（要件定義書 6.1）
 * キーメッセージ「次世代の成長を、企業の成長へ。」＋
 * 企業向け／学生向けの2分岐CTA（要件定義書 3. の設計上の重要事項）
 */
export function Hero() {
  return (
    <div className="nc-hero">
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
          Neunon Consulting
        </span>
        <h1 className="rise" data-d="1">
          次世代の成長を、<br />企業の成長へ。
        </h1>
        <p className="nc-lead rise" data-d="2">
          徹底した品質管理・育成体制のもとで選抜・育成された優秀な学生人材が企業の実務に挑み、
          プロフェッショナルが学生の成長と成果物の品質を支えます。実践を通じて、企業の成果創出と
          次世代ビジネス人材の育成を両立します。
        </p>
        <div className="nc-acts rise" data-d="3">
          <Link href="/services" className="btn">
            企業の方へ
          </Link>
          <Link href="/recruit" className="btn btn-ghost">
            学生の方へ
          </Link>
        </div>
        <div className="nc-hero-proof rise" data-d="3" aria-label="Neunon Consultingの特長">
          <div><span>01</span><strong>低価格</strong><small>学生人材活用による低コスト支援</small></div>
          <div><span>02</span><strong>優秀な学生人材</strong><small>高い意欲と能力を持つ学生を選抜</small></div>
          <div><span>03</span><strong>実務品質</strong><small>プロによる設計・レビュー</small></div>
          <div><span>04</span><strong>次世代人材育成</strong><small>実践的な教育・育成体制</small></div>
        </div>
      </div>
    </div>
  );
}
