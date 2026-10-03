// The OAuth token stays in memory only. Never place it in a URL or browser storage.
const $ = (id) => document.getElementById(id);
let config;
let token = '';
let items = [];
let nextBefore = null;

function message(value) { $('message').textContent = value; }
function node(tag, value, className) {
  const element = document.createElement(tag);
  element.textContent = value;
  if (className) element.className = className;
  return element;
}

async function api(path) {
  const response = await fetch(`${config.formApiOrigin}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store',
  });
  if (response.status === 401) { logout(); throw new Error('権限を確認できませんでした。再ログインしてください。'); }
  if (!response.ok) throw new Error('送信履歴を取得できませんでした。');
  return response;
}

function logout() {
  token = '';
  items = [];
  $('inbox').hidden = true;
  $('gate').hidden = false;
  $('logout').hidden = true;
  $('list').replaceChildren();
  $('detail').replaceChildren(node('h2', '内容'), node('p', '左の一覧から選択してください。'));
}

async function login() {
  if (!config?.authOrigin || !config?.formApiOrigin) { message('管理者向け接続設定がまだありません。'); return; }
  message('GitHub認証画面を開きます。');
  const popup = window.open(`${config.authOrigin}/auth?provider=github&site_id=${location.hostname}`, 'neunonInboxAuth', 'popup,width=620,height=720');
  if (!popup) { message('ポップアップがブロックされました。許可して再試行してください。'); return; }
  const timeout = setTimeout(() => { window.removeEventListener('message', receive); message('認証がタイムアウトしました。再試行してください。'); }, 120000);
  async function receive(event) {
    if (event.origin !== config.authOrigin || event.source !== popup) return;
    if (event.data === 'authorizing:github') {
      popup.postMessage('authorizing:github', config.authOrigin);
      return;
    }
    if (typeof event.data !== 'string' || !event.data.startsWith('authorization:github:success:')) return;
    clearTimeout(timeout);
    window.removeEventListener('message', receive);
    try {
      const result = JSON.parse(event.data.slice('authorization:github:success:'.length));
      if (!result.token || result.provider !== 'github') throw new Error('認証に失敗しました。');
      token = result.token;
      await load(false);
      $('gate').hidden = true;
      $('inbox').hidden = false;
      $('logout').hidden = false;
      message('');
    } catch (error) { logout(); message(error.message || '認証に失敗しました。'); }
  }
  window.addEventListener('message', receive);
}

async function load(append) {
  const params = new URLSearchParams();
  if (append && nextBefore) params.set('before', nextBefore);
  if ($('type').value !== 'all') params.set('type', $('type').value);
  if ($('search').value.trim()) params.set('q', $('search').value.trim());
  const response = await api(`/submissions?${params}`);
  const result = await response.json();
  items = append ? items.concat(result.items) : result.items;
  nextBefore = result.nextBefore;
  $('more').hidden = !nextBefore;
  renderList();
}

function renderList() {
  const nodes = items.map((item) => {
    const button = node('button', '', 'item');
    button.type = 'button';
    button.append(node('strong', `${item.formType === 'entry' ? '学生' : '企業'}｜${item.name || '名前未設定'}`),
      node('small', `${new Date(item.createdAt).toLocaleString('ja-JP')}　${item.company || item.email}`));
    button.addEventListener('click', () => openDetail(item.id, button));
    return button;
  });
  $('list').replaceChildren(...(nodes.length ? nodes : [node('p', '該当する送信はありません。')]));
}

async function openDetail(id, button) {
  message('');
  try {
    const response = await api(`/submissions/${encodeURIComponent(id)}`);
    const item = await response.json();
    document.querySelectorAll('.item').forEach((element) => element.classList.remove('active'));
    button.classList.add('active');
    const detail = $('detail');
    detail.replaceChildren(node('h2', item.formType === 'entry' ? '学生エントリー' : '企業お問い合わせ'),
      node('p', `${new Date(item.createdAt).toLocaleString('ja-JP')}　${item.status === 'sent' ? 'メール送信済み' : item.status === 'failed' ? '送信エラー' : '送信確認中'}`, 'meta'));
    const labels = item.formType === 'entry'
      ? { name:'お名前', email:'メールアドレス', school:'大学・学部・学年', experience:'スキル・経験', motivation:'志望動機', portfolio:'ポートフォリオURL' }
      : { company:'会社名', department:'部署名', name:'お名前', email:'メールアドレス', tel:'電話番号', topic:'ご相談内容の種別', talent:'関心のある人材', message:'ご相談内容' };
    const dl = document.createElement('dl');
    for (const [key, label] of Object.entries(labels)) {
      if (!item.values[key]) continue;
      dl.append(node('dt', label), node('dd', item.values[key]));
    }
    detail.append(dl);
    if (item.hasAttachment) {
      const download = node('button', `添付をダウンロード：${item.attachmentName}`);
      download.addEventListener('click', () => downloadAttachment(item.id, item.attachmentName));
      detail.append(download);
    }
  } catch (error) { message(error.message); }
}

async function downloadAttachment(id, filename) {
  try {
    const response = await api(`/submissions/${encodeURIComponent(id)}/attachment`);
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'attachment';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (error) { message(error.message); }
}

$('login').addEventListener('click', login);
$('logout').addEventListener('click', logout);
$('reload').addEventListener('click', () => load(false).catch((error) => message(error.message)));
$('more').addEventListener('click', () => load(true).catch((error) => message(error.message)));
$('type').addEventListener('change', () => load(false).catch((error) => message(error.message)));
let searchTimer;
$('search').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => load(false).catch((error) => message(error.message)), 300);
});
fetch('/admin/status.json', { cache:'no-store' }).then((response) => response.json()).then((state) => {
  config = state;
  if (!state.configured || !state.formApiOrigin) message('管理者向け接続設定がまだありません。');
}).catch(() => message('管理者向け接続設定を取得できません。'));
