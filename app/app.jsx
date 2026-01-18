"use client";

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Controls } from '@/components/Controls';
import { HotelView } from '@/components/HotelView';
import Link from 'next/link';
// Backend-powered: we'll call the Express API at https://hotes-reservation-system-kjt9.vercel.app

/**
 * Generate room data
 * Floors 1-9: 10 rooms each (101-110, 201-210, ...)
 * Floor 10: 7 rooms (1001-1007)
 */

function generateRooms() {
  const rooms = [];

  // Floors 1-9
  for (let floor = 1; floor <= 9; floor++) {
    for (let pos = 0; pos < 10; pos++) {
      rooms.push({
        id: floor * 100 + (pos + 1),
        floor,
        position: pos,
        occupied: false,
        newlyBooked: false,
      });
    }
  }

  // Floor 10 (7 rooms)
  for (let pos = 0; pos < 7; pos++) {
    rooms.push({
      id: 1000 + (pos + 1),
      floor: 10,
      position: pos,
      occupied: false,
      newlyBooked: false,
    });
  }

  return rooms;
}

export default function App() {
  const [rooms, setRooms] = useState(generateRooms());
  const [inputValue, setInputValue] = useState(2);

  // Fetch current rooms from backend
  const fetchRooms = async () => {
    try {
      const res = await fetch('https://hotes-reservation-system-kjt9.vercel.app/api/rooms');
      if (!res.ok) throw new Error('Failed to fetch rooms');
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        // fallback to local generation
        setRooms(generateRooms());
        toast('Using local rooms fallback');
        return;
      }
      // ensure `newlyBooked` flag present on each room
      setRooms(data.map(r => ({ ...r, newlyBooked: false })));
    } catch (err) {
      setRooms(generateRooms());
      toast.error('Could not load rooms from backend — using local data');
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle booking via backend
  const handleBook = async () => {
    try {
      const res = await fetch('https://hotes-reservation-system-kjt9.vercel.app/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestedCount: Number(inputValue) }),
      });
      // Parse JSON if present, otherwise read text
      let data = null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch (e) {
          data = null;
        }
      } else {
        const text = await res.text().catch(() => null);
        if (text) data = { error: text };
      }

      if (!res.ok) {
        const msg = data?.error || `Booking failed (${res.status})`;
        toast.error(msg);
        return;
      }

      const booked = data?.bookedRooms || [];
      setRooms(prev => prev.map(r => booked.includes(r.id) ? { ...r, occupied: true, newlyBooked: true } : r));
      toast.success(`Successfully booked ${booked.length} room(s): ${booked.join(', ')}`);
    } catch (err) {
      toast.error('Booking request failed');
    }
  };

  // Handle randomize via backend
  const handleRandomize = async () => {
    try {
      const res = await fetch('https://hotes-reservation-system-kjt9.vercel.app/api/random', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        toast.error('Randomize failed');
        return;
      }
      const occupiedRooms = data.occupiedRooms || [];
      setRooms(prev => prev.map(r => ({ ...r, occupied: occupiedRooms.includes(r.id), newlyBooked: false })));
    } catch (err) {
      toast.error('Randomize request failed');
    }
  };

  // Handle reset via backend
  const handleReset = async () => {
    try {
      const res = await fetch('https://hotes-reservation-system-kjt9.vercel.app/api/reset', { method: 'POST' });
      if (!res.ok) {
        toast.error('Reset failed');
        return;
      }
      // reload rooms from backend
      await fetchRooms();
      toast.success('Rooms reset');
    } catch (err) {
      toast.error('Reset request failed');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#0a0e27',
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1629',
            color: '#f0f4ff',
            border: '1px solid #1a2749',
            borderRadius: '8px',
            boxShadow: '0 0 16px rgba(0, 212, 255, 0.2)',
          },
          success: {
            style: {
              borderColor: '#00d4ff',
              boxShadow: '0 0 16px rgba(0, 212, 255, 0.4)',
            },
          },
          error: {
            style: {
              borderColor: '#ff1744',
              boxShadow: '0 0 16px rgba(255, 23, 68, 0.4)',
            },
          },
        }}
      />
      <div style={{ 
        backgroundColor: '#0f1629',
        color: '#f0f4ff',
        padding: '24px 32px',
        borderBottom: '2px solid rgba(0, 212, 255, 0.3)',
        boxShadow: '0 8px 24px rgba(0, 212, 255, 0.1)',
      }}>
        <h1 style={{ 
          margin: 0,
          fontSize: '28px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          background: 'linear-gradient(135deg, #f0f4ff 0%, #00d4ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
           HOTEL RESERVATION SYSTEM 
        </h1>
        <p style={{ 
          margin: '8px 0 0 0',
          fontSize: '13px',
          color: '#a0afc9',
          letterSpacing: '0.5px',
        }}>
          97 Total Rooms Across 10 Floors │ Advanced Booking Engine | DSA
        </p>
        <div style={{ marginTop: 12 }}>
          <Link href="/algorithm">
            <button style={{
              background: '#ff4d4f',
              color: '#fff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>View Algorithm</button>
          </Link>
        </div>
      </div>

      <Controls
        inputValue={inputValue}
        onInputChange={setInputValue}
        onBook={handleBook}
        onRandomize={handleRandomize}
        onReset={handleReset}
      />

      <HotelView rooms={rooms} />
    </div>
  );
}
