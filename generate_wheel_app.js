const fs = require('fs');
const { CLUSTERS, MEMBERS, CLUSTER_META } = require('./scratch_eval.js');

// Map member initials
function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

// Generate short role snippet for outer tile
function getShortRole(role) {
  const clean = role.split(':')[0].replace(/Strategy & Product Architecture/i, 'Product Strategy')
                    .replace(/Program Management/i, 'Program Mgmt')
                    .replace(/Product Management/i, 'Product Mgmt')
                    .replace(/Solutions Governance/i, 'Solutions Gov')
                    .replace(/Legal & Commercial Operations/i, 'Legal & Commercial')
                    .replace(/Growth & Marketing Operations/i, 'Growth & Marketing')
                    .replace(/Service Delivery & Service Assurance/i, 'Service Assurance')
                    .trim();
  return clean.length > 22 ? clean.substring(0, 20) + '...' : clean;
}

// Generate short focus snippet for outer tile
function getFocusSnippet(m) {
  if (m.id === 'shivam') return 'Solar CMS · TowerGenie';
  if (m.id === 'anjali') return 'Tower Solarization Rollout';
  if (m.id === 'kavit') return 'TowerGenie AI · Telemetry';
  if (m.id === 'khemraj') return 'Battery Safety & Audits';
  if (m.id === 'viniksha') return 'BMS & Telemetry Analytics';
  if (m.id === 'vikas') return 'BRC & Battery In-Life';
  if (m.id === 'jyoti') return 'AC & DC EV Chargers';
  if (m.id === 'amol') return 'JioThings & MyConnects';
  if (m.id === 'vaishnavi') return 'JUMP Mobility & Automotive';
  if (m.id === 'shivek') return 'Enterprise Energy & Fleet';
  if (m.id === 'kesava') return 'Catalogues & Data Pacts';
  if (m.id === 'ankit') return 'Service Assurance & Forecast';
  if (m.id === 'bhoumik') return 'Commercial Pricing & DaaS';
  if (m.id === 'sanatan') return 'Lead Pipeline & Marketing';
  return m.cluster;
}

// Build member data list
const clusterMembers = CLUSTERS.map(c => {
  const mems = MEMBERS.filter(m => m.cluster === c.id);
  return { cluster: c, members: mems };
});

let memIndex = 0;
const memberTiles = [];
clusterMembers.forEach(cm => {
  cm.members.forEach(m => {
    memberTiles.push({
      member: m,
      cluster: cm.cluster,
      index: memIndex++,
      initials: getInitials(m.name),
      shortRole: getShortRole(m.role),
      focusSnippet: getFocusSnippet(m)
    });
  });
});

console.log('Member tiles count:', memberTiles.length);

// Build segment data list
let curIdx = 0;
const segmentTiles = [];
clusterMembers.forEach((cm, sIdx) => {
  const startIdx = curIdx;
  const count = cm.members.length;
  const endIdx = curIdx + count;
  curIdx = endIdx;
  const meta = CLUSTER_META[cm.cluster.id] || { icon: '🎯', short: cm.cluster.name };
  segmentTiles.push({
    cluster: cm.cluster,
    index: sIdx,
    startMemberIdx: startIdx,
    endMemberIdx: endIdx,
    memberCount: count,
    members: cm.members,
    icon: meta.icon,
    shortName: meta.short || cm.cluster.name
  });
});

console.log('Segment tiles count:', segmentTiles.length);

// Generate the HTML code
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Jio Devices Concentric Team Wheel — under Gulprit S.</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-family: 'Nunito Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  color: #fff;
  background: radial-gradient(ellipse at 35% 45%, #14407a 0%, #0a2447 55%, #051329 100%);
}

/* Header Navbar */
.navbar {
  position: relative;
  z-index: 50;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(6, 20, 41, 0.82);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(120, 190, 240, 0.28);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-badge {
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
  color: #031733;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  padding: 4px 9px;
  border-radius: 6px;
  text-transform: uppercase;
}
.brand-title {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.01em;
}
.brand-sub {
  font-size: 12px;
  color: #93c5fd;
  margin-left: 6px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.quick-jump-select {
  background: rgba(15, 34, 64, 0.85);
  border: 1px solid rgba(120, 190, 240, 0.35);
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 240px;
}
.quick-jump-select:hover, .quick-jump-select:focus {
  border-color: #38bdf8;
  background: rgba(20, 45, 85, 0.95);
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
}
.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  padding: 7px 14px;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.nav-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 14px rgba(255, 255, 255, 0.18);
}
.btn-icon {
  background: rgba(15, 34, 64, 0.85);
  border: 1px solid rgba(120, 190, 240, 0.3);
  color: #e2e8f0;
  font-size: 13px;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-icon:hover {
  background: rgba(14, 165, 233, 0.25);
  color: #38bdf8;
  border-color: #38bdf8;
}

/* Layout */
.layout {
  flex: 1;
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  padding: 1.5vh 2vw;
  position: relative;
  overflow: hidden;
}

/* 3D Stage & Tilt */
.stage {
  height: min(86vh, 54vw);
  aspect-ratio: 1;
  flex: none;
  perspective: 1200px;
  position: relative;
}
.tilt {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.3s ease-out;
  will-change: transform;
}
.layer {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}
#ring {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  will-change: transform;
}
#ring svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}

/* Top Pointer Indicator at 12 o'clock */
.wheel-pointer {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 14px solid #38bdf8;
  filter: drop-shadow(0 0 8px #38bdf8);
  z-index: 35;
  pointer-events: none;
}

/* Wheel Tiles Interactive States */
.wheel-tile {
  cursor: pointer;
  transition: filter 0.22s ease, opacity 0.2s ease;
}
.wheel-tile path {
  transition: stroke 0.22s ease, stroke-width 0.22s ease, filter 0.22s ease;
}
.wheel-tile:hover path, .wheel-tile.active path {
  stroke: #ffffff !important;
  stroke-width: 3px !important;
  filter: drop-shadow(0 0 14px var(--glow)) !important;
}
.wheel-tile.linked-hover path {
  stroke: #ffffff !important;
  stroke-width: 2.4px !important;
  filter: drop-shadow(0 0 8px var(--glow)) !important;
}

/* Center Hub */
#hub-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 25;
}
.hub-center {
  width: min(230px, 30%);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #0f2e54 0%, #061935 70%, #030d1c 100%);
  border: 2px solid rgba(120, 190, 240, 0.45);
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.8), inset 0 0 18px rgba(56, 189, 248, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 14px;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.25s ease;
}
.hub-center:hover {
  border-color: #38bdf8;
  box-shadow: 0 0 40px rgba(56, 189, 248, 0.45), inset 0 0 24px rgba(56, 189, 248, 0.35);
  transform: scale(1.03);
}
.hub-kicker {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.14em;
  color: #38bdf8;
  text-transform: uppercase;
}
.hub-title {
  font-size: 20px;
  font-weight: 900;
  color: #ffffff;
  margin: 2px 0 1px;
}
.hub-sub {
  font-size: 11px;
  color: #cbd5e1;
}
.hub-badge {
  display: inline-block;
  margin-top: 5px;
  font-size: 10px;
  font-weight: 800;
  background: rgba(14, 165, 233, 0.25);
  border: 1px solid rgba(14, 165, 233, 0.5);
  color: #bae6fd;
  padding: 2px 8px;
  border-radius: 10px;
}

/* Detail Panel */
.panel {
  width: min(500px, 38vw);
  max-height: 88vh;
  overflow-y: auto;
  background: rgba(6, 20, 41, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(120, 190, 240, 0.35);
  border-radius: 16px;
  box-shadow: -10px 0 36px rgba(0, 0, 0, 0.65);
  padding: 22px 24px 28px;
  display: none;
  animation: slideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  z-index: 40;
}
.panel.show { display: block; }
@keyframes slideIn {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

.close-btn {
  float: right;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 17px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.close-btn:hover {
  background: rgba(239, 68, 68, 0.35);
  border-color: #ef4444;
  color: #fff;
}

.panel-cluster-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.panel-cluster-chip:hover {
  filter: brightness(1.2);
}
.panel h2 {
  font-size: 21px;
  font-weight: 900;
  color: #fff;
  line-height: 1.25;
}
.panel .tag {
  font-size: 13px;
  color: #93c5fd;
  margin-top: 5px;
  line-height: 1.45;
}

/* Panel Sections */
.panel-sec {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.panel-sec h3 {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7dd3fc;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.panel-sec h3::before {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #38bdf8;
}

/* Member Cards inside Segment view */
.member-card {
  background: rgba(15, 34, 64, 0.7);
  border: 1px solid rgba(120, 190, 240, 0.25);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.member-card:hover {
  background: rgba(20, 48, 90, 0.9);
  border-color: #38bdf8;
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0,0,0,0.4);
}
.member-card .m-name {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.member-card .m-period {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 7px;
  border-radius: 6px;
}
.member-card .m-role {
  font-size: 12px;
  color: #cbd5e1;
  margin: 5px 0 8px;
  line-height: 1.4;
}
.member-card .m-stake {
  font-size: 11px;
  color: #94a3b8;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 6px;
}
.member-card .m-stake b { color: #cbd5e1; }

/* Solutions & Activities Lists */
.item-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.item-list li {
  font-size: 13px;
  line-height: 1.48;
  color: #e2e8f0;
  background: rgba(15, 34, 64, 0.45);
  border: 1px solid rgba(120, 190, 240, 0.18);
  border-radius: 8px;
  padding: 9px 12px;
  border-left: 3px solid var(--item-accent, #38bdf8);
}
.item-list.solutions li b {
  color: #67e8f9;
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

/* Floating Hint */
.hint {
  position: fixed;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  background: rgba(6, 20, 41, 0.85);
  border: 1px solid rgba(120, 190, 240, 0.3);
  padding: 5px 16px;
  border-radius: 20px;
  pointer-events: none;
  white-space: nowrap;
  backdrop-filter: blur(8px);
  z-index: 30;
}

/* Scrollbar */
.panel::-webkit-scrollbar { width: 6px; }
.panel::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 3px; }
.panel::-webkit-scrollbar-thumb { background: rgba(120, 190, 240, 0.4); border-radius: 3px; }
.panel::-webkit-scrollbar-thumb:hover { background: rgba(120, 190, 240, 0.7); }

/* Responsive */
@media (max-width: 960px) {
  .layout { flex-direction: column; gap: 12px; overflow-y: auto; padding: 12px; height: auto; }
  .stage { height: auto; width: min(88vw, 54vh); }
  .panel { width: 94vw; max-height: 48vh; }
  .navbar { flex-wrap: wrap; height: auto; padding: 10px 14px; gap: 8px; }
  .controls { margin-left: auto; }
}
</style>
</head>
<body>

<header class="navbar">
  <div class="brand">
    <span class="brand-badge">JIO DEVICES</span>
    <div>
      <span class="brand-title">Team Wheel — Jio Devices Team</span>
      <span class="brand-sub">under Gulprit S.</span>
    </div>
  </div>
  <div class="controls">
    <select id="quick-jump" class="quick-jump-select" onchange="handleQuickJump(this.value)">
      <option value="">🎯 Quick Jump to...</option>
      <optgroup label="── 9 Focus Areas (Inside) ──">
` + segmentTiles.map(s => `        <option value="seg:${s.cluster.id}">${s.icon} ${s.cluster.name}</option>`).join('\n') + `
      </optgroup>
      <optgroup label="── 14 Team Members (Outside) ──">
` + memberTiles.map(m => `        <option value="mem:${m.member.id}">👤 ${m.member.name} (${m.cluster.name.split(' ')[0]})</option>`).join('\n') + `
      </optgroup>
    </select>
    <button id="btn-spin-toggle" class="btn-icon" title="Pause / Resume Rotation" onclick="toggleSpin()">⏸</button>
    <button id="btn-reset" class="btn-icon" title="Reset View & Center" onclick="resetView()">↺</button>
    <a href="Gulprit_Team_Mindmap.html" class="nav-btn" title="Switch to Mindmap View">🌿 Mindmap View ⟶</a>
  </div>
</header>

<main class="layout">
  <div class="stage" id="stage">
    <div class="wheel-pointer"></div>
    <div class="tilt" id="tilt">
      <div class="layer" id="ring">
        <svg id="wheel-svg" viewBox="-500 -500 1000 1000"></svg>
      </div>
      <div id="hub-layer">
        <div class="hub-center" id="hub-center" onclick="resetView()">
          <span class="hub-kicker">JIO DEVICES</span>
          <span class="hub-title">Gulprit S.</span>
          <span class="hub-sub">IoT &amp; New Energy</span>
          <span class="hub-badge">9 Segments (In) · 14 Members (Out)</span>
        </div>
      </div>
    </div>
  </div>

  <aside class="panel" id="panel" aria-live="polite"></aside>
</main>

<div class="hint" id="hint-bar">Inside: 9 Strategic Segments &middot; Outside: 14 Member Tiles &middot; Click any tile to spin &middot; Esc to close</div>

<script>
const CLUSTERS = ${JSON.stringify(CLUSTERS, null, 2)};
const MEMBERS = ${JSON.stringify(MEMBERS, null, 2)};
const CLUSTER_META = ${JSON.stringify(CLUSTER_META, null, 2)};
const MEMBER_TILES = ${JSON.stringify(memberTiles, null, 2)};
const SEGMENT_TILES = ${JSON.stringify(segmentTiles, null, 2)};

const N_MEM = MEMBER_TILES.length;
const STEP_MEM_DEG = 360 / N_MEM;
const STEP_MEM_RAD = (2 * Math.PI) / N_MEM;

let angle = 0, last = performance.now(), hoverPause = false, panelOpen = false, isSpinning = true, tween = null;
let activeTarget = null; // { type: 'member'|'segment', id: string }

const ring = document.getElementById('ring');
const panel = document.getElementById('panel');
const svg = document.getElementById('wheel-svg');
const tilt = document.getElementById('tilt');
const stage = document.getElementById('stage');
const hintBar = document.getElementById('hint-bar');
const quickJump = document.getElementById('quick-jump');

function polarToCartesian(r, angleRad) {
  return { x: r * Math.sin(angleRad), y: -r * Math.cos(angleRad) };
}

function sectorPath(r1, r2, a1, a2) {
  const p1 = polarToCartesian(r2, a1);
  const p2 = polarToCartesian(r2, a2);
  const p3 = polarToCartesian(r1, a2);
  const p4 = polarToCartesian(r1, a1);
  const largeArc = (a2 - a1) > Math.PI ? 1 : 0;
  return 'M ' + p1.x.toFixed(2) + ' ' + p1.y.toFixed(2) +
         ' A ' + r2 + ' ' + r2 + ' 0 ' + largeArc + ' 1 ' + p2.x.toFixed(2) + ' ' + p2.y.toFixed(2) +
         ' L ' + p3.x.toFixed(2) + ' ' + p3.y.toFixed(2) +
         ' A ' + r1 + ' ' + r1 + ' 0 ' + largeArc + ' 0 ' + p4.x.toFixed(2) + ' ' + p4.y.toFixed(2) +
         ' Z';
}

function renderConcentricWheel() {
  const R_MEM_2 = 485, R_MEM_1 = 314;
  const R_SEG_2 = 298, R_SEG_1 = 148;
  const gapMemRad = 0.9 * Math.PI / 180;
  const gapSegRad = 1.1 * Math.PI / 180;

  let defs = '<defs>' +
    '<filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">' +
      '<feGaussianBlur stdDeviation="8" result="blur" />' +
      '<feComposite in="SourceGraphic" in2="blur" operator="over" />' +
    '</filter>';

  // Outer Member Gradients
  MEMBER_TILES.forEach((mt, i) => {
    defs += 
      '<linearGradient id="grad-mem-' + i + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="' + mt.cluster.color + '" stop-opacity="0.9" />' +
        '<stop offset="65%" stop-color="' + mt.cluster.color + '" stop-opacity="0.35" />' +
        '<stop offset="100%" stop-color="#071a36" stop-opacity="0.95" />' +
      '</linearGradient>';
  });

  // Inner Segment Gradients
  SEGMENT_TILES.forEach((st, s) => {
    defs += 
      '<linearGradient id="grad-seg-' + s + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="' + st.cluster.color + '" stop-opacity="0.75" />' +
        '<stop offset="60%" stop-color="' + st.cluster.color + '" stop-opacity="0.25" />' +
        '<stop offset="100%" stop-color="#06162d" stop-opacity="0.88" />' +
      '</linearGradient>';
  });
  defs += '</defs>';

  let content = defs;

  // Guide circles
  content += 
    '<circle cx="0" cy="0" r="488" fill="none" stroke="rgba(120, 190, 240, 0.2)" stroke-width="1.5" stroke-dasharray="4 6" />' +
    '<circle cx="0" cy="0" r="306" fill="none" stroke="rgba(120, 190, 240, 0.35)" stroke-width="1.2" stroke-dasharray="3 4" />' +
    '<circle cx="0" cy="0" r="144" fill="none" stroke="rgba(120, 190, 240, 0.45)" stroke-width="1.5" />';

  // 1. RENDER INSIDE SEGMENT TILES (9 Focus Areas)
  SEGMENT_TILES.forEach((st, s) => {
    const startRad = st.startMemberIdx * STEP_MEM_RAD;
    const endRad = st.endMemberIdx * STEP_MEM_RAD;
    const a1 = startRad + (gapSegRad / 2);
    const a2 = endRad - (gapSegRad / 2);
    const midRad = (startRad + endRad) / 2;
    const midDeg = (midRad * 180 / Math.PI).toFixed(3);

    const dSeg = sectorPath(R_SEG_1, R_SEG_2, a1, a2);

    content += 
      '<g class="wheel-tile wheel-tile-seg" id="tile-seg-' + st.cluster.id + '" data-type="segment" data-id="' + st.cluster.id + '" data-mid="' + midDeg + '" style="--glow: ' + st.cluster.color + ';">' +
        '<path d="' + dSeg + '" fill="url(#grad-seg-' + s + ')" stroke="' + st.cluster.color + '" stroke-width="2" />' +
        '<g transform="rotate(' + midDeg + ')">' +
          '<text x="0" y="-265" text-anchor="middle" font-size="19" fill="#ffffff">' + st.icon + '</text>' +
          '<text x="0" y="-242" text-anchor="middle" font-size="10.5" font-weight="900" fill="#ffffff" letter-spacing="0.04em">' + st.shortName.toUpperCase() + '</text>' +
          '<rect x="-38" y="-228" width="76" height="15" rx="7.5" fill="rgba(0,0,0,0.5)" stroke="' + st.cluster.color + '" stroke-width="1" />' +
          '<text x="0" y="-217" text-anchor="middle" font-size="8.5" font-weight="800" fill="#bae6fd">' + st.memberCount + (st.memberCount > 1 ? ' MEMBERS' : ' MEMBER') + '</text>' +
          (st.memberCount > 1 ? '<text x="0" y="-195" text-anchor="middle" font-size="8" font-weight="700" fill="#93c5fd">' + st.members.map(m => m.name.split(' ')[0]).join(' · ') + '</text>' : '') +
        '</g>' +
      '</g>';
  });

  // 2. RENDER OUTSIDE MEMBER TILES (14 Team Members)
  MEMBER_TILES.forEach((mt, i) => {
    const startRad = i * STEP_MEM_RAD;
    const endRad = (i + 1) * STEP_MEM_RAD;
    const a1 = startRad + (gapMemRad / 2);
    const a2 = endRad - (gapMemRad / 2);
    const midRad = (startRad + endRad) / 2;
    const midDeg = (midRad * 180 / Math.PI).toFixed(3);

    const dMem = sectorPath(R_MEM_1, R_MEM_2, a1, a2);

    content += 
      '<g class="wheel-tile wheel-tile-mem" id="tile-mem-' + mt.member.id + '" data-type="member" data-id="' + mt.member.id + '" data-cluster="' + mt.cluster.id + '" data-mid="' + midDeg + '" style="--glow: ' + mt.cluster.color + ';">' +
        '<path d="' + dMem + '" fill="url(#grad-mem-' + i + ')" stroke="' + mt.cluster.color + '" stroke-width="1.8" />' +
        '<g transform="rotate(' + midDeg + ')">' +
          '<!-- Avatar Initials -->' +
          '<circle cx="0" cy="-455" r="13" fill="rgba(0,0,0,0.55)" stroke="' + mt.cluster.color + '" stroke-width="1.2" />' +
          '<text x="0" y="-451" text-anchor="middle" font-size="9.5" font-weight="900" fill="#ffffff">' + mt.initials + '</text>' +
          '<!-- Name -->' +
          '<text x="0" y="-431" text-anchor="middle" font-size="11" font-weight="900" fill="#ffffff" letter-spacing="0.02em">' + mt.member.name.toUpperCase() + '</text>' +
          '<!-- Role Pill -->' +
          '<rect x="-44" y="-420" width="88" height="15" rx="7.5" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" stroke-width="0.8" />' +
          '<text x="0" y="-409" text-anchor="middle" font-size="8.5" font-weight="800" fill="#bae6fd">' + mt.shortRole + '</text>' +
          '<!-- Focus Snip -->' +
          '<text x="0" y="-390" text-anchor="middle" font-size="8.5" font-weight="600" fill="#cbd5e1">' + mt.focusSnippet + '</text>' +
          '<!-- Cluster Indicator -->' +
          '<text x="0" y="-335" text-anchor="middle" font-size="7.5" font-weight="800" fill="rgba(255,255,255,0.45)">#' + (i + 1) + ' · ' + mt.cluster.name.split(' ')[0].toUpperCase() + '</text>' +
        '</g>' +
      '</g>';
  });

  svg.innerHTML = content;

  // Attach event listeners
  document.querySelectorAll('.wheel-tile-mem').forEach(el => {
    const mId = el.dataset.id;
    const cId = el.dataset.cluster;
    const mid = +el.dataset.mid;
    el.addEventListener('mouseenter', () => {
      hoverPause = true;
      hoverMember(mId, cId, true);
    });
    el.addEventListener('mouseleave', () => {
      hoverPause = false;
      hoverMember(mId, cId, false);
    });
    el.addEventListener('click', () => {
      selectMember(mId, mid);
    });
  });

  document.querySelectorAll('.wheel-tile-seg').forEach(el => {
    const sId = el.dataset.id;
    const mid = +el.dataset.mid;
    el.addEventListener('mouseenter', () => {
      hoverPause = true;
      hoverSegment(sId, true);
    });
    el.addEventListener('mouseleave', () => {
      hoverPause = false;
      hoverSegment(sId, false);
    });
    el.addEventListener('click', () => {
      selectSegment(sId, mid);
    });
  });
}

/* Hover Handlers */
function hoverMember(mId, cId, isEnter) {
  const memTile = document.getElementById('tile-mem-' + mId);
  const segTile = document.getElementById('tile-seg-' + cId);
  const m = MEMBERS.find(x => x.id === mId);
  const c = CLUSTERS.find(x => x.id === cId);

  if (isEnter) {
    if (memTile) memTile.classList.add('hovered');
    if (segTile) segTile.classList.add('linked-hover');
    if (m && c) {
      hintBar.innerHTML = '👤 <b>' + m.name + '</b> &middot; ' + c.name + ' &middot; Click to spin &amp; open member dossier';
    }
  } else {
    if (memTile) memTile.classList.remove('hovered');
    if (segTile) segTile.classList.remove('linked-hover');
    hintBar.innerHTML = 'Inside: 9 Strategic Segments &middot; Outside: 14 Member Tiles &middot; Click any tile to spin &middot; Esc to close';
  }
}

function hoverSegment(sId, isEnter) {
  const segTile = document.getElementById('tile-seg-' + sId);
  const c = CLUSTERS.find(x => x.id === sId);
  const memTiles = document.querySelectorAll('.wheel-tile-mem[data-cluster="' + sId + '"]');

  if (isEnter) {
    if (segTile) segTile.classList.add('hovered');
    memTiles.forEach(t => t.classList.add('linked-hover'));
    if (c) {
      const count = MEMBERS.filter(m => m.cluster === sId).length;
      hintBar.innerHTML = '🎯 <b>' + c.name + '</b> (' + count + (count > 1 ? ' Members' : ' Member') + ') &middot; Click to spin &amp; open segment overview';
    }
  } else {
    if (segTile) segTile.classList.remove('hovered');
    memTiles.forEach(t => t.classList.remove('linked-hover'));
    hintBar.innerHTML = 'Inside: 9 Strategic Segments &middot; Outside: 14 Member Tiles &middot; Click any tile to spin &middot; Esc to close';
  }
}

/* Selection and Spin Actions */
function spinTo(targetMidDeg) {
  // Normalize current angle
  const cur = ((angle % 360) + 360) % 360;
  // We want the targetMidDeg to align with 0 deg (12 o'clock).
  // In our coordinate system, rotating the ring by -targetMidDeg puts targetMidDeg at top.
  let dest = (360 - targetMidDeg) % 360;
  let diff = dest - cur;
  while (diff < -180) diff += 360;
  while (diff > 180) diff -= 360;

  tween = {
    from: angle,
    delta: diff,
    t0: performance.now(),
    dur: 680
  };
}

function selectMember(mId, midDeg) {
  activeTarget = { type: 'member', id: mId };
  if (midDeg !== undefined) {
    spinTo(midDeg);
  } else {
    const tile = document.getElementById('tile-mem-' + mId);
    if (tile) spinTo(+tile.dataset.mid);
  }

  // Update active styling
  document.querySelectorAll('.wheel-tile').forEach(t => t.classList.remove('active', 'linked-hover'));
  const mTile = document.getElementById('tile-mem-' + mId);
  if (mTile) mTile.classList.add('active');

  const m = MEMBERS.find(x => x.id === mId);
  if (!m) return;
  const c = CLUSTERS.find(x => x.id === m.cluster) || { name: m.cluster, color: '#0ea5e9' };
  const sTile = document.getElementById('tile-seg-' + c.id);
  if (sTile) sTile.classList.add('linked-hover');

  // Render Member Dossier in Panel
  renderMemberPanel(m, c);
}

function selectSegment(sId, midDeg) {
  activeTarget = { type: 'segment', id: sId };
  if (midDeg !== undefined) {
    spinTo(midDeg);
  } else {
    const tile = document.getElementById('tile-seg-' + sId);
    if (tile) spinTo(+tile.dataset.mid);
  }

  // Update active styling
  document.querySelectorAll('.wheel-tile').forEach(t => t.classList.remove('active', 'linked-hover'));
  const sTile = document.getElementById('tile-seg-' + sId);
  if (sTile) sTile.classList.add('active');

  const c = CLUSTERS.find(x => x.id === sId);
  if (!c) return;
  const mems = MEMBERS.filter(m => m.cluster === sId);
  mems.forEach(m => {
    const t = document.getElementById('tile-mem-' + m.id);
    if (t) t.classList.add('linked-hover');
  });

  // Render Segment Overview in Panel
  renderSegmentPanel(c, mems);
}

/* Panel Renderers */
function renderMemberPanel(m, c) {
  panel.style.setProperty('--item-accent', c.color);
  panel.innerHTML = 
    '<button class="close-btn" onclick="resetView()" title="Close">&times;</button>' +
    '<div class="panel-cluster-chip" style="background:' + c.color + '26; border:1px solid ' + c.color + '; color:' + c.color + ';" onclick="selectSegment(\\'' + c.id + '\\')">' +
      '<span>🎯 ' + c.name + '</span>' +
    '</div>' +
    '<h2>' + m.name + '</h2>' +
    '<div class="tag">' + m.role + '</div>' +

    '<div class="panel-sec">' +
      '<div class="member-card" style="border-left: 3px solid ' + c.color + ';">' +
        '<div class="m-name">' +
          '<span>Key Engagement Baseline</span>' +
          '<span class="m-period">' + m.period + '</span>' +
        '</div>' +
        '<div class="m-stake"><b>Key Stakeholders:</b> ' + m.stake + '</div>' +
      '</div>' +
    '</div>' +

    '<div class="panel-sec">' +
      '<h3>Solutions Portfolio (' + m.sol.length + ')</h3>' +
      '<ul class="item-list solutions">' +
        m.sol.map(s => {
          const parts = s.split(':');
          if (parts.length > 1) {
            return '<li><b>' + parts[0].trim() + '</b>' + parts.slice(1).join(':').trim() + '</li>';
          }
          return '<li>' + s + '</li>';
        }).join('') +
      '</ul>' +
    '</div>' +

    '<div class="panel-sec">' +
      '<h3>Strategic Activities (' + m.act.length + ')</h3>' +
      '<ul class="item-list">' +
        m.act.map(a => '<li>' + a + '</li>').join('') +
      '</ul>' +
    '</div>';

  panel.classList.add('show');
  panelOpen = true;
}

function renderSegmentPanel(c, mems) {
  const meta = CLUSTER_META[c.id] || { icon: '🎯', badge: mems.length + ' Members' };
  panel.style.setProperty('--item-accent', c.color);

  panel.innerHTML = 
    '<button class="close-btn" onclick="resetView()" title="Close">&times;</button>' +
    '<div class="panel-cluster-chip" style="background:' + c.color + '26; border:1px solid ' + c.color + '; color:' + c.color + ';">' +
      '<span>' + meta.icon + ' ' + meta.badge + '</span>' +
    '</div>' +
    '<h2>' + c.name + '</h2>' +
    '<div class="tag">Functional Domain &middot; Strategic Overview &middot; ' + mems.length + ' Dedicated ' + (mems.length > 1 ? 'Owners' : 'Owner') + '</div>' +

    '<div class="panel-sec">' +
      '<h3>Team Ownership (' + mems.length + ')</h3>' +
      mems.map(m => 
        '<div class="member-card" onclick="selectMember(\\'' + m.id + '\\')" title="Click to view full dossier">' +
          '<div class="m-name">' +
            '<span>' + m.name + ' &rarr;</span>' +
            '<span class="m-period">' + m.period + '</span>' +
          '</div>' +
          '<div class="m-role">' + m.role + '</div>' +
          '<div class="m-stake"><b>Key Stakeholders:</b> ' + m.stake + '</div>' +
        '</div>'
      ).join('') +
    '</div>' +

    '<div class="panel-sec">' +
      '<h3>Domain Solutions Scope</h3>' +
      '<ul class="item-list solutions">' +
        mems.flatMap(m => m.sol).map(s => {
          const parts = s.split(':');
          if (parts.length > 1) {
            return '<li><b>' + parts[0].trim() + '</b>' + parts.slice(1).join(':').trim() + '</li>';
          }
          return '<li>' + s + '</li>';
        }).join('') +
      '</ul>' +
    '</div>' +

    '<div class="panel-sec">' +
      '<h3>Key Strategic Activities</h3>' +
      '<ul class="item-list">' +
        mems.flatMap(m => m.act).map(a => '<li>' + a + '</li>').join('') +
      '</ul>' +
    '</div>';

  panel.classList.add('show');
  panelOpen = true;
}

function handleQuickJump(val) {
  if (!val) return;
  const [type, id] = val.split(':');
  if (type === 'seg') {
    selectSegment(id);
  } else if (type === 'mem') {
    selectMember(id);
  }
}

function resetView() {
  panel.classList.remove('show');
  panelOpen = false;
  activeTarget = null;
  document.querySelectorAll('.wheel-tile').forEach(t => t.classList.remove('active', 'linked-hover', 'hovered'));
  hintBar.innerHTML = 'Inside: 9 Strategic Segments &middot; Outside: 14 Member Tiles &middot; Click any tile to spin &middot; Esc to close';
  if (quickJump) quickJump.value = '';
}

function toggleSpin() {
  isSpinning = !isSpinning;
  const btn = document.getElementById('btn-spin-toggle');
  if (btn) btn.textContent = isSpinning ? '⏸' : '▶';
}

/* Rotation Engine */
const SPEED = 360 / 30; // 30s per revolution
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (tween) {
    const t = Math.min(1, (now - tween.t0) / tween.dur);
    const e = 1 - Math.pow(1 - t, 3);
    angle = tween.from + tween.delta * e;
    if (t >= 1) tween = null;
  } else if (!hoverPause && !panelOpen && isSpinning) {
    angle = (angle + SPEED * dt) % 360;
  }
  ring.style.transform = 'rotate(' + angle.toFixed(3) + 'deg)';
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* 3D Tilt */
let bounds;
function updateBounds() { bounds = stage.getBoundingClientRect(); }
updateBounds();
window.addEventListener('resize', updateBounds);

stage.addEventListener('mousemove', e => {
  if (!bounds) updateBounds();
  const x = (e.clientX - bounds.left) / bounds.width - 0.5;
  const y = (e.clientY - bounds.top) / bounds.height - 0.5;
  tilt.style.transform = 'rotateY(' + (x * 16).toFixed(2) + 'deg) rotateX(' + (-y * 16).toFixed(2) + 'deg) scale(1.02)';
});
stage.addEventListener('mouseleave', () => {
  tilt.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') resetView();
});

// Initialize
renderConcentricWheel();
</script>
</body>
</html>`;

// Write to files
fs.writeFileSync('C:/LLM/project-plan-repo/Gulprit_Team_Wheel.html', htmlContent, 'utf8');
fs.writeFileSync('C:/LLM/project-plan-repo/wheel.html', htmlContent, 'utf8');
fs.writeFileSync('C:/Users/saxen/Desktop/Work/Gulprit_Team_Wheel.html', htmlContent, 'utf8');
fs.writeFileSync('C:/Users/saxen/Desktop/Work/wheel.html', htmlContent, 'utf8');

console.log('Successfully written Concentric Wheel HTML to repository and Desktop copies.');
