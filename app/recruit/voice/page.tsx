import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '学生の体験談',
  description: '実際の案件に取り組む学生の体験談を準備しています。',
  alternates: { canonical: '/recruit/voice' },
  // 内容が入るまで検索結果に出さない
  robots: { index: false, follow: true },
};

export default function VoicePage() {
  return (
    <div className="ep ep-recruit nr-voice-page">
      <div className="ep-wrap nr-voice-inner">
        <span className="ep-overline">学生の体験談</span>
        <h1>仕事の中で、<br />何を学んだか。</h1>
        <p>実際の案件に取り組んだ学生の体験談は、現在準備中です。本人の言葉でお届けできるようになり次第、こちらで公開します。</p>
        <div className="nr-voice-actions"><Link href="/recruit/">採用情報に戻る <span aria-hidden="true">→</span></Link><Link href="/entry/">エントリーする <span aria-hidden="true">→</span></Link></div>
      </div>
    </div>
  );
}
