// Ticker section setup
export function initTicker() {
  const TI = ['Security', 'Frontend', 'Python', 'Intune', 'JavaScript', 'Network', 'HTML/CSS', 'PowerShell'];
  const tk = document.getElementById('tickerEl');
  tk.innerHTML = (TI.map(t => `<span>${t}</span><span class="sep"> ✦ </span>`).join('')).repeat(4);
}
