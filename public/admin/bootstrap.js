// No OAuth endpoint is guessed; fail closed until deployment configuration exists.
window.CMS_MANUAL_INIT = true;
(async () => {
  const status = document.getElementById('cms-status');
  try {
    const response = await fetch('/admin/status.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('config');
    const state = await response.json();
    if (!state.configured) {
      status.querySelector('p').textContent = '認証の初期設定待ちです。管理者は docs/CMS_SETUP.md に従い、GitHub OAuth と CMS_AUTH_BASE_URL を設定してください。';
      return;
    }
    const script = document.createElement('script');
    script.src = '/admin/vendor/decap-cms.js';
    script.onload = () => {
      window.CMS.init();
      status.remove();
    };
    script.onerror = () => { status.querySelector('p').textContent = 'CMSを読み込めませんでした。再読み込みし、管理者に配信設定の確認を依頼してください。'; };
    document.head.append(script);
  } catch {
    status.querySelector('p').textContent = '管理画面の設定を取得できません。管理者に再ビルドと配信設定の確認を依頼してください。';
  }
})();
