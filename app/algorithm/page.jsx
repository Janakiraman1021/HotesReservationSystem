'use client';

import React from 'react';

export default function AlgorithmPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0e27',
        color: '#f0f4ff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '32px',
      }}
    >
      <div style={{
        backgroundColor: '#0f1629',
        padding: '20px 28px',
        borderRadius: '10px',
        border: '1px solid rgba(0,212,255,0.08)',
        boxShadow: '0 8px 24px rgba(0,212,255,0.06)'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '26px',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #f0f4ff 0%, #00d4ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>🔹 Booking Optimization — Algorithm</h1>
        <p style={{ color: '#a0afc9', marginTop: '8px', marginBottom: '18px' }}>Choose up to 5 rooms minimizing travel time, preferring same-floor rooms.</p>

        <article style={{ lineHeight: 1.6 }}>
          <section>
            <h2 style={{ color: '#cfefff' }}>🔹 What problem are we solving?</h2>
            <blockquote style={{ color: '#b6c7e6', borderLeft: '4px solid rgba(0,212,255,0.12)', paddingLeft: '12px' }}>
              “Given a partially occupied hotel, choose <strong>up to 5 rooms</strong> such that the <strong>walking time between the first and last room is minimum</strong>, while <strong>preferring same-floor rooms</strong>.”
            </blockquote>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.04)', margin: '18px 0' }} />

          <section>
            <h3 style={{ color: '#d9f7ff' }}>🔹 Core idea (one sentence)</h3>
            <p style={{ color: '#cfefff' }}><strong>Try all reasonable room choices and greedily pick the one with the least travel time.</strong></p>
            <ul style={{ color: '#b6c7e6' }}>
              <li>Rooms are <strong>few (97)</strong></li>
              <li>Max booking is <strong>5</strong></li>
              <li>So brute force is <strong>safe and correct</strong></li>
            </ul>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.04)', margin: '18px 0' }} />

          <section>
            <h3 style={{ color: '#d9f7ff' }}>🔹 Step-by-step logic (this is the heart)</h3>

            <h4 style={{ color: '#cfefff' }}>STEP 1️⃣ Filter available rooms</h4>
            <p style={{ color: '#b6c7e6' }}>From all 97 rooms: remove occupied rooms — keep only free rooms.</p>
            <pre style={{ background: '#07102a', padding: '12px', borderRadius: '8px', overflowX: 'auto', color: '#a9d6ff' }}><code>availableRooms[]</code></pre>

            <h4 style={{ color: '#cfefff' }}>STEP 2️⃣ Try SAME FLOOR first (highest priority)</h4>
            <p style={{ color: '#b6c7e6' }}>Because booking rules say <strong>same floor first</strong>.</p>
            <ol style={{ color: '#b6c7e6' }}>
              <li>Group available rooms by `floor`</li>
              <li>For each floor: if available rooms ≥ requested count, sort by `position` (left → right)</li>
            </ol>

            <h4 style={{ color: '#cfefff' }}>STEP 3️⃣ Find best rooms on a floor (sliding window)</h4>
            <p style={{ color: '#b6c7e6' }}>Example:</p>
            <pre style={{ background: '#07102a', padding: '12px', borderRadius: '8px', overflowX: 'auto', color: '#a9d6ff' }}><code>positions = [1, 2, 5, 6]
request = 3
// possible windows: [1,2,5], [2,5,6]
// pick minimum horizontal distance
</code></pre>

            <h4 style={{ color: '#cfefff' }}>STEP 4️⃣ Choose best SAME FLOOR option</h4>
            <p style={{ color: '#b6c7e6' }}>Pick the floor with minimum horizontal distance. If found → DONE. Otherwise → fallback.</p>

            <h4 style={{ color: '#cfefff' }}>STEP 5️⃣ Cross-floor booking (fallback)</h4>
            <p style={{ color: '#b6c7e6' }}>If no single floor can satisfy the request, generate combinations across floors (max size 5) and evaluate travel time.</p>

            <h4 style={{ color: '#cfefff' }}>STEP 6️⃣ Calculate travel time for each combination</h4>
            <p style={{ color: '#b6c7e6' }}><strong>Vertical travel:</strong></p>
            <pre style={{ background: '#07102a', padding: '12px', borderRadius: '8px', overflowX: 'auto', color: '#a9d6ff' }}><code>(|maxFloor - minFloor|) × 2</code></pre>
            <p style={{ color: '#b6c7e6' }}><strong>Horizontal travel:</strong></p>
            <pre style={{ background: '#07102a', padding: '12px', borderRadius: '8px', overflowX: 'auto', color: '#a9d6ff' }}><code>|maxPosition - minPosition|</code></pre>
            <p style={{ color: '#b6c7e6' }}><strong>Total travel time:</strong></p>
            <pre style={{ background: '#07102a', padding: '12px', borderRadius: '8px', overflowX: 'auto', color: '#a9d6ff' }}><code>vertical + horizontal</code></pre>

            <h4 style={{ color: '#cfefff' }}>STEP 7️⃣ Pick best combination</h4>
            <p style={{ color: '#b6c7e6' }}>Choose the combination with minimum total travel time — global optimal.</p>

            <h4 style={{ color: '#cfefff' }}>STEP 8️⃣ Return result (backend-style)</h4>
            <p style={{ color: '#b6c7e6' }}>Return an array of room ids:</p>
            <pre style={{ background: '#07102a', padding: '12px', borderRadius: '8px', overflowX: 'auto', color: '#a9d6ff' }}><code>[roomId1, roomId2, roomId3]</code></pre>

            <h3 style={{ color: '#d9f7ff' }}>🔹 Why this logic is CORRECT</h3>
            <ul style={{ color: '#b6c7e6' }}>
              <li>Follows booking rules in order</li>
              <li>Always minimizes travel time</li>
              <li>Deterministic and easy to explain</li>
            </ul>

            <h3 style={{ color: '#d9f7ff' }}>🔹 One-sentence explanation (interview-ready)</h3>
            <p style={{ color: '#b6c7e6' }}>“I first try to satisfy the request on a single floor using a sliding window to minimize horizontal distance; if that’s not possible, I evaluate all valid cross-floor combinations and greedily select the one with the least combined vertical and horizontal travel cost.”</p>
          </section>
        </article>
      </div>
    </div>
  );
}
