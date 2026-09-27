/* suangua · 三硬币六爻排盘引擎 + UI（纯前端，零依赖） */
'use strict';

/* ================= 基础数据 ================= */

/* 经卦：b = 三爻二进制（下→上），n = 自然象，e = 五行，sym = 卦符 */
const TRI = {
  '乾': { b: '111', n: '天', e: '金', sym: '☰' },
  '兑': { b: '110', n: '泽', e: '金', sym: '☱' },
  '离': { b: '101', n: '火', e: '火', sym: '☲' },
  '震': { b: '100', n: '雷', e: '木', sym: '☳' },
  '巽': { b: '011', n: '风', e: '木', sym: '☴' },
  '坎': { b: '010', n: '水', e: '水', sym: '☵' },
  '艮': { b: '001', n: '山', e: '土', sym: '☶' },
  '坤': { b: '000', n: '地', e: '土', sym: '☷' },
};
const TRI_BY_B = {};
Object.keys(TRI).forEach(k => { TRI_BY_B[TRI[k].b] = k; });

/* 卦名 = HEX_BY_TRI[下卦][上卦] */
const HEX_BY_TRI = {
  '乾': { '乾': '乾', '兑': '夬', '离': '大有', '震': '大壮', '巽': '小畜', '坎': '需', '艮': '大畜', '坤': '泰' },
  '兑': { '乾': '履', '兑': '兑', '离': '睽', '震': '归妹', '巽': '中孚', '坎': '节', '艮': '损', '坤': '临' },
  '离': { '乾': '同人', '兑': '革', '离': '离', '震': '丰', '巽': '家人', '坎': '既济', '艮': '贲', '坤': '明夷' },
  '震': { '乾': '无妄', '兑': '随', '离': '噬嗑', '震': '震', '巽': '益', '坎': '屯', '艮': '颐', '坤': '复' },
  '巽': { '乾': '姤', '兑': '大过', '离': '鼎', '震': '恒', '巽': '巽', '坎': '井', '艮': '蛊', '坤': '升' },
  '坎': { '乾': '讼', '兑': '困', '离': '未济', '震': '解', '巽': '涣', '坎': '坎', '艮': '蒙', '坤': '师' },
  '艮': { '乾': '遁', '兑': '咸', '离': '旅', '震': '小过', '巽': '渐', '坎': '蹇', '艮': '艮', '坤': '谦' },
  '坤': { '乾': '否', '兑': '萃', '离': '晋', '震': '豫', '巽': '观', '坎': '比', '艮': '剥', '坤': '坤' },
};

/* 文王六十四卦序 */
const KINGWEN = ['乾','坤','屯','蒙','需','讼','师','比','小畜','履','泰','否','同人','大有','谦','豫','随','蛊','临','观','噬嗑','贲','剥','复','无妄','大畜','颐','大过','坎','离','咸','恒','遁','大壮','晋','明夷','家人','睽','蹇','解','损','益','夬','姤','萃','升','困','井','革','鼎','震','艮','渐','归妹','丰','旅','巽','兑','涣','节','中孚','小过','既济','未济'];

/* 卦辞（周易原文，B 调味用） */
const GUA_CI = {
  '乾': '元亨利贞。',
  '坤': '元亨，利牝马之贞。君子有攸往，先迷后得主。利西南得朋，东北丧朋。安贞吉。',
  '屯': '元亨利贞。勿用有攸往，利建侯。',
  '蒙': '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',
  '需': '有孚，光亨，贞吉，利涉大川。',
  '讼': '有孚窒，惕，中吉，终凶。利见大人，不利涉大川。',
  '师': '贞，丈人吉，无咎。',
  '比': '吉。原筮，元永贞，无咎。不宁方来，后夫凶。',
  '小畜': '亨。密云不雨，自我西郊。',
  '履': '履虎尾，不咥人，亨。',
  '泰': '小往大来，吉，亨。',
  '否': '否之匪人，不利君子贞，大往小来。',
  '同人': '同人于野，亨。利涉大川，利君子贞。',
  '大有': '元亨。',
  '谦': '亨，君子有终。',
  '豫': '利建侯行师。',
  '随': '元亨利贞，无咎。',
  '蛊': '元亨，利涉大川。先甲三日，后甲三日。',
  '临': '元亨利贞。至于八月有凶。',
  '观': '盥而不荐，有孚颙若。',
  '噬嗑': '亨。利用狱。',
  '贲': '亨。小利有攸往。',
  '剥': '不利有攸往。',
  '复': '亨。出入无疾，朋来无咎。反复其道，七日来复。利有攸往。',
  '无妄': '元亨利贞。其匪正有眚，不利有攸往。',
  '大畜': '利贞。不家食吉，利涉大川。',
  '颐': '贞吉。观颐，自求口实。',
  '大过': '栋桡。利有攸往，亨。',
  '坎': '习坎，有孚，维心亨，行有尚。',
  '离': '利贞，亨。畜牝牛吉。',
  '咸': '亨，利贞，取女吉。',
  '恒': '亨，无咎，利贞。利有攸往。',
  '遁': '亨，小利贞。',
  '大壮': '利贞。',
  '晋': '康侯用锡马蕃庶，昼日三接。',
  '明夷': '利艰贞。',
  '家人': '利女贞。',
  '睽': '小事吉。',
  '蹇': '利西南，不利东北。利见大人，贞吉。',
  '解': '利西南。无所往，其来复吉。有攸往，夙吉。',
  '损': '有孚，元吉，无咎，可贞，利有攸往。曷之用？二簋可用享。',
  '益': '利有攸往，利涉大川。',
  '夬': '扬于王庭，孚号有厉。告自邑，不利即戎，利有攸往。',
  '姤': '女壮，勿用取女。',
  '萃': '亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。',
  '升': '元亨，用见大人，勿恤。南征吉。',
  '困': '亨，贞，大人吉，无咎。有言不信。',
  '井': '改邑不改井，无丧无得，往来井井。汔至亦未繘井，羸其瓶，凶。',
  '革': '巳日乃孚，元亨利贞，悔亡。',
  '鼎': '元吉，亨。',
  '震': '亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。',
  '艮': '艮其背，不获其身。行其庭，不见其人，无咎。',
  '渐': '女归吉，利贞。',
  '归妹': '征凶，无攸利。',
  '丰': '亨，王假之。勿忧，宜日中。',
  '旅': '小亨，旅贞吉。',
  '巽': '小亨，利有攸往，利见大人。',
  '兑': '亨，利贞。',
  '涣': '亨。王假有庙，利涉大川，利贞。',
  '节': '亨。苦节，不可贞。',
  '中孚': '豚鱼吉，利涉大川，利贞。',
  '小过': '亨，利贞。可小事，不可大事。飞鸟遗之音，不宜上，宜下，大吉。',
  '既济': '亨小，利贞。初吉，终乱。',
  '未济': '亨。小狐汔济，濡其尾，无攸利。',
};

/* 京房纳甲：按经卦（内卦三爻 / 外卦三爻的天干地支） */
const NAJIA = {
  '乾': { ig: '甲', iz: ['子', '寅', '辰'], og: '壬', oz: ['午', '申', '戌'] },
  '坎': { ig: '戊', iz: ['寅', '辰', '午'], og: '戊', oz: ['申', '戌', '子'] },
  '艮': { ig: '丙', iz: ['辰', '午', '戌'], og: '丙', oz: ['子', '寅', '辰'] },
  '震': { ig: '庚', iz: ['子', '寅', '辰'], og: '庚', oz: ['午', '申', '戌'] },
  '巽': { ig: '辛', iz: ['丑', '亥', '酉'], og: '辛', oz: ['未', '巳', '卯'] },
  '离': { ig: '己', iz: ['卯', '丑', '亥'], og: '己', oz: ['酉', '未', '巳'] },
  '坤': { ig: '乙', iz: ['未', '巳', '卯'], og: '癸', oz: ['丑', '亥', '酉'] },
  '兑': { ig: '丁', iz: ['巳', '卯', '丑'], og: '丁', oz: ['亥', '酉', '未'] },
};

const ZHI_E = { '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' };
const SHENG = { '金': '水', '水': '木', '木': '火', '火': '土', '土': '金' }; // A生B
const KE = { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' };   // A克B

const PALACE_ORDER = ['乾', '坎', '艮', '震', '巽', '离', '坤', '兑'];
const POS_NAME = ['八纯', '一世', '二世', '三世', '四世', '五世', '游魂', '归魂'];
const SHI_POS = [6, 1, 2, 3, 4, 5, 4, 3];
const YAO_POS = ['初', '二', '三', '四', '五', '上'];
const YAO_NUM = ['初', '二', '三', '四', '五', '上']; // 动爻序号用中文

/* ================= 引擎 ================= */

function liuQin(palaceE, branch) {
  const be = ZHI_E[branch];
  if (be === palaceE) return '兄弟';        // 比和
  if (SHENG[be] === palaceE) return '父母'; // 生我者
  if (SHENG[palaceE] === be) return '子孙'; // 我生者
  if (KE[be] === palaceE) return '官鬼';    // 克我者
  if (KE[palaceE] === be) return '妻财';    // 我克者
  return '?';
}

/* 生成八宫卦表：卦名 -> {lines, palace, pos, posName, shi, lower, upper} */
function genPalaces() {
  const map = {};
  for (const g of PALACE_ORDER) {
    const t = TRI[g].b;
    let cur = (t + t).split('').map(Number);
    const states = [cur.slice()];
    for (let i = 0; i < 5; i++) { cur = cur.slice(); cur[i] ^= 1; states.push(cur.slice()); } // 一世~五世
    cur = cur.slice(); cur[3] ^= 1; states.push(cur.slice());                                // 游魂（四爻再变）
    cur = cur.slice(); for (let i = 0; i < 3; i++) cur[i] = Number(t[i]); states.push(cur.slice()); // 归魂（内卦还原）
    states.forEach((s, idx) => {
      const lower = TRI_BY_B[s.slice(0, 3).join('')];
      const upper = TRI_BY_B[s.slice(3).join('')];
      const name = HEX_BY_TRI[lower][upper];
      map[name] = { lines: s, palace: g, pos: idx, posName: POS_NAME[idx], shi: SHI_POS[idx], lower, upper };
    });
  }
  return map;
}
const PALACES = genPalaces();

/* 由六爻（0/1，下→上）装卦 */
function hexFromLines(lines) {
  const lower = TRI_BY_B[lines.slice(0, 3).join('')];
  const upper = TRI_BY_B[lines.slice(3).join('')];
  const name = HEX_BY_TRI[lower][upper];
  const p = PALACES[name];
  const ying = p.shi <= 3 ? p.shi + 3 : p.shi - 3;
  const palaceE = TRI[p.palace].e;
  const rows = [];
  for (let i = 0; i < 6; i++) {
    const tri = i < 3 ? lower : upper;
    const nj = NAJIA[tri];
    const gan = i < 3 ? nj.ig : nj.og;
    const zhi = (i < 3 ? nj.iz : nj.oz)[i < 3 ? i : i - 3];
    rows.push({
      yao: i + 1,
      yang: !!lines[i],
      yaoTi: YAO_POS[i] + (lines[i] ? '九' : '六'),
      gan, zhi, element: ZHI_E[zhi],
      liuqin: liuQin(palaceE, zhi),
      shi: p.shi === i + 1,
      ying: ying === i + 1,
    });
  }
  return { name, palace: p.palace, posName: p.posName, shi: p.shi, ying, lower, upper, lines: lines.slice(), rows };
}

/* 三硬币报法 -> 卦。coins: 6 个字符串（如 '反反反'），下→上 */
function coinsToHex(coins) {
  if (coins.length !== 6) throw new Error('需要 6 次掷币，得到 ' + coins.length);
  const lines = [], values = [], dong = [];
  coins.forEach((c, i) => {
    const yangCount = (c.match(/[反背]/g) || []).length;
    let v, yang;
    if (yangCount === 3) { v = 9; yang = 1; }
    else if (yangCount === 2) { v = 8; yang = 0; }
    else if (yangCount === 1) { v = 7; yang = 1; }
    else if (yangCount === 0) { v = 6; yang = 0; }
    else throw new Error('第' + (i + 1) + '爻的报法不对：' + c);
    lines.push(yang); values.push(v);
    if (v === 6 || v === 9) dong.push(i + 1);
  });
  const ben = hexFromLines(lines);
  let bian = null;
  if (dong.length) {
    const bl = lines.slice();
    dong.forEach(y => { bl[y - 1] ^= 1; });
    bian = hexFromLines(bl);
  }
  return { coins, values, lines, dong, ben, bian };
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ================= UI（仅浏览器） ================= */

function yaoHtml(yang, moving, mini) {
  const line = yang
    ? '<div class="yline' + (mini ? ' mini' : '') + ' y"></div>'
    : '<div class="yline' + (mini ? ' mini' : '') + '"><b></b><b></b></div>';
  const mark = moving ? '<span class="dmark">' + (yang ? '○' : '✕') + '</span>' : '';
  return '<div class="yaocell">' + line + mark + '</div>';
}

/* 装卦表：ben.rows 从上爻到初爻；dongYao = [1..6]；bian = 装好的变卦或 null */
function zhuangguaTable(ben, dongYao, bian) {
  let h = '<table class="zg"><tr>' + (bian ? '<th>变卦 ' + escapeHtml(bian.name) + '</th>' : '<th></th>') + '<th>六亲 纳甲</th><th>本卦 ' + escapeHtml(ben.name) + '</th></tr>';
  for (let i = 5; i >= 0; i--) {
    const r = ben.rows[i];
    const isDong = dongYao.indexOf(i + 1) >= 0;
    h += '<tr><td>' + (bian ? yaoHtml(bian.lines[i], false, true) : '') + '</td>'
      + '<td class="mid"><span class="lq">' + escapeHtml(r.liuqin) + '</span>'
      + '<span class="gz">' + escapeHtml(r.gan + r.zhi + r.element) + '</span>'
      + '<span class="yti">' + escapeHtml(r.yaoTi) + '</span>'
      + (r.shi ? '<span class="sy">世</span>' : '')
      + (r.ying ? '<span class="sy">应</span>' : '')
      + (isDong ? '<span class="dmark">动' + (r.yang ? '○' : '✕') + '</span>' : '')
      + '</td><td>' + yaoHtml(r.yang, isDong, false) + '</td></tr>';
  }
  return h + '</table>';
}

function initUI() {
  const $ = id => document.getElementById(id);

  /* --- 标签页 --- */
  const tabs = document.querySelectorAll('#tabs .tab');
  function activate(name) {
    tabs.forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    ['paipan', 'tujian'].forEach(t => { $('tab-' + t).hidden = (t !== name); });
    if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
  }
  tabs.forEach(b => b.addEventListener('click', () => activate(b.dataset.tab)));
  const h = location.hash.slice(1);
  if (['paipan', 'tujian'].indexOf(h) >= 0) activate(h);

  /* --- 排盘：选币 --- */
  const COIN_TYPES = [
    { key: 'AAA', label: '反反反', mark: '老阳○', yang: 1, v: 9 },
    { key: 'AA_', label: '正反反', mark: '少阴', yang: 0, v: 8 },
    { key: 'A__', label: '正正反', mark: '少阳', yang: 1, v: 7 },
    { key: '___', label: '正正正', mark: '老阴✕', yang: 0, v: 6 },
  ];
  const sel = [null, null, null, null, null, null];
  let rowsHtml = '';
  for (let i = 5; i >= 0; i--) {
    rowsHtml += '<div class="crow"><span class="lbl">' + YAO_POS[i] + '爻</span>';
    COIN_TYPES.forEach(t => {
      rowsHtml += '<button class="cbtn" data-i="' + i + '" data-k="' + t.key + '">' + t.label + ' <span class="mk">' + t.mark + '</span></button>';
    });
    rowsHtml += '</div>';
  }
  $('coinRows').innerHTML = rowsHtml;
  $('coinRows').addEventListener('click', e => {
    const b = e.target.closest('.cbtn');
    if (!b) return;
    const i = +b.dataset.i;
    sel[i] = sel[i] === b.dataset.k ? null : b.dataset.k;
    b.parentElement.querySelectorAll('.cbtn').forEach(x => x.classList.toggle('on', x.dataset.k === sel[i]));
    $('goCast').disabled = sel.some(s => !s);
  });

  $('goCast').addEventListener('click', () => {
    const coins = sel.map(k => COIN_TYPES.find(t => t.key === k).label.replace(/\s+/g, ''));
    let r;
    try { r = coinsToHex(coins); } catch (err) { $('castResult').textContent = String(err); return; }
    const b = r.ben;
    let html = '<div class="card"><h2>《' + escapeHtml(b.name) + '》'
      + (r.bian ? '<span class="arrow">→</span>《' + escapeHtml(r.bian.name) + '》' : '')
      + '</h2>'
      + '<div class="meta">' + TRI[b.upper].n + '上' + TRI[b.lower].n + '下 · ' + b.palace + '宫' + b.posName + '卦 · 世' + YAO_POS[b.shi - 1] + '爻 应' + YAO_POS[b.ying - 1] + '爻'
      + (r.dong.length ? ' · 动爻：' + r.dong.map(y => YAO_NUM[y - 1]).join('、') : ' · 无动爻（静卦）') + '</div>'
      + zhuangguaTable(b, r.dong, r.bian)
      + '<div class="guaCi">' + escapeHtml(GUA_CI[b.name] || '') + '</div>';
    if (r.bian) html += '<div class="guaCi" style="color:#a3906a">' + escapeHtml(GUA_CI[r.bian.name] || '') + '</div>';
    const copyText = '卦：' + coins.join(' ') + '\n问：';
    html += '<div class="copybox"><textarea rows="2" id="copyTa">' + escapeHtml(copyText) + '</textarea>'
      + '<button id="copyBtn">复制报卦文本</button>'
      + '<div class="hint">在「问：」后面写上要算的事，连同报卦一起发给你的断卦搭子。</div></div></div>';
    $('castResult').innerHTML = html;
    $('copyBtn').addEventListener('click', () => {
      const ta = $('copyTa');
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      if (!ok && navigator.clipboard) { navigator.clipboard.writeText(ta.value).catch(() => {}); ok = true; }
      $('copyBtn').textContent = ok ? '已复制 ✓' : '请手动 Ctrl+C';
      setTimeout(() => { $('copyBtn').textContent = '复制报卦文本'; }, 1800);
    });
    $('castResult').scrollIntoView({ behavior: 'smooth' });
  });

  /* --- 卦图鉴 --- */
  function renderGrid(filter) {
    let g = '';
    KINGWEN.forEach((name, idx) => {
      if (filter && name.indexOf(filter) < 0) return;
      const p = PALACES[name];
      g += '<div class="gcard" data-name="' + name + '"><div class="num">' + (idx + 1) + '</div>'
        + '<div class="nm">' + name + '</div>'
        + '<div class="syms">' + TRI[p.upper].sym + '' + TRI[p.lower].sym + '</div></div>';
    });
    $('tjGrid').innerHTML = g || '<div class="empty">没找到这个卦</div>';
  }
  renderGrid('');
  $('tjSearch').addEventListener('input', e => renderGrid(e.target.value.trim()));
  $('tjGrid').addEventListener('click', e => {
    const c = e.target.closest('.gcard');
    if (!c) return;
    const name = c.dataset.name;
    const full = hexFromLines(PALACES[name].lines);
    $('tjDetail').innerHTML = '<div class="card"><h2>《' + name + '》第' + (KINGWEN.indexOf(name) + 1) + '卦</h2>'
      + '<div class="meta">' + TRI[full.upper].n + '上' + TRI[full.lower].n + '下 · ' + full.palace + '宫' + full.posName + '卦 · 世' + YAO_POS[full.shi - 1] + '爻 应' + YAO_POS[full.ying - 1] + '爻</div>'
      + zhuangguaTable(full, [], null)
      + '<div class="guaCi">' + escapeHtml(GUA_CI[name] || '') + '</div></div>';
    $('tjDetail').scrollIntoView({ behavior: 'smooth' });
  });
}

if (typeof document !== 'undefined' && document.getElementById('tabs')) initUI();

/* Node 导出（脚本/测试用） */
if (typeof module !== 'undefined') {
  module.exports = { TRI, HEX_BY_TRI, KINGWEN, GUA_CI, NAJIA, PALACES, liuQin, hexFromLines, coinsToHex, escapeHtml };
}
