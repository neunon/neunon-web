'use client';

import { useRef } from 'react';
import { ReportVisual, type ReportKind } from './ReportVisual';
import styles from './page.module.css';

const reports: { kind: ReportKind; label: string; detail: string }[] = [
  { kind: 'overview', label: '事業構成', detail: '事業の広がりと現在の取引領域を俯瞰' },
  { kind: 'products', label: '商品・販路', detail: '取引の外側にある接点を比較' },
  { kind: 'changes', label: '直近の動向', detail: '変化を情報源・時点とともに整理' },
  { kind: 'hypothesis', label: '提案仮説', detail: '事実と仮説を分け、次の問いへ' },
];

export function ReportGallery() {
  const dialog = useRef<HTMLDialogElement>(null);

  function open(kind: ReportKind) {
    // React の描画更新を待たずに内容を切り替えるため、表示中のページを data 属性で選ぶ。
    dialog.current?.setAttribute('data-report', kind);
    dialog.current?.showModal();
  }

  return <>
    <div className={styles.gallery}>
      {reports.map((report) => <button className={styles.galleryItem} key={report.kind} type="button" onClick={() => open(report.kind)} aria-label={`${report.label}の架空サンプルを拡大表示`}>
        <div className={styles.galleryPreview}><ReportVisual kind={report.kind} /></div>
        <span className={styles.galleryCaption}><strong>{report.label}</strong><span>{report.detail}</span><span aria-hidden="true">拡大する ↗</span></span>
      </button>)}
    </div>
    <dialog className={styles.reportDialog} ref={dialog} onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }} aria-label="架空の成果物サンプル">
      <button className={styles.dialogClose} type="button" onClick={() => dialog.current?.close()} aria-label="閉じる">×</button>
      <p className={styles.dialogHint}>資料は左右にスクロールして確認できます。</p>
      {reports.map((report) => <div className={styles.dialogSheet} data-kind={report.kind} key={report.kind}><ReportVisual kind={report.kind} /></div>)}
    </dialog>
  </>;
}
