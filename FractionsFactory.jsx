import { useState, useEffect, useRef, useCallback } from 'react';

// ── i18n ──────────────────────────────────────────────────────────────────────
const STRINGS = {
  fr: {
    title: "L'Usine des Fractions",
    subtitle: 'Coupe · Emballe · Livre la fraction !',
    startBtn: (n) => `🚀 Commencer le Niveau ${n} !`,
    levelLabel: 'Niveau',
    orderOf: 'sur',
    managerNeeds: 'Le chef veut :',
    ofA: "d'un(e)",
    conveyor: 'TAPIS',
    cutTable: 'découpe',
    boxIt: 'BOÎTE !',
    bin: 'POUBELLE',
    handsFull: 'Les mains sont pleines ! Mets d\'abord dans la boîte ou la poubelle.',
    pickupFirst: 'Prends de la nourriture sur le tapis d\'abord !',
    alreadyCut: 'Déjà coupé ! Porte ça à la boîte.',
    bringCutPieces: 'Apporte des morceaux coupés pour les emballer !',
    nothingToThrow: 'Rien à jeter !',
    tossed: 'Jeté ! Va chercher plus de nourriture.',
    selectPiece: 'Sélectionne au moins un morceau !',
    needCuts: (n, d) => `Il faut ${n} coupe${n>1?'s':''} pour faire ${d} morceaux !`,
    cuttingTitle: (d) => `🔪 Table de découpe ÷${d}`,
    pickTitle: '🖐️ Choisis tes morceaux !',
    cutInstruction: (d) => `Clique sur les <strong>bonnes lignes</strong> pour couper en <strong>${d}</strong> morceaux égaux.`,
    cutsLeft: 'Coupes restantes :',
    selected: 'Sélectionnés :',
    doneCutting: 'Découpe terminée ✓',
    cancel: 'Annuler ✗',
    takePieces: (n) => `Prendre ${n} morceau${n>1?'x':''} ✓`,
    orderReminder: 'Commande :',
    boxTitle: '📦 Zone d\'emballage',
    orderLabel: 'Commande :',
    piecesInBox: (n) => `${n} morceau${n>1?'x':''} dans la boîte`,
    boxEmpty: 'La boîte est vide',
    commitOrder: 'Valider la commande ! ✓',
    keepWorking: 'Continuer →',
    perfect: 'Commande parfaite !',
    notQuite: 'Pas tout à fait…',
    starsEarned: (n) => `+${n} étoile${n>1?'s':''} !`,
    noStarsRetry: 'Les étoiles sont données uniquement à la première tentative !',
    nextOrder: 'Commande suivante ! →',
    finishLevel: 'Terminer le niveau ! 🏆',
    tryAgain: 'Réessayer ! 🔄',
    levelComplete: (n) => `Niveau ${n} terminé !`,
    starsTotal: (n) => `${n} étoile${n>1?'s':''} gagnée${n>1?'s':''} !`,
    amazing: 'Travail incroyable !',
    great: 'Excellent travail !',
    keepPractising: 'Continue à t\'entraîner !',
    nextLevel: 'Niveau suivant ▶',
    replay: 'Rejouer',
    menu: 'Menu',
    hint0: 'Va sur le tapis pour prendre de la nourriture !',
    hint1: 'Porte-la à une table de découpe !',
    hint2: 'Porte les morceaux à la zone d\'emballage !',
    hint3: 'Va chercher plus de nourriture pour compléter la commande !',
    hintBar: '↑ ↓ ← → pour bouger · Reste près d\'une station pendant 1 sec pour interagir',
    homeBtn: '🏠',
    homeConfirmTitle: 'Retourner au menu ?',
    homeConfirmMsg: 'Tu perdras ta progression dans ce niveau.',
    clearBoxTitle: 'Vider la zone d\'emballage ?',
    clearBoxMsg: 'Tous les morceaux dans la boîte seront retirés.',
    yes: 'Oui',
    no: 'Non',
    settings: '⚙️ Réglages',
    language: 'Langue',
    character: 'Personnage',
    male: '👦 Garçon',
    female: '👧 Fille',
    music: '🎵 Musique',
    sfx: '🔊 Sons',
    on: 'On',
    off: 'Off',
    close: 'Fermer',
    locked: '🔒 Verrouillé',
    boxEmpty2: 'La boîte est vide — ajoute des morceaux !',
    wrongSizes: (n) => n === 1 ? "Le morceau n'est pas de la taille correcte !" : "Les morceaux ne sont pas tous de la même taille ! Assure-toi de couper correctement.",
    wrongDen: (pd, od) => `Tu as livré des morceaux de 1/${pd}, mais la commande voulait des ${od}èmes.`,
    wrongNum: (pn, pd, an, ad) => `Tu as livré ${pn}/${pd}. La commande voulait ${an}/${ad}. ${pn < an ? 'Il fallait plus de morceaux !' : 'Trop de morceaux !'}`,
    successMsg: (n, d) => `${n}/${d} — livré parfaitement !`,
    levelNames: ['Démarrage', 'En route', 'On s\'active', 'Expert boulanger', 'Chef étoilé'],
    foodNames: { pie:'tarte', pizza:'pizza', apple:'pomme', orange:'orange', cake:'gâteau', bread:'pain', cucumber:'concombre', chocolate:'chocolat', butter:'beurre', flapjack:'flapjack' },
    ordersPerLevel: 'Commandes par niveau',
  },
  en: {
    title: 'The Fractions Factory',
    subtitle: 'Cut it · Box it · Deliver the fraction!',
    startBtn: (n) => `🚀 Start Level ${n}!`,
    levelLabel: 'Level',
    orderOf: 'of',
    managerNeeds: 'Manager needs:',
    ofA: 'of a',
    conveyor: 'CONVEYOR',
    cutTable: 'cut table',
    boxIt: 'BOX IT!',
    bin: 'BIN',
    handsFull: 'Hands full! Box it or bin it first.',
    pickupFirst: 'Pick up food from the conveyor first!',
    alreadyCut: 'Already cut! Take these to the boxing area.',
    bringCutPieces: 'Bring cut pieces to box them!',
    nothingToThrow: 'Nothing to throw away!',
    tossed: 'Tossed! Go get more food.',
    selectPiece: 'Select at least one piece!',
    needCuts: (n, d) => `Need ${n} cut${n>1?'s':''} to make ${d} pieces!`,
    cuttingTitle: (d) => `🔪 Cutting Table ÷${d}`,
    pickTitle: '🖐️ Pick Your Pieces!',
    cutInstruction: (d) => `Click the <strong>right lines</strong> to cut into <strong>${d}</strong> equal pieces.`,
    cutsLeft: 'Cuts left:',
    selected: 'Selected:',
    doneCutting: 'Done Cutting ✓',
    cancel: 'Cancel ✗',
    takePieces: (n) => `Take ${n} Piece${n>1?'s':''} ✓`,
    orderReminder: 'Order:',
    boxTitle: '📦 Boxing Area',
    orderLabel: 'Order:',
    piecesInBox: (n) => `${n} piece${n>1?'s':''} in the box`,
    boxEmpty: 'Box is empty',
    commitOrder: 'Commit Order! ✓',
    keepWorking: 'Keep Working →',
    perfect: 'Perfect Order!',
    notQuite: 'Not quite…',
    starsEarned: (n) => `+${n} star${n>1?'s':''} !`,
    noStarsRetry: 'Stars only awarded on first attempt!',
    nextOrder: 'Next Order! →',
    finishLevel: 'Finish Level! 🏆',
    tryAgain: 'Try Again! 🔄',
    levelComplete: (n) => `Level ${n} Complete!`,
    starsTotal: (n) => `${n} star${n>1?'s':''} earned!`,
    amazing: 'Amazing work!',
    great: 'Great job!',
    keepPractising: 'Keep practising!',
    nextLevel: 'Next Level ▶',
    replay: 'Replay',
    menu: 'Menu',
    hint0: 'Walk to the conveyor belt to pick up food!',
    hint1: 'Take it to a cutting table!',
    hint2: 'Take your pieces to the boxing area!',
    hint3: 'Go get more food to complete the order!',
    hintBar: '↑ ↓ ← → to move · Stand near a station for 1 sec to interact',
    homeBtn: '🏠',
    homeConfirmTitle: 'Return to menu?',
    homeConfirmMsg: 'You will lose your progress in this level.',
    clearBoxTitle: 'Empty the boxing area?',
    clearBoxMsg: 'All pieces currently in the box will be removed.',
    yes: 'Yes',
    no: 'No',
    settings: '⚙️ Settings',
    language: 'Language',
    character: 'Character',
    male: '👦 Boy',
    female: '👧 Girl',
    music: '🎵 Music',
    sfx: '🔊 Sound FX',
    on: 'On',
    off: 'Off',
    close: 'Close',
    locked: '🔒 Locked',
    boxEmpty2: 'The box is empty — add some pieces first!',
    wrongSizes: (n) => n === 1 ? "The piece is not the right size! Make sure you cut correctly." : "The pieces aren't all the same size! Make sure you cut correctly.",
    wrongDen: (pd, od) => `You delivered pieces cut into ${pd}s, but the order needed ${od}ths.`,
    wrongNum: (pn, pd, an, ad) => `You delivered ${pn}/${pd}. Order asked for ${an}/${ad}. ${pn < an ? 'You needed more pieces!' : 'Too many pieces!'}`,
    successMsg: (n, d) => `${n}/${d} — perfectly delivered!`,
    levelNames: ['Getting Started', 'Warming Up', 'Getting Busy', 'Expert Baker', 'Master Chef'],
    foodNames: { pie:'pie', pizza:'pizza', apple:'apple', orange:'orange', cake:'cake', bread:'bread', cucumber:'cucumber', chocolate:'chocolate', butter:'butter', flapjack:'flapjack' },
    ordersPerLevel: 'Orders per level',
  },
};

// ── Constants ──────────────────────────────────────────────────────────────────
const GAME_W = 900;
const GAME_H = 600;
const PLAYER_SPEED = 190;
const PLAYER_R = 18;
const INTERACT_TIME = 1000;
const INTERACT_DIST = 36;
const FRAC_TOLERANCE = 0.035;

const LEVELS = [
  { id:1, emoji:'⭐',     tables:[2,3,4,5],   type:'proper',   decoys:1, spo:1 },
  { id:2, emoji:'⭐',     tables:[2,4,5,8],   type:'proper',   decoys:2, spo:1 },
  { id:3, emoji:'⭐⭐',   tables:[3,4,6,8],   type:'mixed',    decoys:2, spo:2 },
  { id:4, emoji:'⭐⭐⭐', tables:[3,5,7,10],  type:'improper', decoys:3, spo:3 },
  { id:5, emoji:'⭐⭐⭐', tables:[4,7,11,12], type:'improper', decoys:4, spo:3 },
];

const ROUND_FOODS = ['pie','pizza','apple','orange','cake'];
const RECT_FOODS  = ['bread','cucumber','chocolate','butter','flapjack'];

// Station layout: landscape conveyor top-left, tables single row at bottom
const ST = {
  conveyor: { x:18,  y:75,  w:290, h:82  },
  boxing:   { x:700, y:68,  w:160, h:170 },
  bin:      { x:700, y:260, w:160, h:90  },
  table0:   { x:100, y:458, w:120, h:95  },
  table1:   { x:260, y:458, w:120, h:95  },
  table2:   { x:420, y:458, w:120, h:95  },
  table3:   { x:580, y:458, w:120, h:95  },
};

const TABLE_COLORS = ['#C0392B','#2980B9','#27AE60','#D35400'];

// Food fill colours (used for cutting display and mini pieces)
const FOOD_FILL = {
  pie:'#E8C470', pizza:'#E07820', apple:'#E74C3C', orange:'#F39C12', cake:'#F4A7C3',
  bread:'#E8C470', cucumber:'#27AE60', chocolate:'#4A2C2A', butter:'#FFF9C4', flapjack:'#D4940F',
};

// Contrasting guide/cut-line colours per food
const LINE_COLORS = {
  pie:        { guide:'#1A237E', cut:'#C62828' },
  pizza:      { guide:'#0D47A1', cut:'#C62828' },
  apple:      { guide:'#004D40', cut:'#FFD600' },
  orange:     { guide:'#1A237E', cut:'#C62828' },
  cake:       { guide:'#1B5E20', cut:'#C62828' },
  bread:      { guide:'#1A237E', cut:'#C62828' },
  cucumber:   { guide:'#4A148C', cut:'#FFD600' },
  chocolate:  { guide:'#F5F5F5', cut:'#FFD600' },
  butter:     { guide:'#1A237E', cut:'#C62828' },
  flapjack:   { guide:'#1A237E', cut:'#C62828' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function rnd(n) { return Math.floor(Math.random() * n); }

function generateOrders(levelId, count = 5) {
  const lvl = LEVELS[levelId - 1];
  const orders = [];
  const usedFractions = new Set();
  let roundTurn = Math.random() > 0.5;
  while (orders.length < count) {
    let num, den, tries = 0;
    do {
      den = lvl.tables[rnd(lvl.tables.length)];
      if (lvl.type === 'proper') {
        num = 1 + rnd(den - 1);
      } else if (lvl.type === 'improper') {
        do { num = den + 1 + rnd(2 * den); } while (num % den === 0);
      } else {
        if (Math.random() < 0.55) { num = 1 + rnd(den - 1); }
        else { do { num = den + 1 + rnd(den); } while (num % den === 0); }
      }
      if (num % den === 0) num = Math.max(1, num - 1);
      tries++;
    } while (usedFractions.has(`${num}/${den}`) && tries < 100);
    usedFractions.add(`${num}/${den}`);
    const pool = roundTurn ? ROUND_FOODS : RECT_FOODS;
    const food = pool[rnd(pool.length)];
    orders.push({ num, den, food, isRound: ROUND_FOODS.includes(food) });
    roundTurn = !roundTurn;
  }
  return orders;
}

function checkOrder(box, order, T) {
  if (!box.length) return { ok: false, msg: T.boxEmpty2 };
  const expected = 1 / order.den;
  const wrongSize = box.filter(p => Math.abs(p.fraction - expected) > FRAC_TOLERANCE);
  if (wrongSize.length > 0) return { ok: false, msg: T.wrongSizes(box.length) };
  const pn = box.length;
  if (pn !== order.num) return { ok: false, msg: T.wrongNum(pn, order.den, order.num, order.den) };
  return { ok: true, msg: T.successMsg(order.num, order.den) };
}

function generateCutLines(denominator, decoyCount, isRound) {
  const lines = [];
  if (isRound) {
    // N correct radial lines (each from centre to edge) divide circle into N equal sectors
    for (let i = 0; i < denominator; i++)
      lines.push({ angle: (360 * i) / denominator, isCorrect: true });
    let tries = 0;
    while (lines.filter(l => !l.isCorrect).length < decoyCount && tries < 300) {
      tries++;
      const candidate = 1 + rnd(358);
      const tooClose = lines.some(l => {
        const d = Math.abs(l.angle - candidate) % 360;
        return Math.min(d, 360 - d) < 20;
      });
      if (!tooClose) lines.push({ angle: candidate, isCorrect: false });
    }
  } else {
    for (let i = 1; i < denominator; i++)
      lines.push({ pos: i / denominator, isCorrect: true });
    let tries = 0;
    while (lines.filter(l => !l.isCorrect).length < decoyCount && tries < 300) {
      tries++;
      const candidate = (6 + rnd(88)) / 100;
      const tooClose = lines.some(l => Math.abs(l.pos - candidate) < 0.08);
      if (!tooClose) lines.push({ pos: candidate, isCorrect: false });
    }
  }
  // Shuffle so correct/decoy positions are random in the array
  return lines.sort(() => Math.random() - 0.5);
}

// Compute piece data (fractions + SVG geometry) from selected cut lines
function computePieces(selectedCuts, lines, isRound) {
  if (isRound) {
    const R = 130, cx = 160, cy = 160;
    const toP = (deg) => {
      const rad = (deg - 90) * Math.PI / 180;
      return { x: cx + Math.cos(rad) * R, y: cy + Math.sin(rad) * R };
    };
    const angles = [...selectedCuts].map(i => lines[i].angle).sort((a, b) => a - b);
    // Use cuts as explicit sector boundaries; wrap last sector back to first+360
    const bounds = angles.length > 0 ? [...angles, angles[0] + 360] : [0, 360];
    return bounds.slice(0, -1).map((startA, i) => {
      const endA = bounds[i + 1];
      const fraction = (endA - startA) / 360;
      const s = toP(startA), e = toP(endA);
      const large = (endA - startA) > 180 ? 1 : 0;
      const midA = (startA + endA) / 2;
      const midRad = (midA - 90) * Math.PI / 180;
      return { id: i, fraction, s, e, large, midRad, cx, cy };
    });
  } else {
    const rX = 22, rY = 22, rW = 396, rH = 126;
    const positions = [...selectedCuts].map(i => lines[i].pos).sort((a, b) => a - b);
    const bounds = [0, ...positions, 1];
    return bounds.slice(0, -1).map((startP, i) => ({
      id: i,
      fraction: bounds[i + 1] - startP,
      x: rX + startP * rW,
      w: (bounds[i + 1] - startP) * rW,
      rY, rH,
    }));
  }
}

// ── Audio ─────────────────────────────────────────────────────────────────────
let _actx = null;
function getAudioContext() {
  if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
  if (_actx.state === 'suspended') _actx.resume();
  return _actx;
}

const MELODY = [
  [523.25,0.15],[659.25,0.15],[783.99,0.15],[1046.5,0.15],
  [783.99,0.15],[659.25,0.15],[523.25,0.3],
  [392,0.15],[493.88,0.15],[587.33,0.15],[784,0.15],
  [587.33,0.15],[493.88,0.15],[392,0.3],
  [440,0.15],[554.37,0.15],[659.25,0.15],[880,0.15],
  [659.25,0.15],[554.37,0.15],[440,0.3],
  [392,0.15],[392,0.15],[493.88,0.15],[587.33,0.15],
  [493.88,0.3],[392,0.15],[523.25,0.45],
];

let musicTimeout = null;
let musicPlaying = false;

function startMusic() {
  if (musicPlaying) return;
  musicPlaying = true;
  let idx = 0;
  const actx = getAudioContext();
  const play = () => {
    if (!musicPlaying) return;
    const [freq, dur] = MELODY[idx % MELODY.length];
    idx++;
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.connect(gain); gain.connect(actx.destination);
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, actx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, actx.currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(0, actx.currentTime + dur * 0.9);
    osc.start(); osc.stop(actx.currentTime + dur);
    musicTimeout = setTimeout(play, dur * 1000);
  };
  play();
}

function stopMusic() {
  musicPlaying = false;
  if (musicTimeout) clearTimeout(musicTimeout);
  musicTimeout = null;
}

function playSFX(type) {
  try {
    const actx = getAudioContext();
    const t = actx.currentTime;
    if (type === 'pickup') {
      [523, 659, 784].forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.connect(g); g.connect(actx.destination);
        o.frequency.value = f; o.type = 'sine';
        g.gain.setValueAtTime(0.18, t + i*0.08);
        g.gain.linearRampToValueAtTime(0, t + i*0.08 + 0.1);
        o.start(t + i*0.08); o.stop(t + i*0.08 + 0.12);
      });
    } else if (type === 'slice') {
      const buf = actx.createBuffer(1, actx.sampleRate * 0.12, actx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random()*2-1) * (1 - i/data.length);
      const src = actx.createBufferSource();
      const filt = actx.createBiquadFilter();
      filt.type = 'bandpass'; filt.frequency.value = 2400;
      src.buffer = buf; src.connect(filt); filt.connect(actx.destination);
      src.start();
      const o = actx.createOscillator(), g = actx.createGain();
      o.connect(g); g.connect(actx.destination);
      o.frequency.value = 800; o.type = 'sawtooth';
      g.gain.setValueAtTime(0.2, t); g.gain.linearRampToValueAtTime(0, t+0.08);
      o.start(); o.stop(t+0.1);
    } else if (type === 'box') {
      const o = actx.createOscillator(), g = actx.createGain();
      o.connect(g); g.connect(actx.destination);
      o.frequency.value = 220; o.type = 'sine';
      g.gain.setValueAtTime(0.25, t); g.gain.linearRampToValueAtTime(0, t+0.18);
      o.start(); o.stop(t+0.2);
    } else if (type === 'success') {
      [523, 659, 784, 1047].forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.connect(g); g.connect(actx.destination);
        o.frequency.value = f; o.type = 'triangle';
        g.gain.setValueAtTime(0, t + i*0.1);
        g.gain.linearRampToValueAtTime(0.22, t + i*0.1 + 0.05);
        g.gain.linearRampToValueAtTime(0, t + i*0.1 + 0.3);
        o.start(t + i*0.1); o.stop(t + i*0.1 + 0.35);
      });
    } else if (type === 'fail') {
      [400, 320, 250].forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.connect(g); g.connect(actx.destination);
        o.frequency.value = f; o.type = 'sawtooth';
        g.gain.setValueAtTime(0.15, t + i*0.12);
        g.gain.linearRampToValueAtTime(0, t + i*0.12 + 0.15);
        o.start(t + i*0.12); o.stop(t + i*0.12 + 0.18);
      });
    } else if (type === 'conveyor') {
      const buf = actx.createBuffer(1, actx.sampleRate * 0.4, actx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random()*2-1) * 0.08 * (1 - i/data.length);
      const src = actx.createBufferSource();
      const filt = actx.createBiquadFilter();
      filt.type = 'lowpass'; filt.frequency.value = 180;
      src.buffer = buf; src.connect(filt); filt.connect(actx.destination);
      src.start();
    }
  } catch(e) { /* ignore audio errors */ }
}

// ── Food SVGs ─────────────────────────────────────────────────────────────────
function FoodSVG({ name, size = 40 }) {
  const s = size, c = s / 2, r = s * 0.44;
  const p = { width: s, height: s, viewBox: `0 0 ${s} ${s}` };
  switch (name) {
    case 'pie': return <svg {...p}><circle cx={c} cy={c} r={r} fill="#D4A853" stroke="#8B6914" strokeWidth="2.5"/><circle cx={c} cy={c} r={r*.82} fill="#E8C470"/>{[-1,0,1].map(i=><line key={`h${i}`} x1={c-r*.7} y1={c+i*r*.32} x2={c+r*.7} y2={c+i*r*.32} stroke="#C49040" strokeWidth="1.5" opacity=".55"/>)}{[-1,0,1].map(i=><line key={`v${i}`} x1={c+i*r*.32} y1={c-r*.7} x2={c+i*r*.32} y2={c+r*.7} stroke="#C49040" strokeWidth="1.5" opacity=".55"/>)}<circle cx={c} cy={c} r={r} fill="none" stroke="#8B6914" strokeWidth="2.5"/></svg>;
    case 'pizza': return <svg {...p}><circle cx={c} cy={c} r={r} fill="#F5D060" stroke="#C49020" strokeWidth="2.5"/><circle cx={c} cy={c} r={r*.78} fill="#E07820"/>{[{x:-.18,y:-.18},{x:.2,y:.08},{x:-.05,y:.22}].map((q,i)=><circle key={i} cx={c+q.x*s} cy={c+q.y*s} r={r*.13} fill="#C0392B"/>)}<circle cx={c} cy={c} r={r} fill="none" stroke="#C49020" strokeWidth="2.5"/></svg>;
    case 'apple': return <svg {...p}><circle cx={c} cy={c+r*.05} r={r} fill="#E74C3C" stroke="#A93226" strokeWidth="2.5"/><ellipse cx={c-r*.18} cy={c-r*.08} rx={r*.13} ry={r*.2} fill="#C0392B" opacity=".35"/><line x1={c} y1={c-r} x2={c+r*.18} y2={c-r*1.25} stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/><ellipse cx={c+r*.32} cy={c-r*1.15} rx={r*.22} ry={r*.13} fill="#27AE60" transform={`rotate(-30,${c+r*.32},${c-r*1.15})`}/></svg>;
    case 'orange': return <svg {...p}><circle cx={c} cy={c} r={r} fill="#F39C12" stroke="#D68910" strokeWidth="2.5"/>{[0,60,120,180,240,300].map(a=>{const rad=a*Math.PI/180;return <circle key={a} cx={c+Math.cos(rad)*r*.52} cy={c+Math.sin(rad)*r*.52} r={2} fill="#E67E22" opacity=".65"/>;})}<circle cx={c} cy={c-r*.82} r={r*.09} fill="#5D4037"/></svg>;
    case 'cake': return <svg {...p}><circle cx={c} cy={c} r={r} fill="#F4A7C3" stroke="#E91E8C" strokeWidth="2.5"/><circle cx={c} cy={c} r={r*.72} fill="#FFF0F8"/>{[0,120,240].map(a=>{const rad=a*Math.PI/180;return <circle key={a} cx={c+Math.cos(rad)*r*.36} cy={c+Math.sin(rad)*r*.36} r={r*.12} fill="#E91E8C"/>;})}<circle cx={c} cy={c-r*.68} r={r*.13} fill="#FF1744"/></svg>;
    case 'bread': return <svg {...p}><rect x={s*.07} y={s*.2} width={s*.86} height={s*.6} rx={s*.16} fill="#D4A853" stroke="#8B6914" strokeWidth="2.5"/><rect x={s*.14} y={s*.28} width={s*.72} height={s*.44} rx={s*.1} fill="#E8C470"/>{[.38,.52,.66].map(q=><line key={q} x1={s*q} y1={s*.28} x2={s*q} y2={s*.72} stroke="#C49040" strokeWidth="1.5" opacity=".5"/>)}</svg>;
    case 'cucumber': return <svg {...p}><rect x={s*.07} y={s*.22} width={s*.86} height={s*.56} rx={s*.28} fill="#27AE60" stroke="#1A7A40" strokeWidth="2.5"/><rect x={s*.17} y={s*.32} width={s*.66} height={s*.36} rx={s*.18} fill="#58D68D"/>{[-0.1,0,0.1].map(dy=>[-0.16,0,0.16].map(dx=><circle key={`${dx}${dy}`} cx={c+dx*s} cy={c+dy*s} r={1.8} fill="#1A7A40" opacity=".45"/>))}</svg>;
    case 'chocolate': return <svg {...p}><rect x={s*.07} y={s*.22} width={s*.86} height={s*.56} rx={s*.09} fill="#4A2C2A" stroke="#2C1A18" strokeWidth="2.5"/>{[1,2,3].map(col=>[1,2].map(row=><rect key={`${col}${row}`} x={s*.07+col*(s*.86/4)} y={s*.22+row*(s*.56/3)} width={s*.86/4} height={s*.56/3} fill="none" stroke="#2C1A18" strokeWidth="1"/>))}</svg>;
    case 'butter': return <svg {...p}><rect x={s*.07} y={s*.26} width={s*.86} height={s*.48} rx={s*.07} fill="#FFF9C4" stroke="#F9A825" strokeWidth="2.5"/><rect x={s*.15} y={s*.33} width={s*.7} height={s*.34} rx={s*.04} fill="#FFFDE7"/></svg>;
    case 'flapjack': return <svg {...p}><rect x={s*.07} y={s*.23} width={s*.86} height={s*.54} rx={s*.09} fill="#C8860A" stroke="#8B5E0A" strokeWidth="2.5"/><rect x={s*.12} y={s*.28} width={s*.76} height={s*.44} rx={s*.06} fill="#D4940F"/></svg>;
    default: return <svg {...p}><circle cx={c} cy={c} r={r} fill="#ccc"/></svg>;
  }
}

// ── Mini piece graphic shown above player ──────────────────────────────────────
function CarriedPieceSVG({ pieces, food, isRound }) {
  if (!pieces || !pieces.length) return null;
  const fill = FOOD_FILL[food] || '#ccc';
  if (isRound) {
    const size = 34, cx = size/2, cy = size/2, R = size*0.44;
    let startA = 0;
    return (
      <svg width={size} height={size} style={{filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.4))'}}>
        {pieces.map((p, i) => {
          const endA = startA + p.fraction * 360;
          const toP = (deg) => {
            const rad = (deg-90)*Math.PI/180;
            return { x: cx + Math.cos(rad)*R, y: cy + Math.sin(rad)*R };
          };
          const s = toP(startA), e = toP(endA);
          const large = (endA - startA) > 180 ? 1 : 0;
          const path = `M ${cx} ${cy} L ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y} Z`;
          startA = endA;
          return <path key={i} d={path} fill={fill} stroke="#333" strokeWidth="0.7"/>;
        })}
      </svg>
    );
  } else {
    const h = 12, totalW = 50;
    let startX = 0;
    return (
      <svg width={totalW} height={h} style={{filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.4))'}}>
        {pieces.map((p, i) => {
          const pw = p.fraction * totalW;
          const x = startX;
          startX += pw;
          return <rect key={i} x={x+0.5} y={0.5} width={pw-1} height={h-1} rx={2} fill={fill} stroke="#333" strokeWidth="0.7"/>;
        })}
      </svg>
    );
  }
}

// ── Cutting Display ───────────────────────────────────────────────────────────
function CuttingDisplay({ food, isRound, lines, selectedCuts, phase, computedPieces, selectedPieces, onLineClick, onPieceClick, denominator }) {
  const W = isRound ? 320 : 440, H = isRound ? 320 : 170;
  const cx = W/2, cy = H/2, R = 130;
  const rX = 22, rY = 22, rW = W-44, rH = H-44;
  const fill = FOOD_FILL[food] || '#ddd';
  const lc = LINE_COLORS[food] || { guide:'#1A237E', cut:'#C62828' };
  const maxCuts = isRound ? denominator : denominator - 1;

  const toPoint = (deg) => {
    const rad = (deg-90)*Math.PI/180;
    return { x: cx + Math.cos(rad)*R, y: cy + Math.sin(rad)*R };
  };

  return (
    <svg width={W} height={H} style={{ display:'block', margin:'0 auto', cursor:'default' }}>
      {isRound ? (
        phase === 'selecting' ? (
          computedPieces.map(piece => {
            const sel = selectedPieces.has(piece.id);
            const ox = sel ? Math.cos(piece.midRad)*9 : 0;
            const oy = sel ? Math.sin(piece.midRad)*9 : 0;
            const path = `M ${cx+ox} ${cy+oy} L ${piece.s.x+ox} ${piece.s.y+oy} A ${R} ${R} 0 ${piece.large} 1 ${piece.e.x+ox} ${piece.e.y+oy} Z`;
            return (
              <path key={piece.id} d={path} fill={fill}
                stroke={sel ? '#27AE60' : '#555'} strokeWidth={sel ? 3 : 2}
                style={{ cursor:'pointer', filter: sel ? 'drop-shadow(0 0 8px #27AE60)' : 'none' }}
                onClick={() => onPieceClick(piece.id)}/>
            );
          })
        ) : (
          <>
            <circle cx={cx} cy={cy} r={R} fill={fill} stroke="#333" strokeWidth="2.5"/>
            {lines.map((line, i) => {
              const p = toPoint(line.angle);
              const cut = selectedCuts.has(i);
              const canCut = selectedCuts.size < maxCuts || cut;
              return (
                <g key={i} style={{ cursor: canCut ? 'pointer' : 'not-allowed' }} onClick={() => onLineClick(i)}>
                  {/* Wide invisible hit area */}
                  <line x1={cx} y1={cy} x2={p.x} y2={p.y}
                    stroke="transparent" strokeWidth={18}/>
                  {/* Visual line */}
                  <line x1={cx} y1={cy} x2={p.x} y2={p.y}
                    stroke={cut ? lc.cut : lc.guide} strokeWidth={cut ? 3.5 : 2}
                    strokeDasharray={cut ? 'none' : '8,5'}
                    style={{ pointerEvents:'none' }}/>
                </g>
              );
            })}
          </>
        )
      ) : (
        phase === 'selecting' ? (
          computedPieces.map(piece => {
            const sel = selectedPieces.has(piece.id);
            return (
              <rect key={piece.id} x={piece.x+(sel?4:0)} y={rY} width={piece.w-(sel?8:0)} height={rH}
                rx={6} fill={fill} stroke={sel ? '#27AE60' : '#555'} strokeWidth={sel ? 3 : 2}
                style={{ cursor:'pointer', filter: sel ? 'drop-shadow(0 0 8px #27AE60)' : 'none' }}
                onClick={() => onPieceClick(piece.id)}/>
            );
          })
        ) : (
          <>
            <rect x={rX} y={rY} width={rW} height={rH} rx={8} fill={fill} stroke="#333" strokeWidth="2.5"/>
            {lines.map((line, i) => {
              const x = rX + line.pos * rW;
              const cut = selectedCuts.has(i);
              const canCut = selectedCuts.size < maxCuts || cut;
              return (
                <g key={i} style={{ cursor: canCut ? 'pointer' : 'not-allowed' }} onClick={() => onLineClick(i)}>
                  <line x1={x} y1={rY} x2={x} y2={rY+rH} stroke="transparent" strokeWidth={18}/>
                  <line x1={x} y1={rY} x2={x} y2={rY+rH}
                    stroke={cut ? lc.cut : lc.guide} strokeWidth={cut ? 3.5 : 2}
                    strokeDasharray={cut ? 'none' : '8,5'}
                    style={{ pointerEvents:'none' }}/>
                </g>
              );
            })}
          </>
        )
      )}
    </svg>
  );
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const colors = ['#FF6B6B','#FFE66D','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98FB98'];
  const pieces = Array.from({length:36},(_,i)=>({id:i,left:`${5+rnd(90)}%`,delay:`${(rnd(12)*0.1).toFixed(1)}s`,dur:`${(1.4+Math.random()).toFixed(1)}s`,color:colors[rnd(colors.length)],size:7+rnd(9),round:Math.random()>0.5,rotate:rnd(360)}));
  return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:50}}>
      {pieces.map(p=><div key={p.id} style={{position:'absolute',left:p.left,top:'-12px',width:p.size,height:p.size,background:p.color,borderRadius:p.round?'50%':'3px',animation:`confetti ${p.dur} ${p.delay} ease-in forwards`,transform:`rotate(${p.rotate}deg)`}}/>)}
    </div>
  );
}

// ── Knife SVG icon ────────────────────────────────────────────────────────────
function KnifeIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28">
      {/* Blade */}
      <path d="M 6 4 L 22 12 L 20 14 L 4 8 Z" fill="#C0C0C0" stroke="#888" strokeWidth="0.8"/>
      <path d="M 4 8 L 20 14 L 19 16 L 5 10 Z" fill="#A0A0A0"/>
      {/* Edge highlight */}
      <line x1="6" y1="4" x2="22" y2="12" stroke="white" strokeWidth="0.8" opacity="0.6"/>
      {/* Handle */}
      <rect x="3" y="14" width="8" height="5" rx="2" fill="#5D4037"/>
      <rect x="3.5" y="14.5" width="7" height="2" rx="1" fill="#795548" opacity="0.5"/>
    </svg>
  );
}

// ── Station renderers ─────────────────────────────────────────────────────────
function ConveyorBelt({ food, animKey, animating, T }) {
  const { x, y, w, h } = ST.conveyor;
  return (
    <div style={{position:'absolute',left:x,top:y,width:w,height:h,
      background:'#444',borderRadius:10,border:'3px solid #222',overflow:'hidden'}}>
      {/* Belt stripes — only animate when delivering */}
      <div style={{position:'absolute',inset:0,
        background:'repeating-linear-gradient(90deg,#3a3a3a 0px,#3a3a3a 18px,#585858 18px,#585858 36px)',
        animation: animating ? 'conveyor 0.35s linear infinite' : 'none'}}/>
      {/* Label */}
      <div style={{position:'absolute',top:4,left:0,right:0,textAlign:'center',
        color:'#FFD700',fontFamily:'Fredoka One,cursive',fontSize:11,zIndex:2,
        textShadow:'0 1px 2px rgba(0,0,0,0.8)'}}>{T.conveyor}</div>
      {/* Food slides in from left when animating */}
      {food && (
        <div key={animKey} style={{position:'absolute',top:'50%',left:'50%',
          transform:'translateY(-50%) translateX(-50%)',zIndex:3,
          animation: animating ? 'slideIn 1.2s ease-out forwards' : 'none'}}>
          <FoodSVG name={food} size={60}/>
        </div>
      )}
    </div>
  );
}

function CuttingTable({ index, denominator, glow, T }) {
  const { x, y, w, h } = ST[`table${index}`];
  return (
    <div style={{position:'absolute',left:x,top:y,width:w,height:h,
      background:TABLE_COLORS[index],borderRadius:12,
      border:`3px solid ${glow?'#FFD700':'#1a1a1a'}`,
      boxShadow:glow?'0 0 18px 4px #FFD700':'0 4px 10px rgba(0,0,0,0.4)',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2}}>
      <KnifeIcon size={26}/>
      <div style={{color:'white',fontFamily:'Fredoka One,cursive',fontSize:40,lineHeight:1}}>{denominator}</div>
      <div style={{color:'rgba(255,255,255,0.7)',fontFamily:'Nunito,sans-serif',fontSize:10}}>{T.cutTable}</div>
    </div>
  );
}

function BoxingArea({ glow, T, box }) {
  const { x, y, w, h } = ST.boxing;
  return (
    <div style={{position:'absolute',left:x,top:y,width:w,height:h,
      background:'#7D3C98',borderRadius:12,
      border:`3px solid ${glow?'#FFD700':'#1a1a1a'}`,
      boxShadow:glow?'0 0 18px 4px #FFD700':'0 4px 10px rgba(0,0,0,0.4)',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',
      padding:'8px 6px',gap:2}}>
      <div style={{fontSize:26}}>📦</div>
      <div style={{color:'white',fontFamily:'Fredoka One,cursive',fontSize:13}}>{T.boxIt}</div>
      {box && box.length > 0 && (
        <div style={{display:'flex',flexWrap:'wrap',gap:3,justifyContent:'center',marginTop:4}}>
          {box.map((piece,i)=>(
            <div key={i} style={{width:22,height:22,borderRadius:4,
              background:'rgba(255,255,255,0.28)',border:'1.5px solid rgba(255,255,255,0.55)',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:8,color:'white',fontFamily:'Fredoka One,cursive',lineHeight:1}}>
              1/{Math.round(1/piece.fraction)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BinStation({ glow, T }) {
  const { x, y, w, h } = ST.bin;
  return (
    <div style={{position:'absolute',left:x,top:y,width:w,height:h,
      background:'#626567',borderRadius:12,
      border:`3px solid ${glow?'#FFD700':'#1a1a1a'}`,
      boxShadow:glow?'0 0 18px 4px #FFD700':'0 4px 10px rgba(0,0,0,0.4)',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4}}>
      <div style={{fontSize:28}}>🗑️</div>
      <div style={{color:'white',fontFamily:'Fredoka One,cursive',fontSize:13}}>{T.bin}</div>
    </div>
  );
}

// ── Player ────────────────────────────────────────────────────────────────────
function Player({ x, y, carrying, interactingWith, interactProgress, moving, gender }) {
  const circ = 2*Math.PI*(PLAYER_R+10);
  const isFemale = gender === 'female';
  return (
    <div style={{position:'absolute',left:x-PLAYER_R,top:y-PLAYER_R,
      width:PLAYER_R*2,height:PLAYER_R*2,zIndex:10,
      animation:moving?'bob 0.28s ease-in-out infinite':'none'}}>
      {/* Progress ring */}
      {interactingWith && interactProgress > 0 && (
        <svg style={{position:'absolute',left:-(PLAYER_R+12),top:-(PLAYER_R+12),
          width:(PLAYER_R+12)*2,height:(PLAYER_R+12)*2,pointerEvents:'none'}}>
          <circle cx={PLAYER_R+12} cy={PLAYER_R+12} r={PLAYER_R+10}
            fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4"/>
          <circle cx={PLAYER_R+12} cy={PLAYER_R+12} r={PLAYER_R+10}
            fill="none" stroke="#FFD700" strokeWidth="4"
            strokeDasharray={`${interactProgress*circ} ${circ}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${PLAYER_R+12} ${PLAYER_R+12})`}/>
        </svg>
      )}
      {/* Carried display */}
      {carrying && (
        <div style={{position:'absolute',bottom:PLAYER_R*2+4,left:'50%',transform:'translateX(-50%)',
          display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
          {carrying.pieces
            ? <CarriedPieceSVG pieces={carrying.pieces} food={carrying.food} isRound={carrying.isRound}/>
            : <FoodSVG name={carrying.food} size={28}/>
          }
        </div>
      )}
      {/* Character SVG */}
      <svg width={PLAYER_R*2} height={PLAYER_R*2} viewBox="0 0 36 36">
        {/* Body */}
        <ellipse cx="18" cy="27" rx="10" ry="7.5" fill={isFemale?'#E91E8C':'#3498DB'}/>
        <ellipse cx="11" cy="27" rx="3.5" ry="5" fill={isFemale?'#C2185B':'#2980B9'}/>
        <ellipse cx="25" cy="27" rx="3.5" ry="5" fill={isFemale?'#C2185B':'#2980B9'}/>
        {/* Head */}
        <circle cx="18" cy="14" r="10" fill="#FDBCB4" stroke="#E8A898" strokeWidth="1"/>
        {/* Hat */}
        <rect x="9" y="5" width="18" height="8" rx="3" fill="white"/>
        <rect x="12" y="3" width="12" height="5" rx="2.5" fill="white"/>
        {isFemale && <ellipse cx="20" cy="3" rx="4" ry="2.5" fill="#FF80AB" transform="rotate(-20,20,3)"/>}
        {/* Eyes */}
        <circle cx="14.5" cy="14" r="1.8" fill="#2C3E50"/>
        <circle cx="21.5" cy="14" r="1.8" fill="#2C3E50"/>
        {isFemale && <path d="M 13 12 Q 14.5 11 16 12" stroke="#2C3E50" strokeWidth="1" fill="none"/>}
        {isFemale && <path d="M 20 12 Q 21.5 11 23 12" stroke="#2C3E50" strokeWidth="1" fill="none"/>}
        {/* Smile */}
        <path d="M 14 18 Q 18 22 22 18" stroke="#C0392B" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// ── Btn ───────────────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, color='#3498DB', disabled=false, small=false, style:extra={} }) => (
  <button onClick={disabled?undefined:onClick} style={{
    padding:small?'8px 18px':'11px 26px', borderRadius:50, border:'none',
    background:disabled?'#aaa':color, color:'white',
    fontFamily:'Fredoka One,cursive', fontSize:small?14:17,
    cursor:disabled?'not-allowed':'pointer',
    boxShadow:disabled?'none':'0 4px 14px rgba(0,0,0,0.25)',
    transition:'transform 0.1s', ...extra,
  }}
  onMouseEnter={e=>{if(!disabled)e.currentTarget.style.transform='scale(1.05)';}}
  onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';}}>
    {children}
  </button>
);

// ── Settings Panel ────────────────────────────────────────────────────────────
function SettingsPanel({ lang, setLang, gender, setGender, musicOn, setMusicOn, sfxOn, setSfxOn, ordersPerLevel, setOrdersPerLevel, inGame, onClose }) {
  const T = STRINGS[lang];
  const Toggle = ({on, onToggle, label}) => (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
      <span style={{fontFamily:'Nunito,sans-serif',fontSize:16,color:'#333'}}>{label}</span>
      <div onClick={onToggle} style={{width:56,height:28,borderRadius:14,
        background:on?'#27AE60':'#ccc',cursor:'pointer',position:'relative',transition:'background 0.2s'}}>
        <div style={{position:'absolute',top:3,left:on?30:3,width:22,height:22,borderRadius:'50%',
          background:'white',boxShadow:'0 1px 4px rgba(0,0,0,0.3)',transition:'left 0.2s'}}/>
      </div>
    </div>
  );
  return (
    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.65)',zIndex:100,
      display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'white',borderRadius:24,padding:'32px 40px',minWidth:340,
        boxShadow:'0 20px 60px rgba(0,0,0,0.5)',animation:'scaleIn 0.3s ease-out'}}>
        <div style={{fontFamily:'Fredoka One,cursive',fontSize:26,color:'#2C3E50',marginBottom:24,textAlign:'center'}}>
          {T.settings}
        </div>
        {/* Language */}
        <div style={{marginBottom:18}}>
          <div style={{fontFamily:'Nunito,sans-serif',fontSize:14,color:'#888',marginBottom:8}}>{T.language}</div>
          <div style={{display:'flex',gap:10}}>
            {['fr','en'].map(l=>(
              <div key={l} onClick={()=>setLang(l)} style={{flex:1,padding:'10px',borderRadius:12,textAlign:'center',
                background:lang===l?'#3498DB':'#F8F9FA',color:lang===l?'white':'#333',
                fontFamily:'Fredoka One,cursive',fontSize:16,cursor:'pointer',
                border:`2px solid ${lang===l?'#2980B9':'#eee'}`,transition:'all 0.15s'}}>
                {l==='fr'?'🇫🇷 Français':'🇬🇧 English'}
              </div>
            ))}
          </div>
        </div>
        {/* Character */}
        <div style={{marginBottom:18}}>
          <div style={{fontFamily:'Nunito,sans-serif',fontSize:14,color:'#888',marginBottom:8}}>{T.character}</div>
          <div style={{display:'flex',gap:10}}>
            {['male','female'].map(g=>(
              <div key={g} onClick={()=>setGender(g)} style={{flex:1,padding:'10px',borderRadius:12,textAlign:'center',
                background:gender===g?'#E91E8C':'#F8F9FA',color:gender===g?'white':'#333',
                fontFamily:'Fredoka One,cursive',fontSize:16,cursor:'pointer',
                border:`2px solid ${gender===g?'#C2185B':'#eee'}`,transition:'all 0.15s'}}>
                {g==='male'?T.male:T.female}
              </div>
            ))}
          </div>
        </div>
        {/* Orders per level — only changeable from the title screen */}
        {!inGame && (
          <div style={{marginBottom:18}}>
            <div style={{fontFamily:'Nunito,sans-serif',fontSize:14,color:'#888',marginBottom:8}}>{T.ordersPerLevel}</div>
            <div style={{display:'flex',gap:8}}>
              {[1,2,3,4,5].map(n=>(
                <div key={n} onClick={()=>setOrdersPerLevel(n)} style={{flex:1,padding:'8px 0',borderRadius:10,textAlign:'center',
                  background:ordersPerLevel===n?'#F39C12':'#F8F9FA',color:ordersPerLevel===n?'white':'#333',
                  fontFamily:'Fredoka One,cursive',fontSize:17,cursor:'pointer',
                  border:`2px solid ${ordersPerLevel===n?'#D68910':'#eee'}`,transition:'all 0.15s'}}>
                  {n}
                </div>
              ))}
            </div>
          </div>
        )}
        <Toggle on={musicOn} onToggle={()=>{
          const next=!musicOn; setMusicOn(next);
          if(next) startMusic(); else stopMusic();
        }} label={T.music}/>
        <Toggle on={sfxOn} onToggle={()=>setSfxOn(s=>!s)} label={T.sfx}/>
        <div style={{textAlign:'center',marginTop:8}}>
          <Btn color="#3498DB" onClick={onClose}>{T.close}</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Home Confirm Dialog ───────────────────────────────────────────────────────
function HomeConfirm({ T, onYes, onNo }) {
  return (
    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.65)',zIndex:90,
      display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'white',borderRadius:20,padding:'32px 44px',textAlign:'center',
        boxShadow:'0 20px 60px rgba(0,0,0,0.5)',animation:'scaleIn 0.25s ease-out'}}>
        <div style={{fontSize:40,marginBottom:12}}>🏠</div>
        <div style={{fontFamily:'Fredoka One,cursive',fontSize:24,color:'#2C3E50',marginBottom:10}}>
          {T.homeConfirmTitle}
        </div>
        <div style={{fontFamily:'Nunito,sans-serif',fontSize:16,color:'#666',marginBottom:24}}>
          {T.homeConfirmMsg}
        </div>
        <div style={{display:'flex',gap:14,justifyContent:'center'}}>
          <Btn color="#E74C3C" onClick={onYes}>{T.yes}</Btn>
          <Btn color="#27AE60" onClick={onNo}>{T.no}</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FractionsFactory() {
  // Settings
  const [lang, setLang]       = useState('fr');
  const [gender, setGender]   = useState('male');
  const [musicOn, setMusicOn] = useState(false);
  const [sfxOn, setSfxOn]     = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [ordersPerLevel, setOrdersPerLevel] = useState(5);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const [showClearBoxConfirm, setShowClearBoxConfirm] = useState(false);

  // Game state
  const [screen, setScreen]             = useState('title');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [orders, setOrders]             = useState([]);
  const [orderIndex, setOrderIndex]     = useState(0);
  const [player, setPlayer]             = useState({ x:430, y:300 });
  const [moving, setMoving]             = useState(false);
  const [carrying, setCarrying]         = useState(null);
  const [box, setBox]                   = useState([]);
  const [starsEarned, setStarsEarned]   = useState({1:0,2:0,3:0,4:0,5:0});
  const [levelStars, setLevelStars]     = useState(0);
  const [firstAttempt, setFirstAttempt] = useState(true);
  const [completedLevels, setCompletedLevels] = useState(new Set());
  const [interactingWith, setInteractingWith] = useState(null);
  const [interactProgress, setInteractProgress] = useState(0);
  const [tooltip, setTooltip]           = useState('');
  const [hint, setHint]                 = useState(0); // index into T.hint*
  const [resultData, setResultData]     = useState(null);

  // Conveyor animation
  const [conveyorAnimKey, setConveyorAnimKey]   = useState(0);
  const [conveyorAnimating, setConveyorAnimating] = useState(false);
  const conveyorTimerRef = useRef(null);

  // Cutting state
  const [cuttingTable, setCuttingTable]     = useState(null);
  const [cutLines, setCutLines]             = useState([]);
  const [selectedCuts, setSelectedCuts]     = useState(new Set());
  const [cutPhase, setCutPhase]             = useState('cutting');
  const [computedPieces, setComputedPieces] = useState([]);
  const [selectedPieces, setSelectedPieces] = useState(new Set());

  // Refs
  const keysRef          = useRef({});
  const playerRef        = useRef({ x:430, y:300 });
  const movingRef        = useRef(false);
  const rafRef           = useRef(null);
  const lastTimeRef      = useRef(null);
  const interactStRef    = useRef(null);
  const interactStartRef = useRef(null);
  const firedRef         = useRef(false);
  const carryingRef      = useRef(null);
  const boxRef           = useRef([]);
  const orderRef         = useRef(null);
  const levelRef         = useRef(LEVELS[0]);
  const firstAttemptRef  = useRef(true);
  const levelStarsRef    = useRef(0);
  const sfxOnRef         = useRef(true);
  const langRef          = useRef('fr');

  useEffect(()=>{ carryingRef.current = carrying; },[carrying]);
  useEffect(()=>{ boxRef.current = box; },[box]);
  useEffect(()=>{ if(orders[orderIndex]) orderRef.current = orders[orderIndex]; },[orders,orderIndex]);
  useEffect(()=>{ levelRef.current = LEVELS[currentLevel-1]; },[currentLevel]);
  useEffect(()=>{ firstAttemptRef.current = firstAttempt; },[firstAttempt]);
  useEffect(()=>{ levelStarsRef.current = levelStars; },[levelStars]);
  useEffect(()=>{ sfxOnRef.current = sfxOn; },[sfxOn]);
  useEffect(()=>{ langRef.current = lang; },[lang]);

  const T = STRINGS[lang];

  function sfx(type) { if (sfxOnRef.current) playSFX(type); }

  function flashTooltip(msg) { setTooltip(msg); setTimeout(()=>setTooltip(''), 2600); }

  function triggerConveyor() {
    clearTimeout(conveyorTimerRef.current);
    setConveyorAnimKey(k=>k+1);
    setConveyorAnimating(true);
    sfx('conveyor');
    conveyorTimerRef.current = setTimeout(()=>setConveyorAnimating(false), 1400);
  }

  function collides(px, py) {
    if (px-PLAYER_R<0 || px+PLAYER_R>GAME_W || py-PLAYER_R<0 || py+PLAYER_R>GAME_H) return true;
    for (const s of Object.values(ST)) {
      const cx = Math.max(s.x, Math.min(px, s.x+s.w));
      const cy = Math.max(s.y, Math.min(py, s.y+s.h));
      if (Math.hypot(px-cx, py-cy) < PLAYER_R+3) return true;
    }
    return false;
  }

  function nearbyStation(px, py) {
    for (const [key,s] of Object.entries(ST)) {
      const cx = Math.max(s.x, Math.min(px, s.x+s.w));
      const cy = Math.max(s.y, Math.min(py, s.y+s.h));
      if (Math.hypot(px-cx, py-cy) < PLAYER_R+INTERACT_DIST) return key;
    }
    return null;
  }

  const doInteract = useRef(null);
  doInteract.current = (station) => {
    const c = carryingRef.current;
    const order = orderRef.current;
    const lvl = levelRef.current;
    const tStr = STRINGS[langRef.current];

    if (station === 'conveyor') {
      if (c) { flashTooltip(tStr.handsFull); return; }
      if (!order) return;
      setCarrying({ food:order.food, isRound:order.isRound, pieces:null });
      setHint(1);
      sfx('pickup');

    } else if (station.startsWith('table')) {
      const idx = parseInt(station.slice(5));
      if (!c) { flashTooltip(tStr.pickupFirst); return; }
      if (c.pieces) { flashTooltip(tStr.alreadyCut); return; }
      const den = lvl.tables[idx];
      const lines = generateCutLines(den, lvl.decoys, c.isRound);
      setCuttingTable({ index:idx, denominator:den, isRound:c.isRound });
      setCutLines(lines);
      setSelectedCuts(new Set());
      setCutPhase('cutting');
      setComputedPieces([]);
      setSelectedPieces(new Set());
      setScreen('cutting');

    } else if (station === 'boxing') {
      if (!c) {
        if (boxRef.current.length > 0) { setShowClearBoxConfirm(true); } else { flashTooltip(tStr.bringCutPieces); }
        return;
      }
      if (!c.pieces) { flashTooltip(tStr.bringCutPieces); return; }
      const newItems = c.pieces.map(p=>({ fraction:p.fraction, food:c.food }));
      setBox(prev=>[...prev,...newItems]);
      setCarrying(null);
      sfx('box');
      setScreen('boxing');

    } else if (station === 'bin') {
      if (!c) { flashTooltip(tStr.nothingToThrow); return; }
      setCarrying(null);
      flashTooltip(tStr.tossed);
      setHint(0);
      triggerConveyor();
    }
  };

  // Game loop
  useEffect(()=>{
    if (screen !== 'playing') return;
    const onKeyDown = e=>{
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){
        e.preventDefault(); keysRef.current[e.key]=true;
      }
    };
    const onKeyUp = e=>{ keysRef.current[e.key]=false; };
    window.addEventListener('keydown',onKeyDown);
    window.addEventListener('keyup',onKeyUp);

    const loop = (t) => {
      if (lastTimeRef.current===null) lastTimeRef.current=t;
      const dt = Math.min((t-lastTimeRef.current)/1000,0.05);
      lastTimeRef.current = t;
      let {x,y} = playerRef.current;
      let dx=0,dy=0;
      if(keysRef.current['ArrowLeft'])  dx-=1;
      if(keysRef.current['ArrowRight']) dx+=1;
      if(keysRef.current['ArrowUp'])    dy-=1;
      if(keysRef.current['ArrowDown'])  dy+=1;
      const isMoving = dx!==0||dy!==0;
      if (isMoving) {
        const len=Math.hypot(dx,dy), spd=PLAYER_SPEED*dt;
        const ndx=(dx/len)*spd, ndy=(dy/len)*spd;
        if(!collides(x+ndx,y)) x+=ndx;
        if(!collides(x,y+ndy)) y+=ndy;
        playerRef.current={x,y};
        setPlayer({x,y});
        if(!movingRef.current){movingRef.current=true;setMoving(true);}
        interactStRef.current=null; interactStartRef.current=null; firedRef.current=false;
        setInteractingWith(null); setInteractProgress(0);
      } else {
        if(movingRef.current){movingRef.current=false;setMoving(false);}
        const nearby=nearbyStation(x,y);
        if(nearby){
          if(interactStRef.current!==nearby){
            interactStRef.current=nearby; interactStartRef.current=t; firedRef.current=false;
            setInteractingWith(nearby); setInteractProgress(0);
          } else if(!firedRef.current){
            const progress=Math.min((t-interactStartRef.current)/INTERACT_TIME,1);
            setInteractProgress(progress);
            if(progress>=1){ firedRef.current=true; doInteract.current(nearby); }
          }
        } else {
          if(interactStRef.current){
            interactStRef.current=null; interactStartRef.current=null; firedRef.current=false;
            setInteractingWith(null); setInteractProgress(0);
          }
        }
      }
      rafRef.current=requestAnimationFrame(loop);
    };
    rafRef.current=requestAnimationFrame(loop);
    return ()=>{
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown',onKeyDown);
      window.removeEventListener('keyup',onKeyUp);
      lastTimeRef.current=null;
    };
  },[screen]);

  function startLevel(lvl) {
    setCurrentLevel(lvl);
    const newOrders=generateOrders(lvl, ordersPerLevel);
    setOrders(newOrders);
    orderRef.current=newOrders[0];
    setOrderIndex(0);
    setCarrying(null); carryingRef.current=null;
    setBox([]); boxRef.current=[];
    setFirstAttempt(true); firstAttemptRef.current=true;
    setLevelStars(0); levelStarsRef.current=0;
    setResultData(null);
    setHint(0);
    const start={x:430,y:300};
    setPlayer(start); playerRef.current=start;
    setInteractingWith(null); setInteractProgress(0);
    interactStRef.current=null; firedRef.current=false;
    setScreen('playing');
    setTimeout(triggerConveyor, 200);
  }

  // ── Cutting handlers ─────────────────────────────────────────────────────
  function handleLineClick(i) {
    const max = cuttingTable.isRound ? cuttingTable.denominator : cuttingTable.denominator - 1;
    setSelectedCuts(prev=>{
      const next=new Set(prev);
      if(next.has(i)){next.delete(i);} else if(next.size<max){next.add(i);}
      return next;
    });
  }

  function handleDoneCutting() {
    const max = cuttingTable.isRound ? cuttingTable.denominator : cuttingTable.denominator - 1;
    if (selectedCuts.size < max) {
      flashTooltip(T.needCuts(max, cuttingTable.denominator)); return;
    }
    const pieces = computePieces(selectedCuts, cutLines, carrying?.isRound||false);
    setComputedPieces(pieces);
    setCutPhase('selecting');
    sfx('slice');
  }

  function handlePieceClick(id) {
    setSelectedPieces(prev=>{const next=new Set(prev);next.has(id)?next.delete(id):next.add(id);return next;});
  }

  function handleTakeSelected() {
    if (selectedPieces.size === 0) { flashTooltip(T.selectPiece); return; }
    const taken = computedPieces.filter(p=>selectedPieces.has(p.id));
    setCarrying(prev=>({
      ...prev,
      pieces: taken.map(p=>({ fraction:p.fraction })),
      cutDen: cuttingTable.denominator,
    }));
    setScreen('playing');
    setHint(2);
  }

  function handleCancelCutting() {
    setCarrying(null);
    setScreen('playing');
    setHint(0);
    triggerConveyor();
  }

  // ── Boxing handlers ──────────────────────────────────────────────────────
  function handleCommitOrder() {
    const order = orders[orderIndex];
    const result = checkOrder(box, order, T);
    setResultData(result);
    if (result.ok) {
      sfx('success');
      if (firstAttemptRef.current) {
        const earned = levelRef.current.spo;
        setLevelStars(prev=>prev+earned);
        levelStarsRef.current += earned;
      }
    } else {
      sfx('fail');
      setFirstAttempt(false); firstAttemptRef.current=false;
    }
    setScreen('result');
  }

  function handleKeepWorking() { setScreen('playing'); setHint(3); }

  // ── Result handlers ──────────────────────────────────────────────────────
  function handleNextOrder() {
    const isLast = orderIndex >= ordersPerLevel - 1;
    if (isLast) {
      setStarsEarned(prev=>({...prev,[currentLevel]:Math.max(prev[currentLevel],levelStars)}));
      setCompletedLevels(prev=>new Set([...prev,currentLevel]));
      setScreen('levelComplete');
    } else {
      const nextIdx = orderIndex+1;
      setOrderIndex(nextIdx);
      orderRef.current = orders[nextIdx];
      setBox([]); boxRef.current=[];
      setCarrying(null); carryingRef.current=null;
      setFirstAttempt(true); firstAttemptRef.current=true;
      setScreen('playing');
      setHint(0);
      setTimeout(triggerConveyor, 200);
    }
  }

  function handleRetry() {
    setBox([]); boxRef.current=[];
    setCarrying(null); carryingRef.current=null;
    setScreen('playing');
    setHint(0);
    triggerConveyor();
  }

  function handleClearBoxYes() {
    setBox([]); boxRef.current = [];
    setShowClearBoxConfirm(false);
  }

  function goHome() {
    stopMusic(); setMusicOn(false);
    setShowHomeConfirm(false);
    setStarsEarned(prev => ({...prev, [currentLevel]: 0}));
    setScreen('title');
  }

  const hintTexts = [T.hint0, T.hint1, T.hint2, T.hint3];
  const hintHighlight = !carrying ? 'conveyor' : !carrying.pieces ? null : 'boxing';
  const order = orders[orderIndex];
  const level = LEVELS[currentLevel-1];

  const container = {
    width:GAME_W, height:GAME_H,
    position:'relative', overflow:'hidden',
    fontFamily:'Nunito,sans-serif', userSelect:'none',
  };

  // ══════ TITLE ══════════════════════════════════════════════════════════════
  if (screen === 'title') return (
    <div style={{...container,background:'linear-gradient(160deg,#0F3460 0%,#16213E 100%)',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <GlobalStyle/>
      {showSettings && <SettingsPanel lang={lang} setLang={setLang} gender={gender} setGender={setGender}
        musicOn={musicOn} setMusicOn={setMusicOn} sfxOn={sfxOn} setSfxOn={setSfxOn}
        ordersPerLevel={ordersPerLevel} setOrdersPerLevel={setOrdersPerLevel} inGame={screen==='playing'}
        onClose={()=>setShowSettings(false)}/>}
      {Array.from({length:18},(_,i)=>(
        <div key={i} style={{position:'absolute',left:`${rnd(100)}%`,top:`${rnd(100)}%`,
          width:4+rnd(8),height:4+rnd(8),borderRadius:'50%',background:'rgba(255,255,255,0.07)',pointerEvents:'none'}}/>
      ))}
      <button onClick={()=>setShowSettings(true)} style={{position:'absolute',top:16,right:16,
        background:'rgba(255,255,255,0.15)',border:'none',color:'white',borderRadius:12,
        padding:'8px 14px',fontFamily:'Fredoka One,cursive',fontSize:18,cursor:'pointer'}}>⚙️</button>
      <div style={{position:'relative',textAlign:'center'}}>
        <div style={{fontFamily:'Fredoka One,cursive',fontSize:56,lineHeight:1,
          color:'#FFD700',textShadow:'4px 4px 0 #B8860B, 0 0 60px rgba(255,215,0,0.4)',marginBottom:4}}>
          🏭 {T.title}
        </div>
        <div style={{fontFamily:'Fredoka One,cursive',fontSize:20,color:'rgba(255,255,255,0.8)',marginBottom:40}}>
          {T.subtitle}
        </div>
        {(() => {
          const nextLvl = LEVELS.find(lvl => !completedLevels.has(lvl.id))?.id ?? LEVELS[LEVELS.length-1].id;
          return (<>
            <div style={{display:'flex',flexDirection:'column',gap:10,alignItems:'center',marginBottom:24}}>
              {LEVELS.map((lvl,i)=>{
                const locked=i>0&&!completedLevels.has(i);
                const stars=starsEarned[lvl.id];
                const maxStars=lvl.spo*ordersPerLevel;
                return (
                  <div key={lvl.id} onClick={()=>!locked&&startLevel(lvl.id)}
                    style={{width:420,padding:'12px 28px',borderRadius:50,
                      background:locked?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.12)',
                      border:`2px solid ${locked?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.25)'}`,
                      color:locked?'#555':'white',fontFamily:'Fredoka One,cursive',fontSize:17,
                      cursor:locked?'not-allowed':'pointer',
                      display:'flex',alignItems:'center',justifyContent:'space-between',transition:'background 0.2s'}}
                    onMouseEnter={e=>{if(!locked)e.currentTarget.style.background='rgba(255,255,255,0.22)';}}
                    onMouseLeave={e=>{if(!locked)e.currentTarget.style.background='rgba(255,255,255,0.12)';}}>
                    <span>{locked?T.locked:`▶ ${T.levelLabel} ${lvl.id}: ${T.levelNames[i]}`}</span>
                    <span style={{fontSize:14}}>{stars>0?'⭐'.repeat(stars):(locked?'':`⭐`.repeat(maxStars))}</span>
                  </div>
                );
              })}
            </div>
            <div onClick={()=>startLevel(nextLvl)} style={{display:'inline-block',padding:'15px 60px',borderRadius:50,
              background:'linear-gradient(135deg,#FFD700,#FF8C00)',color:'#222',
              fontFamily:'Fredoka One,cursive',fontSize:24,cursor:'pointer',
              boxShadow:'0 6px 24px rgba(255,165,0,0.5)',transition:'transform 0.15s'}}
              onMouseEnter={e=>e.currentTarget.style.transform='scale(1.06)'}
              onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
              {T.startBtn(nextLvl)}
            </div>
          </>);
        })()}
      </div>
    </div>
  );

  // ══════ LEVEL COMPLETE ═════════════════════════════════════════════════════
  if (screen === 'levelComplete') return (
    <div style={{...container,background:'#0F3460',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <GlobalStyle/>
      <Confetti/>
      <div style={{background:'white',borderRadius:28,padding:'44px 56px',textAlign:'center',
        boxShadow:'0 20px 60px rgba(0,0,0,0.5)',animation:'scaleIn 0.35s ease-out',position:'relative',zIndex:60}}>
        <div style={{fontSize:64,marginBottom:8}}>🎉</div>
        <div style={{fontFamily:'Fredoka One,cursive',fontSize:38,color:'#2C3E50',marginBottom:8}}>
          {T.levelComplete(currentLevel)}
        </div>
        <div style={{fontFamily:'Fredoka One,cursive',fontSize:26,color:'#F39C12',marginBottom:10}}>
          {'⭐'.repeat(levelStars)}
        </div>
        <div style={{fontFamily:'Nunito,sans-serif',fontSize:17,color:'#555',marginBottom:28}}>
          {T.starsTotal(levelStars)} — {levelStars>=level.spo*ordersPerLevel?T.amazing:levelStars>=level.spo*Math.ceil(ordersPerLevel/2)?T.great:T.keepPractising}
        </div>
        <div style={{display:'flex',gap:14,justifyContent:'center'}}>
          {currentLevel<5&&<Btn color="#27AE60" onClick={()=>startLevel(currentLevel+1)}>{T.nextLevel}</Btn>}
          <Btn color="#3498DB" onClick={()=>startLevel(currentLevel)}>{T.replay}</Btn>
          <Btn color="#95A5A6" onClick={()=>setScreen('title')}>{T.menu}</Btn>
        </div>
      </div>
    </div>
  );

  if (!order) return null;

  // ══════ CUTTING ════════════════════════════════════════════════════════════
  if (screen === 'cutting') {
    const maxCuts = cuttingTable?.isRound ? cuttingTable?.denominator : cuttingTable?.denominator - 1;
    return (
      <div style={{...container,background:'rgba(15,20,40,0.97)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <GlobalStyle/>
        <div style={{background:'white',borderRadius:24,padding:'26px 34px',textAlign:'center',
          boxShadow:'0 20px 60px rgba(0,0,0,0.6)',animation:'scaleIn 0.3s ease-out',maxWidth:580}}>
          <div style={{fontFamily:'Fredoka One,cursive',fontSize:24,color:'#2C3E50',marginBottom:6}}>
            {cutPhase==='cutting'
              ? T.cuttingTitle(cuttingTable?.denominator)
              : T.pickTitle}
          </div>
          {cutPhase==='cutting'?(
            <>
              <div style={{fontFamily:'Nunito,sans-serif',fontSize:14,color:'#555',marginBottom:16}}
                dangerouslySetInnerHTML={{__html:T.cutInstruction(cuttingTable?.denominator)+
                  ` &nbsp;— <span style="color:#C62828;font-weight:700">${T.cutsLeft} ${maxCuts-selectedCuts.size}</span>`}}/>
              <CuttingDisplay food={carrying?.food||''} isRound={carrying?.isRound||false}
                lines={cutLines} selectedCuts={selectedCuts} phase="cutting"
                computedPieces={[]} selectedPieces={new Set()}
                onLineClick={handleLineClick} onPieceClick={()=>{}}
                denominator={cuttingTable?.denominator||2}/>
              <div style={{display:'flex',gap:14,marginTop:20,justifyContent:'center'}}>
                <Btn color={selectedCuts.size>=maxCuts?'#27AE60':'#aaa'} onClick={handleDoneCutting}
                  disabled={selectedCuts.size<maxCuts}>{T.doneCutting}</Btn>
                <Btn color="#E74C3C" onClick={handleCancelCutting}>{T.cancel}</Btn>
              </div>
            </>
          ):(
            <>
              <div style={{fontFamily:'Nunito,sans-serif',fontSize:14,color:'#555',marginBottom:16}}>
                {T.pickTitle} &nbsp;—&nbsp;
                <span style={{color:'#27AE60',fontWeight:700}}>{T.selected} {selectedPieces.size}</span>
              </div>
              <CuttingDisplay food={carrying?.food||''} isRound={carrying?.isRound||false}
                lines={cutLines} selectedCuts={selectedCuts} phase="selecting"
                computedPieces={computedPieces} selectedPieces={selectedPieces}
                onLineClick={()=>{}} onPieceClick={handlePieceClick}
                denominator={cuttingTable?.denominator||2}/>
              <div style={{display:'flex',gap:14,marginTop:20,justifyContent:'center'}}>
                <Btn color="#27AE60" onClick={handleTakeSelected}>{T.takePieces(selectedPieces.size)}</Btn>
                <Btn color="#E74C3C" onClick={handleCancelCutting}>{T.cancel}</Btn>
              </div>
            </>
          )}
          <div style={{marginTop:16,padding:'8px 18px',background:'#F8F9FA',borderRadius:12,
            fontFamily:'Nunito,sans-serif',fontSize:13,color:'#666',border:'1px solid #eee'}}>
            {T.orderReminder} <strong style={{color:'#E74C3C'}}>{order.num}/{order.den}</strong> {T.ofA} {T.foodNames[order.food]||order.food}
          </div>
          {tooltip&&<div style={{marginTop:8,color:'#E74C3C',fontFamily:'Nunito,sans-serif',fontSize:13,fontWeight:700}}>{tooltip}</div>}
        </div>
      </div>
    );
  }

  // ══════ BOXING ═════════════════════════════════════════════════════════════
  if (screen === 'boxing') {
    const firstFrac = box[0]?.fraction;
    const displayDen = firstFrac ? Math.round(1/firstFrac) : '?';
    return (
      <div style={{...container,background:'rgba(15,20,40,0.97)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <GlobalStyle/>
        <div style={{background:'white',borderRadius:24,padding:'30px 42px',textAlign:'center',maxWidth:480,
          boxShadow:'0 20px 60px rgba(0,0,0,0.6)',animation:'scaleIn 0.3s ease-out'}}>
          <div style={{fontFamily:'Fredoka One,cursive',fontSize:26,color:'#7D3C98',marginBottom:8}}>{T.boxTitle}</div>
          <div style={{fontFamily:'Nunito,sans-serif',fontSize:15,color:'#555',marginBottom:14}}>
            {T.orderLabel} <strong style={{color:'#E74C3C',fontSize:19}}>{order.num}/{order.den}</strong> {T.ofA} {T.foodNames[order.food]||order.food}
          </div>
          <div style={{background:'#F8F9FA',borderRadius:14,padding:20,marginBottom:20,border:'2px dashed #ccc'}}>
            <div style={{fontFamily:'Fredoka One,cursive',fontSize:50,color:'#2C3E50',lineHeight:1}}>
              {box.length}<span style={{fontSize:24,color:'#888'}}>/{displayDen}</span>
            </div>
            <div style={{marginTop:10,fontFamily:'Nunito,sans-serif',fontSize:13,color:'#888'}}>
              {box.length>0?T.piecesInBox(box.length):T.boxEmpty}
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginTop:10}}>
              {box.map((piece,i)=>(
                <div key={i} style={{width:36,height:36,borderRadius:6,background:'#7D3C98',opacity:0.85,
                  border:'2px solid #6C3483',display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:9,color:'white',fontFamily:'Fredoka One,cursive'}}>
                  1/{Math.round(1/piece.fraction)}
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:14,justifyContent:'center'}}>
            <Btn color="#E74C3C" onClick={handleCommitOrder}>{T.commitOrder}</Btn>
            <Btn color="#3498DB" onClick={handleKeepWorking}>{T.keepWorking}</Btn>
          </div>
        </div>
      </div>
    );
  }

  // ══════ RESULT ═════════════════════════════════════════════════════════════
  if (screen === 'result') {
    const ok = resultData?.ok;
    return (
      <div style={{...container,background:'rgba(15,20,40,0.97)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <GlobalStyle/>
        {ok&&<Confetti/>}
        <div style={{background:'white',borderRadius:24,padding:'34px 46px',textAlign:'center',maxWidth:500,
          boxShadow:'0 20px 60px rgba(0,0,0,0.6)',animation:'scaleIn 0.35s ease-out',position:'relative',zIndex:60}}>
          <div style={{fontSize:64,marginBottom:10}}>{ok?'🎉':'😅'}</div>
          <div style={{fontFamily:'Fredoka One,cursive',fontSize:32,color:ok?'#27AE60':'#E74C3C',marginBottom:14}}>
            {ok?T.perfect:T.notQuite}
          </div>
          <div style={{fontFamily:'Nunito,sans-serif',fontSize:16,color:'#555',lineHeight:1.65,marginBottom:18}}>
            {resultData?.msg}
          </div>
          {ok&&firstAttemptRef.current&&(
            <div style={{fontFamily:'Fredoka One,cursive',fontSize:24,color:'#F39C12',marginBottom:16,animation:'sparkle 0.4s ease-in-out 4'}}>
              {'⭐'.repeat(level.spo)} {T.starsEarned(level.spo)}
            </div>
          )}
          {ok&&!firstAttemptRef.current&&(
            <div style={{fontFamily:'Nunito,sans-serif',fontSize:13,color:'#888',marginBottom:16}}>{T.noStarsRetry}</div>
          )}
          <Btn color={ok?'#27AE60':'#E74C3C'} onClick={ok?handleNextOrder:handleRetry}>
            {ok?(orderIndex>=ordersPerLevel-1?T.finishLevel:T.nextOrder):T.tryAgain}
          </Btn>
        </div>
      </div>
    );
  }

  // ══════ PLAYING ════════════════════════════════════════════════════════════
  return (
    <div style={{...container,background:'#1A7A8A',outline:'none'}} tabIndex={0}>
      <GlobalStyle/>
      {showSettings&&<SettingsPanel lang={lang} setLang={setLang} gender={gender} setGender={setGender}
        musicOn={musicOn} setMusicOn={setMusicOn} sfxOn={sfxOn} setSfxOn={setSfxOn}
        onClose={()=>setShowSettings(false)}/>}
      {showHomeConfirm&&<HomeConfirm T={T} onYes={goHome} onNo={()=>setShowHomeConfirm(false)}/>}
      {showClearBoxConfirm&&(
        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.65)',zIndex:90,
          display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'white',borderRadius:20,padding:'32px 44px',textAlign:'center',
            boxShadow:'0 20px 60px rgba(0,0,0,0.5)',animation:'scaleIn 0.25s ease-out'}}>
            <div style={{fontSize:40,marginBottom:12}}>📦</div>
            <div style={{fontFamily:'Fredoka One,cursive',fontSize:24,color:'#2C3E50',marginBottom:10}}>
              {T.clearBoxTitle}
            </div>
            <div style={{fontFamily:'Nunito,sans-serif',fontSize:16,color:'#666',marginBottom:24}}>
              {T.clearBoxMsg}
            </div>
            <div style={{display:'flex',gap:14,justifyContent:'center'}}>
              <Btn color="#E74C3C" onClick={handleClearBoxYes}>{T.yes}</Btn>
              <Btn color="#27AE60" onClick={()=>setShowClearBoxConfirm(false)}>{T.no}</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Floor grid */}
      <div style={{position:'absolute',inset:0,
        backgroundImage:'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
        backgroundSize:'56px 56px'}}/>

      {/* HUD */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:58,background:'rgba(0,0,0,0.55)',
        display:'flex',alignItems:'center',padding:'0 14px',gap:12,zIndex:20,
        borderBottom:'2px solid rgba(255,255,255,0.1)'}}>
        {/* Home button */}
        <button onClick={()=>setShowHomeConfirm(true)} style={{background:'rgba(255,255,255,0.15)',
          border:'none',color:'white',borderRadius:10,padding:'6px 10px',
          fontFamily:'Fredoka One,cursive',fontSize:18,cursor:'pointer'}}>🏠</button>
        <div style={{color:'rgba(255,255,255,0.9)',fontFamily:'Fredoka One,cursive',fontSize:15,whiteSpace:'nowrap'}}>
          {T.orderOf.includes('sur')
            ? `Commande ${orderIndex+1} ${T.orderOf} ${ordersPerLevel}`
            : `Order ${orderIndex+1} ${T.orderOf} ${ordersPerLevel}`}
        </div>
        {/* Order panel */}
        <div style={{flex:1,background:'rgba(255,255,255,0.14)',borderRadius:14,
          padding:'5px 16px',display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
          <span style={{color:'rgba(255,255,255,0.75)',fontFamily:'Nunito,sans-serif',fontSize:13}}>{T.managerNeeds}</span>
          <span style={{fontFamily:'Fredoka One,cursive',fontSize:28,color:'#FFD700',lineHeight:1}}>
            {order.num}/{order.den}
          </span>
          <span style={{color:'rgba(255,255,255,0.8)',fontFamily:'Nunito,sans-serif',fontSize:13}}>{T.ofA}</span>
          <FoodSVG name={order.food} size={32}/>
          <span style={{color:'white',fontFamily:'Fredoka One,cursive',fontSize:15}}>{T.foodNames[order.food]||order.food}</span>
        </div>
        <div style={{color:'#FFD700',fontFamily:'Fredoka One,cursive',fontSize:14,whiteSpace:'nowrap'}}>
          {T.levelNames[currentLevel-1]} {'⭐'.repeat(levelStars)}
        </div>
        {/* Settings */}
        <button onClick={()=>setShowSettings(true)} style={{background:'rgba(255,255,255,0.15)',
          border:'none',color:'white',borderRadius:10,padding:'6px 10px',
          fontFamily:'Fredoka One,cursive',fontSize:16,cursor:'pointer'}}>⚙️</button>
      </div>

      {/* Stations */}
      <ConveyorBelt food={!carrying?order.food:null} animKey={conveyorAnimKey}
        animating={conveyorAnimating} T={T}/>
      {level.tables.map((den,i)=>(
        <CuttingTable key={i} index={i} denominator={den} T={T}
          glow={carrying&&!carrying.pieces&&interactingWith===`table${i}`}/>
      ))}
      <BoxingArea glow={hintHighlight==='boxing'&&interactingWith==='boxing'} T={T} box={box}/>
      <BinStation glow={!!carrying&&interactingWith==='bin'} T={T}/>

      {/* Level-1 hint arrows */}
      {currentLevel===1&&!carrying&&(
        <div style={{position:'absolute',left:ST.conveyor.x+ST.conveyor.w+6,
          top:ST.conveyor.y+ST.conveyor.h/2-12,
          fontFamily:'Fredoka One,cursive',fontSize:22,color:'#FFD700',
          animation:'pulse 1s ease-in-out infinite',pointerEvents:'none'}}>←</div>
      )}
      {currentLevel===1&&carrying?.pieces&&(
        <div style={{position:'absolute',right:GAME_W-ST.boxing.x+6,
          top:ST.boxing.y+ST.boxing.h/2-12,
          fontFamily:'Fredoka One,cursive',fontSize:22,color:'#FFD700',
          animation:'pulse 1s ease-in-out infinite',pointerEvents:'none'}}>→</div>
      )}

      <Player x={player.x} y={player.y} carrying={carrying} gender={gender}
        interactingWith={interactingWith} interactProgress={interactProgress} moving={moving}/>

      {tooltip&&(
        <div style={{position:'absolute',top:'44%',left:'50%',transform:'translate(-50%,-50%)',
          background:'rgba(0,0,0,0.84)',color:'white',padding:'12px 26px',borderRadius:14,
          fontFamily:'Nunito,sans-serif',fontSize:15,fontWeight:700,zIndex:30,pointerEvents:'none',
          animation:'scaleIn 0.2s ease-out',whiteSpace:'nowrap'}}>{tooltip}</div>
      )}

      <div style={{position:'absolute',bottom:0,left:0,right:0,height:36,
        background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:20}}>
        <span style={{color:'rgba(255,255,255,0.8)',fontFamily:'Nunito,sans-serif',fontSize:13}}>
          💡 {hintTexts[hint] || hintTexts[0]}
        </span>
      </div>
      <div style={{position:'absolute',bottom:40,right:14,
        color:'rgba(255,255,255,0.4)',fontFamily:'Nunito,sans-serif',fontSize:11}}>
        {T.hintBar}
      </div>
    </div>
  );
}

// ── Global CSS ────────────────────────────────────────────────────────────────
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700&display=swap');
      * { box-sizing: border-box; }
      @keyframes conveyor {
        from { background-position: 0 0; }
        to   { background-position: 36px 0; }
      }
      @keyframes slideIn {
        from { transform: translateY(-50%) translateX(-200px); opacity: 0.3; }
        to   { transform: translateY(-50%) translateX(-50%); opacity: 1; }
      }
      @keyframes bob {
        0%, 100% { transform: translateY(0px); }
        50%      { transform: translateY(-3px); }
      }
      @keyframes scaleIn {
        from { transform: scale(0.82); opacity: 0; }
        to   { transform: scale(1);    opacity: 1; }
      }
      @keyframes confetti {
        0%   { transform: translateY(0) rotate(0deg);    opacity: 1; }
        100% { transform: translateY(650px) rotate(720deg); opacity: 0; }
      }
      @keyframes sparkle {
        0%, 100% { transform: scale(1); }
        50%      { transform: scale(1.3); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0.35; }
      }
    `}</style>
  );
}
