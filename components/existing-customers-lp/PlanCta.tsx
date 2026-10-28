'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { LP_SOURCE, plans } from './data';
import { track } from './Tracker';
import s from './lp.module.css';

const PLAN_OPTIONS = [...plans.map((p) => p.name), '未定'] as const;
const COUNT_OPTIONS = ['1〜5社', '6〜20社', '21社以上', '未定'] as const;

/**
 * 見積依頼の入口。検討中のプランと社数を選ぶと、問い合わせフォームの「ご相談内容」に下書きとして入る。
 * どちらも任意（未定のままで送れる）。フォームの必須項目は増やさない。
 */
export function PlanCta() {
  const [plan, setPlan] = useState<string>('未定');
  const [count, setCount] = useState<string>('未定');
  const message = [
    '【既存顧客企業クローズアップ】',
    `検討中のプラン：${plan}`,
    `対象企業数：${count}`,
    '分析したい顧客・目的：',
  ].join('\n');
  const href = `/contact/?topic=${encodeURIComponent('お見積りの依頼')}&message=${encodeURIComponent(message)}&source=${LP_SOURCE}`;

  return (
    <div className={s.planCta}>
      <fieldset className={s.choice}>
        <legend>検討中のプラン</legend>
        <div>
          {PLAN_OPTIONS.map((o) => (
            <label key={o} className={s.chip}>
              <input type="radio" name="plan" aria-label={`検討中のプラン：${o}`} value={o} checked={plan === o} onChange={() => { setPlan(o); track('plan_select', { plan: o }); }} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className={s.choice}>
        <legend>対象の社数</legend>
        <div>
          {COUNT_OPTIONS.map((o) => (
            <label key={o} className={s.chip}>
              <input type="radio" name="count" aria-label={`対象の社数：${o}`} value={o} checked={count === o} onChange={() => setCount(o)} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className={s.planCtaGo}>
        <Link href={href} className={s.btnPrimary} data-track="cta_estimate" data-track-at="price">
          この内容で見積もりを依頼する<ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} />
        </Link>
        <p>選んだ内容はフォームに入った状態で開きます。あとから書き換えられます。</p>
      </div>
    </div>
  );
}
