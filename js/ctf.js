export function initCTF() {
  const input = document.getElementById('flagInput');
  const body  = document.getElementById('termBody');
  if (!input || !body) return;

  const FLAG_HASH = 'f0ab2df87fa48d97d8d2e87a69403b115b2a1d18d046153dd6bc0cda1bbb31a8';

  async function verifyFlag(input) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    const hex = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
    return hex === FLAG_HASH;
  }

  // Virtual filesystem matching actual repo structure
  const FS = {
    'index.html':     ['view-source is more fun than cat.'],
    'robots.txt':     null,   // fetched dynamically
    'package.json':   ['{ "name": "portfolio", "version": "1.0.0" }'],
    'css/':           ['main.css'],
    'js/':            ['main.js', 'hero.js', 'nav.js', 'skills.js', 'ctf.js'],
    'css/main.css':   ['~14kb of style. boring.'],
    'js/main.js':     ['entry point. nothing spicy.'],
    'js/ctf.js':      ["you're already inside it."],
    '.hidden': [
      // base64 placeholder — replace with real hint path when CTF is ready
      'aGludDogbG9vayBkZWVwZXIgaW4gdGhlIHNvdXJjZQ==',
    ],
  };

  // ── level progression ──────────────────────────────────
  const LEVELS = { lv0: false, lv1: false };

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem('r3id_ctf') || '{}');
      Object.assign(LEVELS, saved);
    } catch {}
  }

  function saveProgress() {
    try { localStorage.setItem('r3id_ctf', JSON.stringify(LEVELS)); } catch {}
  }

  function levelClear(lv, lines) {
    if (LEVELS[lv]) return;
    LEVELS[lv] = true;
    saveProgress();
    setTimeout(() => {
      print('');
      print('─────────────────────────────────', 'tc-dim');
      lines.forEach(l => print(l, 'tc-win'));
      print('─────────────────────────────────', 'tc-dim');
      print('');
      scrollBottom();
    }, 400);
  }

  // ── helpers ────────────────────────────────────────────
  function print(text, cls = '') {
    const line = document.createElement('div');
    line.className = 'term-line' + (cls ? ' ' + cls : '');
    line.textContent = text;
    body.insertBefore(line, document.getElementById('termInputRow'));
  }

  function printLines(lines, cls = '') {
    lines.forEach(l => print(l, cls));
  }

  function scrollBottom() { body.scrollTop = body.scrollHeight; }

  function clearScreen() {
    const row = document.getElementById('termInputRow');
    while (body.firstChild && body.firstChild !== row) body.removeChild(body.firstChild);
  }

  // ── command definitions ────────────────────────────────
  // Root-level entries only (no slashes in name = root file/dir)
  const ROOT = Object.keys(FS).filter(k => !k.includes('/') || k.endsWith('/'));

  function cmdLs(args) {
    const showHidden = args.some(a => a.includes('a'));
    const path = args.find(a => !a.startsWith('-')) || '';

    let entries;
    if (path && FS[path + '/']) {
      entries = FS[path + '/'];
      return [entries.join('    ')];
    }
    entries = ROOT.filter(f => showHidden || !f.startsWith('.'));
    return [entries.join('    ')];
  }

  async function cmdCat(args) {
    if (!args.length) return ['usage: cat <filename>'];
    const name = args[0];

    if (name === 'robots.txt') {
      try {
        const res  = await fetch('/robots.txt');
        const text = await res.text();
        const lines = text.trimEnd().split('\n');
        levelClear('lv1', [
          '[ Lv.1 CLEAR ]',
          "you found something the crawler wasn't supposed to see.",
          'next: visit the disallowed path.',
        ]);
        return lines;
      } catch {
        return ['cat: robots.txt: fetch failed'];
      }
    }

    if (name === '.hidden') {
      levelClear('lv0', [
        '[ Lv.0 CLEAR ]',
        'good eyes. now decode what you found.',
        'next: view-source and look deeper.',
      ]);
    }

    if (name in FS && FS[name] !== null) return FS[name];
    return ['cat: ' + name + ': No such file or directory'];
  }

  function cmdEcho(args) {
    return [args.join(' ')];
  }

  function cmdUname(args) {
    if (args.includes('-a')) return ['R3ID OS v2026.07 #1 SMP ctf x86_64 GNU/Linux'];
    return ['R3ID OS'];
  }

  const COMMANDS = {
    help: () => [
      'available commands:',
      '  ls [-a]            list files',
      '  cat <file>         read file',
      '  pwd                print working directory',
      '  cd <dir>           change directory',
      '  echo <text>        print text',
      '  uname [-a]         system info',
      '  id                 user info',
      '  whoami             who are you',
      '  hint               get a hint',
      '  flag <R3ID{...}>   submit flag',
      '  clear              clear terminal',
    ],
    whoami: () => ['stranger'],
    id:     () => ['uid=1337(stranger) gid=1337(ctf) groups=1337(ctf)'],
    pwd:    () => ['/home/r3id'],
    cd:     (args) => args.length && args[0] !== '~'
                        ? ['cd: ' + args[0] + ': permission denied']
                        : [],
    ls:     cmdLs,
    cat:    cmdCat,
    echo:   cmdEcho,
    uname:  cmdUname,
    hint:   () => [
      'hint: this page has more layers than it looks.',
      'hint: start from the source.',
      'hint: or just poke around here first.',
    ],
    flag: async (args) => {
      if (!args.length) return ['usage: flag <R3ID{...}>'];
      const input = args[0];
      if (!input.toUpperCase().startsWith('R3ID{')) return ['invalid flag format. expected R3ID{...}'];
      if (await verifyFlag(input)) {
        printLines(['',
          '██████╗  ██████╗  ██████╗ ██████╗ ',
          '██╔════╝ ██╔═══██╗██╔═══██╗██╔══██╗',
          '██║  ███╗██║   ██║██║   ██║██║  ██║',
          '██║   ██║██║   ██║██║   ██║██║  ██║',
          '╚██████╔╝╚██████╔╝╚██████╔╝██████╔╝',
          '', '✓ Access granted. Flag is correct!',
        ], 'tc-win');
        print('Welcome to the other side.', 'tc-dim');
        return null;
      }
      return ['✗ Wrong flag. Keep digging.'];
    },
    clear: () => null,
  };

  // ── TAB completion ─────────────────────────────────────
  const CMD_NAMES = Object.keys(COMMANDS);

  function longestCommonPrefix(strs) {
    if (!strs.length) return '';
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
      while (!strs[i].startsWith(prefix)) prefix = prefix.slice(0, -1);
    }
    return prefix;
  }

  function getFileCompletions(partial) {
    if (partial.includes('/')) {
      // inside a directory e.g. "js/ma"
      const slash = partial.indexOf('/');
      const dir   = partial.slice(0, slash + 1);
      const rest  = partial.slice(slash + 1);
      return (FS[dir] || [])
        .map(f => dir + f)
        .filter(f => f.startsWith(partial));
    }
    // root level — include hidden only if partial starts with '.'
    return ROOT
      .filter(f => f.startsWith(partial) && (partial.startsWith('.') || !f.startsWith('.')));
  }

  function handleTab() {
    const val   = input.value;
    const parts = val.split(/\s+/);

    if (parts.length === 1) {
      // completing command
      const partial  = parts[0].toLowerCase();
      const matches  = CMD_NAMES.filter(c => c.startsWith(partial));
      if (!matches.length) return;
      if (matches.length === 1) {
        input.value = matches[0] + ' ';
        return;
      }
      // show candidates + extend to common prefix
      print('');
      printLines([matches.join('    ')], 'tc-dim');
      scrollBottom();
      const common = longestCommonPrefix(matches);
      if (common.length > partial.length) input.value = common;

    } else {
      // completing filename argument
      const partial = parts[parts.length - 1];
      const prefix  = parts.slice(0, -1).join(' ') + ' ';
      const matches = getFileCompletions(partial);
      if (!matches.length) return;
      if (matches.length === 1) {
        input.value = prefix + matches[0];
        return;
      }
      print('');
      printLines([matches.join('    ')], 'tc-dim');
      scrollBottom();
      const common = longestCommonPrefix(matches);
      if (common.length > partial.length) input.value = prefix + common;
    }
  }

  // ── input handler ──────────────────────────────────────
  input.addEventListener('keydown', async e => {
    if (e.key === 'Tab') { e.preventDefault(); handleTab(); return; }
    if (e.key !== 'Enter') return;

    const raw  = input.value.trim();
    input.value = '';
    if (!raw) return;

    print('r3id@ctf:~$ ' + raw, 'tc-dim');

    const parts = raw.split(/\s+/);
    const cmd   = parts[0].toLowerCase();
    const args  = parts.slice(1);

    if (cmd === 'clear') {
      clearScreen();
      scrollBottom();
      return;
    }

    if (COMMANDS[cmd]) {
      const result = await Promise.resolve(COMMANDS[cmd](args));
      if (result) printLines(result);
    } else {
      print(cmd + ': command not found — type help', 'tc-error');
    }

    print('');
    scrollBottom();
  });

  body.addEventListener('click', () => input.focus());

  // restore progress on load
  loadProgress();
  if (LEVELS.lv2) {
    print('[ resumed ] lv.0 + lv.1 + lv.2 cleared. submit the flag below.', 'tc-dim');
    print('');
  } else if (LEVELS.lv1) {
    print('[ resumed ] lv.0 + lv.1 cleared. next: /r3id_ctf.html', 'tc-dim');
    print('');
  } else if (LEVELS.lv0) {
    print('[ resumed ] lv.0 cleared. next: view-source.', 'tc-dim');
    print('');
  }

  // pick up lv2 clear set by r3id_ctf.html
  try {
    const saved = JSON.parse(localStorage.getItem('r3id_ctf') || '{}');
    if (saved.lv2 && !LEVELS.lv2) {
      LEVELS.lv2 = true;
      saveProgress();
      setTimeout(() => {
        print('');
        print('─────────────────────────────────', 'tc-dim');
        print('[ Lv.2 CLEAR ]', 'tc-win');
        print('you reversed the cipher. now submit the flag.', 'tc-win');
        print('─────────────────────────────────', 'tc-dim');
        print('');
        scrollBottom();
      }, 300);
    }
  } catch {}
}
