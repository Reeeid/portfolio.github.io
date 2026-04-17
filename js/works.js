// Works modal management
const WORKS = [
  {
    title: 'セキュリティ診断ツール',
    thumb: 'SEC',
    bg: '#1a0f2e',
    color: '#a78bfa',
    desc: 'Pythonで作成したWebアプリケーションの脆弱性チェックツール。OWASP Top10を参考に設計。',
    stack: ['Python', 'Flask', 'Security', 'OWASP']
  },
  {
    title: 'LPテンプレート',
    thumb: 'LP',
    bg: '#0a1f18',
    color: '#34d399',
    desc: 'アニメーション・ダークモード・スクロール出現・モーダルを含むLP用テンプレート。',
    stack: ['HTML', 'CSS', 'JavaScript', 'Animation']
  },
  {
    title: 'Intune 管理スクリプト',
    thumb: 'MDM',
    bg: '#1f1008',
    color: '#fb923c',
    desc: 'Microsoft Intuneを活用したデバイス管理の自動化スクリプト集。PowerShellで実装。',
    stack: ['PowerShell', 'Intune', 'Azure AD', 'MDM']
  }
];

export function openWork(i) {
  const w = WORKS[i];
  document.getElementById('wTitle').textContent = w.title;
  const th = document.getElementById('wThumb');
  th.textContent = w.thumb;
  th.style.background = w.bg;
  th.style.color = w.color;
  document.getElementById('wDesc').textContent = w.desc;
  document.getElementById('wStack').innerHTML = w.stack.map(s => `<span class="mstag">${s}</span>`).join('');
  document.getElementById('wModal').classList.add('open');
}

export function closeWork() {
  document.getElementById('wModal').classList.remove('open');
}

export function closeWorkOut(e) {
  if (e.target === document.getElementById('wModal')) {
    closeWork();
  }
}
