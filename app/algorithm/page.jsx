'use client';

import React, { useEffect, useState } from 'react';
import { useRef } from 'react';

export default function AlgorithmPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  // number of rooms to pick (static: 3)
  const requestedCount = 3;

  /* ---------- Visualization logic ---------- */
  const containerRef = useRef(null);
  const floorsRef = useRef(null);
  const svgRef = useRef(null);
  const roomRefs = useRef({});

  // mock data (deterministic occupancy pattern)
  function createMockRooms() {
    const rooms = [];
    // Floors 10 down to 1 for rendering top->bottom
    for (let floor = 10; floor >= 1; floor--) {
      const count = floor === 10 ? 7 : 10;
      const floorRooms = [];
      for (let pos = 0; pos < count; pos++) {
        const id = floor === 10 ? 1000 + pos + 1 : floor * 100 + (pos + 1);
        // deterministic occupancy: occupy every 3rd room, but keep gaps
        const occupied = (pos + floor) % 7 === 0 || (pos % 6 === 0 && floor % 2 === 0);
        floorRooms.push({ id, floor, pos, occupied });
      }
      rooms.push({ floor, rooms: floorRooms });
    }
    return rooms;
  }

  const [mockFloors] = useState(createMockRooms());
  const [animState, setAnimState] = useState({ running: false, step: 0, speed: 1 });

  // helper sleep with speed
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms / animState.speed));

  // draw floors into DOM once
  useEffect(() => {
    const floorsEl = document.getElementById('floors');
    if (!floorsEl) return;
    floorsEl.innerHTML = '';
    roomRefs.current = {};
    mockFloors.forEach((f) => {
      const row = document.createElement('div');
      row.className = 'floor-row';
      row.dataset.floor = f.floor;
      const label = document.createElement('div');
      label.className = 'floor-label';
      label.textContent = `F ${f.floor}`;
      row.appendChild(label);

      const roomsWrap = document.createElement('div');
      roomsWrap.className = 'rooms-wrap';
      f.rooms.forEach((r) => {
        const el = document.createElement('div');
        el.className = 'room';
        if (r.occupied) el.classList.add('occupied');
        el.dataset.id = r.id;
        el.dataset.floor = r.floor;
        el.dataset.pos = r.pos;
        el.textContent = r.id % 1000; // short label
        roomsWrap.appendChild(el);
        roomRefs.current[r.id] = el;
      });
      row.appendChild(roomsWrap);
      floorsEl.appendChild(row);
    });
  }, [mockFloors]);

  // drawing connections (svg lines)
  const drawConnections = (pairs) => {
    const svg = document.getElementById('connections');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rect = svg.getBoundingClientRect();
    pairs.forEach(([a, b]) => {
      const elA = roomRefs.current[a];
      const elB = roomRefs.current[b];
      if (!elA || !elB) return;
      const rA = elA.getBoundingClientRect();
      const rB = elB.getBoundingClientRect();
      const x1 = rA.left + rA.width / 2 - rect.left;
      const y1 = rA.top + rA.height / 2 - rect.top;
      const x2 = rB.left + rB.width / 2 - rect.left;
      const y2 = rB.top + rB.height / 2 - rect.top;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', 'rgba(150,220,255,0.6)');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke-linecap', 'round');
      svg.appendChild(line);
    });
  };

  // core animation runner
  async function runVisualization() {
    if (animState.running) return;
    setAnimState((s) => ({ ...s, running: true }));
    const statusEl = document.getElementById('viz-status');
    // STEP 1: Initialize hotel and highlight origin
    statusEl.textContent = 'STEP 1 — Initialize (origin: Floor 1 Room 101)';
    // highlight origin (Floor 1 pos 0)
    const originEl = Object.values(roomRefs.current).find((el) => el.dataset.floor === '1' && el.dataset.pos === '0');
    if (originEl) {
      originEl.classList.add('origin');
    }
    await sleep(700);
    if (originEl) originEl.classList.remove('origin');

    // STEP 1.5: Filter available rooms
    statusEl.textContent = 'STEP 1 — Filtering rooms';
    // fade occupied
    Object.values(roomRefs.current).forEach((r) => {
      if (r.classList.contains('occupied')) r.classList.add('faded');
      else r.classList.add('available-highlight');
    });
    await sleep(900);
    // remove highlight
    Object.values(roomRefs.current).forEach((r) => r.classList.remove('available-highlight'));

    // STEP 2: Same-floor scan top->bottom
    statusEl.textContent = `STEP 2 — Scanning same floor (looking for ${requestedCount})`;
    // scan starting from Floor 1 upwards (floor 1 -> 2 -> ...)
    const floorsEls = Array.from(document.querySelectorAll('.floor-row')).sort((a, b) => Number(a.dataset.floor) - Number(b.dataset.floor));
    let found = false;
    for (const floorEl of floorsEls) {
      // slide window across this floor starting from pos 0 (closest to lift)
      const roomEls = Array.from(floorEl.querySelectorAll('.room'));
      // flash the floor label
      floorEl.classList.add('scanning');
      await sleep(300);
      // compute positions of available
      const avail = roomEls.map((el, idx) => ({ el, idx, occupied: el.classList.contains('occupied') }));
      const requested = requestedCount;
      if (avail.filter((a) => !a.occupied).length >= requested) {
        // sliding window across positions: window must be contiguous positions where none are occupied
        for (let i = 0; i <= roomEls.length - requested; i++) {
          const windowEls = roomEls.slice(i, i + requested);
          // animate window
          windowEls.forEach((w) => w.classList.add('window'));
          await sleep(600);
          // check if all available
          const allFree = windowEls.every((we) => !we.classList.contains('occupied'));
          if (allFree) {
            // show evaluation briefly then select
            windowEls.forEach((w) => w.classList.add('evaluated'));
            await sleep(300);
            const chosen = windowEls.map((el) => Number(el.dataset.id));
        chosen.forEach((id) => roomRefs.current[id].classList.add('selected'));
            statusEl.textContent = `Same-floor optimal solution found — selected ${chosen.length}`;
        found = true;
            // cleanup window visuals
            windowEls.forEach((w) => w.classList.remove('window', 'evaluated'));
            floorEl.classList.remove('scanning');
            break;
          }
          // clean visuals and continue sliding
          windowEls.forEach((w) => w.classList.remove('window'));
          windowEls.forEach((w) => w.classList.remove('evaluated'));
        }
        if (found) break;
        // if slide finished without finding, continue to next floor
        floorEl.classList.remove('scanning');
        await sleep(200);
        continue;
      }
      floorEl.classList.remove('scanning');
      // small delay before next floor
      await sleep(400);
    }

    // STEP 3: cross-floor fallback (if not found)
    if (!found) {
      statusEl.textContent = 'STEP 3 — Cross-floor fallback';
      // compute all available room ids
      const allAvail = Object.values(roomRefs.current).filter((el) => !el.classList.contains('occupied'));
      // pick a demo combination spread across floors respecting requestedCount
      const n = Math.min(requestedCount, allAvail.length);
      const L = allAvail.length;
      const chosenEls = [];
      if (n === 1) {
        chosenEls.push(allAvail[Math.floor(L / 2)]);
      } else {
        // choose rooms starting near lift on lower floors first to minimize travel
        // sort available by (floor distance from 1 ascending, position ascending)
        const sorted = allAvail.slice().sort((a, b) => {
          const fa = Number(a.dataset.floor);
          const fb = Number(b.dataset.floor);
          const pa = Number(a.dataset.pos);
          const pb = Number(b.dataset.pos);
          const da = Math.abs(fa - 1);
          const db = Math.abs(fb - 1);
          if (da !== db) return da - db;
          return pa - pb;
        });
        for (let i = 0; i < n; i++) chosenEls.push(sorted[i]);
      }
      const chosen = chosenEls.map((el) => Number(el.dataset.id));
      // draw connections
      await sleep(300);
      drawConnections(chosen.map((id, i, arr) => [id, arr[(i + 1) % arr.length]]));
      // bounding box animation: highlight min->max floor rows
      const floors = chosen.map((id) => Number(roomRefs.current[id].dataset.floor));
      const minF = Math.min(...floors);
      const maxF = Math.max(...floors);
      const rows = Array.from(document.querySelectorAll('.floor-row'));
      rows.forEach((r) => {
        const f = Number(r.dataset.floor);
        if (f <= maxF && f >= minF) r.classList.add('boxed');
      });
      await sleep(900);
      // compute and show travel time (visual badge)
      statusEl.textContent = `Computed total travel: ${(maxF - minF) * 2} (vertical) + spread (horizontal) — selected ${chosen.length}`;
      // mark selected
      chosen.forEach((id) => roomRefs.current[id].classList.add('selected'));
      await sleep(600);
    }

    // STEP 4: final pulse
    statusEl.textContent = 'STEP 4 — Final selection';
    Object.values(roomRefs.current).forEach((r) => {
      if (!r.classList.contains('selected')) r.classList.add('muted');
    });
    const selectedEls = Object.values(roomRefs.current).filter((r) => r.classList.contains('selected'));
    selectedEls.forEach((s) => s.classList.add('pulse'));
    await sleep(1000);

    setAnimState((s) => ({ ...s, running: false }));
    statusEl.textContent = 'Done';
  }

  // wire up buttons once DOM is ready
  useEffect(() => {
    const play = document.getElementById('play-btn');
    const reset = document.getElementById('reset-btn');
    const speed = document.getElementById('speed-select');
    const selectRooms = document.querySelector('.controls-row select');
    const statusEl = document.getElementById('viz-status');
    if (!play || !reset || !speed || !statusEl) return;
    const onPlay = async () => {
      if (animState.running) return;
      // apply chosen speed
      setAnimState((s) => ({ ...s, speed: Number(speed.value) }));
      // disable controls during animation
      play.disabled = true;
      reset.disabled = true;
      speed.disabled = true;
      if (selectRooms) selectRooms.disabled = true;
      // clear previous state
      document.querySelectorAll('.room').forEach((r) => r.classList.remove('selected', 'muted', 'boxed', 'faded', 'pulse', 'origin'));
      document.querySelectorAll('.floor-row').forEach((r) => r.classList.remove('scanning'));
      const svg = document.getElementById('connections');
      if (svg) svg.innerHTML = '';
      try {
        await runVisualization();
      } finally {
        play.disabled = false;
        reset.disabled = false;
        speed.disabled = false;
        if (selectRooms) selectRooms.disabled = false;
      }
    };

    const onReset = () => {
      setAnimState((s) => ({ ...s, running: false }));
      document.querySelectorAll('.room').forEach((r) => {
        // restore base classes; keep occupied marker if present
        const occupied = r.classList.contains('occupied');
        r.className = 'room' + (occupied ? ' occupied' : '');
      });
      document.querySelectorAll('.floor-row').forEach((r) => r.classList.remove('scanning', 'boxed'));
      const svg = document.getElementById('connections');
      if (svg) svg.innerHTML = '';
      statusEl.textContent = 'Ready';
      // ensure controls enabled
      play.disabled = false;
      reset.disabled = false;
      speed.disabled = false;
      if (selectRooms) selectRooms.disabled = false;
    };

    play.addEventListener('click', onPlay);
    reset.addEventListener('click', onReset);
    return () => {
      play.removeEventListener('click', onPlay);
      reset.removeEventListener('click', onReset);
    };
  }, [mockFloors]);

  return (
    <div className={`algo-root ${ready ? 'ready' : ''}`}>
      <div className="bg-orbs" />

      <main className="algo-card">
        {/* Visualization section (added) */}
        <section className="viz">
          <div className="viz-controls">
            <div className="controls-row">
              <label>Rooms to pick:</label>
              <select value={3} disabled>
                <option value={3}>3</option>
              </select>
              <button className="btn" id="play-btn">Play animation</button>
              <button className="btn ghost" id="reset-btn">Reset</button>
              <label className="speed">Speed</label>
              <select id="speed-select">
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
              </select>
            </div>
            <div className="status" id="viz-status">Ready</div>
          </div>

          <div className="viz-area" id="viz-area">
            <div className="elevator">Lift</div>
            <div className="floors" id="floors">
              {/* floors rendered by JS below */}
            </div>
            <svg className="connections" id="connections" />
          </div>
        </section>
        <header className="algo-header">
          <div className="title-wrap">
            <h1 className="title">🔹 Booking Optimization</h1>
            <p className="subtitle">Choose up to 5 rooms minimizing travel time — prefer same-floor selections.</p>
          </div>
          <div className="accent" />
        </header>

        <section className="content">
          <article className="panel">
            <h2>🔹 What problem are we solving?</h2>
            <blockquote>
              “Given a partially occupied hotel, choose <strong>up to 5 rooms</strong> such that the <strong>walking time between the first and last room is minimum</strong>, while <strong>preferring same-floor rooms</strong>.”
            </blockquote>
          </article>

          <div className="grid">
            <article className="panel">
              <h3>🔹 Core idea</h3>
              <p className="lead"><strong>Try all reasonable room choices and pick the one with the least travel time.</strong></p>
              <ul>
                <li>Rooms are <strong>few (97)</strong></li>
                <li>Max booking is <strong>5</strong></li>
                <li>Brute force is <strong>safe and correct</strong></li>
              </ul>
            </article>

            <article className="panel">
              <h3>🔹 Quick steps</h3>
              <ol>
                <li>Filter available rooms → <code>availableRooms[]</code></li>
                <li>Try SAME FLOOR first using sliding window</li>
                <li>If not possible, evaluate all cross-floor combinations (max 5)</li>
                <li>Score: vertical = (|maxFloor-minFloor|)*2, horizontal = |maxPos-minPos|</li>
                <li>Pick combination with minimum total travel time</li>
              </ol>
            </article>
          </div>

          <article className="panel">
            <h3>🔹 Why this is correct</h3>
            <ul>
              <li>Follows rules: same-floor preferred</li>
              <li>Evaluates all valid options → global optimal</li>
              <li>Deterministic, explainable, interview-ready</li>
            </ul>
            <p className="one-liner">“I try same-floor windows first; otherwise evaluate all combinations and pick minimum combined travel cost.”</p>
          </article>
        </section>
      </main>

      <style>{`
        :root{--bg:#0a0e27;--panel:#0f1629;--muted:#a0afc9;--accent:#00d4ff;--glass:rgba(255,255,255,0.04)}
        .algo-root{min-height:100vh;background:var(--bg);color:#f0f4ff;font-family:system-ui,-apple-system,Segoe UI,Roboto;padding:48px 32px;position:relative;overflow:hidden}
        .bg-orbs{position:absolute;inset:-20% -10% auto auto;width:60vmin;height:60vmin;background:radial-gradient(circle at 30% 30%, rgba(0,212,255,0.07), transparent 20%), radial-gradient(circle at 80% 70%, rgba(255,77,79,0.03), transparent 15%);filter:blur(30px);transform:translateZ(0);pointer-events:none}
        .algo-card{max-width:1100px;margin:0 auto;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid rgba(0,212,255,0.06);border-radius:16px;padding:28px;box-shadow:0 12px 40px rgba(0,0,0,0.6);backdrop-filter:blur(6px);position:relative}
        .algo-header{display:flex;align-items:center;justify-content:space-between;gap:24px}
        .title{margin:0;font-size:26px;line-height:1;color:var(--accent);text-shadow:0 6px 30px rgba(0,212,255,0.06)}
        .subtitle{margin:6px 0 0 0;color:var(--muted);font-size:13px}
        .accent{width:64px;height:8px;background:linear-gradient(90deg,var(--accent),#8be9ff);border-radius:999px;box-shadow:0 6px 30px rgba(0,212,255,0.12);opacity:0.9}
        .content{margin-top:20px;display:flex;flex-direction:column;gap:18px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
        .panel{background:linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005));border-radius:12px;padding:16px;border:1px solid var(--glass);opacity:0;transform:translateY(8px) scale(0.995);transition:all 480ms cubic-bezier(.2,.9,.2,1)}
        .panel h2,.panel h3{margin:0 0 8px 0;color:#d9f7ff}
        .panel blockquote{margin:0;padding:10px 12px;border-left:3px solid rgba(0,212,255,0.12);color:#cfefff;background:linear-gradient(90deg, rgba(0,212,255,0.02), transparent);border-radius:6px}
        .panel .lead{color:#cfefff}
        .panel ul,.panel ol{margin:8px 0 0 20px;color:#b6c7e6}
        .panel code{background:rgba(255,255,255,0.02);padding:2px 6px;border-radius:6px;color:#9ee7ff}
        .one-liner{margin-top:12px;color:#b6c7e6;font-style:italic}

        /* reveal animation */
        .ready .panel{opacity:1;transform:none}
        .ready .panel:nth-child(1){transition-delay:120ms}
        .ready .panel:nth-child(2){transition-delay:220ms}
        .ready .panel:nth-child(3){transition-delay:320ms}
        .ready .grid .panel:nth-child(1){transition-delay:240ms}
        .ready .grid .panel:nth-child(2){transition-delay:300ms}

        /* subtle hover */
        .panel:hover{transform:translateY(-6px) scale(1.005);box-shadow:0 18px 60px rgba(0,212,255,0.04)}

        /* responsive */
        @media (max-width:880px){.grid{grid-template-columns:1fr}.algo-card{padding:20px}}
        /* visualization styles */
        .viz{margin-bottom:18px;padding:12px;border-radius:12px}
        .viz-controls{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}
        .controls-row{display:flex;gap:8px;align-items:center}
        .controls-row label{color:var(--muted);font-size:13px}
        .btn{background:linear-gradient(90deg,#00bcd4,#0077b6);color:#fff;border:none;padding:8px 10px;border-radius:8px;cursor:pointer}
        .btn.ghost{background:transparent;border:1px solid rgba(255,255,255,0.06)}
        .status{color:var(--muted);font-size:13px}
        .viz-area{display:flex;position:relative;align-items:flex-start;gap:12px}
        .elevator{width:64px;height:420px;background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);border-radius:8px;padding:8px;color:var(--muted);display:flex;align-items:center;justify-content:center}
        .floors{flex:1;max-width:860px;border-radius:8px;padding:6px;display:flex;flex-direction:column;gap:6px;background:linear-gradient(180deg,rgba(255,255,255,0.01),transparent)}
        .floor-row{display:flex;align-items:center;gap:8px;padding:6px}
        .floor-label{width:44px;color:var(--muted);font-size:12px}
        .rooms-wrap{display:flex;gap:6px;flex-wrap:nowrap}
        .room{width:48px;height:34px;border-radius:6px;background:#10203a;color:#cfefff;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:inset 0 -6px 12px rgba(0,0,0,0.4)}
        .room.occupied{background:linear-gradient(180deg,#3b0f0f,#5a1111);color:#ffd6d6}
        .room.faded{opacity:0.28;transform:scale(0.98)}
        .room.available-highlight{box-shadow:0 6px 24px rgba(0,212,255,0.06);transform:translateY(-2px)}
        .room.origin{outline:3px solid rgba(140,200,255,0.12);box-shadow:0 10px 30px rgba(140,200,255,0.06);transform:translateY(-3px)}
        .floor-row.scanning .floor-label{color:#9ee7ff;text-shadow:0 6px 20px rgba(0,212,255,0.04)}
        .room.window{outline:3px solid rgba(0,212,255,0.11);box-shadow:0 8px 30px rgba(0,212,255,0.06);transform:translateY(-4px)}
        .room.evaluated{box-shadow:0 10px 40px rgba(0,212,255,0.08)}
        .room.selected{background:linear-gradient(180deg,#0b6bff,#0046b6);color:#fff;box-shadow:0 14px 50px rgba(0,102,255,0.12)}
        .room.muted{opacity:0.28}
        .room.pulse{animation:pulse 1100ms ease-in-out infinite}
        @keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
        .floor-row.boxed{box-shadow:inset 0 0 0 2px rgba(0,180,255,0.06);border-radius:8px}
        .connections{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}
      `}</style>
    </div>
  );
}
