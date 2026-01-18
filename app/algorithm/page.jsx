'use client';

import React, { useEffect, useState } from 'react';

export default function AlgorithmPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`algo-root ${ready ? 'ready' : ''}`}>
      <div className="bg-orbs" />

      <main className="algo-card">
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
      `}</style>
    </div>
  );
}
