/* 排盘引擎自测：node tests/engine.test.js */
'use strict';
const path = require('path');
const E = require(path.join(__dirname, '..', 'web', 'app.js'));
const assert = require('assert');

let pass = 0;
function ok(cond, msg) { if (!cond) { console.error('FAIL:', msg); process.exit(1); } console.log('ok -', msg); pass++; }

/* 1. 八宫 64 卦齐全且名字与文王序一一对应 */
ok(Object.keys(E.PALACES).length === 64, '八宫生成 64 卦');
ok(new Set(E.KINGWEN).size === 64, '文王序 64 卦无重复');
for (const n of Object.keys(E.PALACES)) ok(E.KINGWEN.includes(n), '宫表卦名在文王序中: ' + n);
ok(Object.keys(E.GUA_CI).length === 64, '卦辞 64 条齐全');

/* 2. 八宫归属抽查 */
const P = E.PALACES;
const cases = [
  ['乾', '乾', 0, 6], ['姤', '乾', 1, 1], ['遁', '乾', 2, 2], ['否', '乾', 3, 3],
  ['观', '乾', 4, 4], ['剥', '乾', 5, 5], ['晋', '乾', 6, 4], ['大有', '乾', 7, 3],
  ['既济', '坎', 3, 3], ['师', '坎', 7, 3], ['随', '震', 7, 3], ['大过', '震', 6, 4],
  ['谦', '兑', 5, 5], ['咸', '兑', 3, 3], ['中孚', '艮', 6, 4], ['渐', '艮', 7, 3],
  ['未济', '离', 3, 3], ['涣', '离', 5, 5], ['复', '坤', 1, 1], ['夬', '坤', 5, 5],
];
for (const [name, palace, pos, shi] of cases) {
  const p = P[name];
  ok(p.palace === palace && p.pos === pos && p.shi === shi,
    name + ' = ' + palace + '宫' + p.posName + ' 世' + shi + '（实际: ' + p.palace + '宫 pos' + p.pos + ' 世' + p.shi + '）');
}

/* 3. 纳甲装卦抽查 */
const qian = E.hexFromLines([1, 1, 1, 1, 1, 1]);
ok(qian.name === '乾', '乾为天卦名');
ok(qian.rows[0].gan === '甲' && qian.rows[0].zhi === '子' && qian.rows[0].liuqin === '子孙', '乾初爻 甲子水 子孙');
ok(qian.rows[4].gan === '壬' && qian.rows[4].zhi === '申' && qian.rows[4].liuqin === '兄弟', '乾五爻 壬申金 兄弟');
ok(qian.rows[5].shi === true && qian.rows[2].ying === true, '乾 世上爻 应三爻');

const gou = E.hexFromLines([0, 1, 1, 1, 1, 1]); // 下巽上乾 = 天风姤
ok(gou.name === '姤' && gou.palace === '乾' && gou.posName === '一世', '天风姤 乾宫一世');
ok(gou.rows[0].gan === '辛' && gou.rows[0].zhi === '丑' && gou.rows[0].liuqin === '父母', '姤初爻 辛丑土 父母');
ok(gou.rows[3].gan === '壬' && gou.rows[3].zhi === '午' && gou.rows[3].liuqin === '官鬼', '姤四爻 壬午火 官鬼');
ok(gou.rows[0].shi === true && gou.rows[3].ying === true, '姤 世初爻 应四爻');

const kan = E.hexFromLines([0, 1, 0, 0, 1, 0]); // 坎为水
ok(kan.rows[5].zhi === '子' && kan.rows[5].liuqin === '兄弟', '坎上爻 戊子水 兄弟');

/* 4. 硬币起卦全链路：贲(动初+四爻) → 旅 */
const r = E.coinsToHex(['反反反', '反反正', '反正正', '正正正', '反反正', '反正正']);
ok(JSON.stringify(r.values) === JSON.stringify([9, 8, 7, 6, 8, 7]), '六爻值 9/8/7/6/8/7');
ok(r.ben.name === '贲', '本卦 山火贲');
ok(r.dong.join(',') === '1,4', '动爻 初、四');
ok(r.bian.name === '旅', '变卦 火山旅');
ok(r.ben.palace === '艮' && r.ben.posName === '一世', '贲 艮宫一世');

/* 静卦无变卦 */
const r2 = E.coinsToHex(['反反正', '反反正', '反反正', '反反正', '反反正', '反反正']);
ok(r2.bian === null && r2.dong.length === 0, '六少阴 静卦无变');
ok(r2.ben.name === '坤', '坤为地');

console.log('\n全部通过，共', pass, '项');
