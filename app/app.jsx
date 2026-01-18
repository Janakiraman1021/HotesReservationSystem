'use client';

import { useState, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Controls } from '@/components/Controls';
import { HotelView } from '@/components/HotelView';
import Link from 'next/link';
import { allocateRooms } from '@/utils/bookingEngine';
import { randomizeOccupancy } from '@/utils/randomize';

/**
 * Generate room data
 * Floors 1-9: 10 rooms each (101-110, 201-210, ...)
 * Floor 10: 7 rooms (1001-1007)
 */
function generateRooms() {
  const rooms = [];
  let id = 1;

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

  // Handle booking
  const handleBook = () => {
    const roomsToBook = allocateRooms(rooms, inputValue);

    if (roomsToBook.length === 0) {
      toast.error(
        `Not enough available rooms for ${inputValue} booking(s). Try the Random Occupancy button first.`
      );
      return;
    }

    // Create new rooms array with marked bookings
    const updated = rooms.map((room) => {
      if (roomsToBook.includes(room.id)) {
        return {
          ...room,
          occupied: true,
          newlyBooked: true,
        };
      }
      return room;
    });

    setRooms(updated);
    toast.success(`Successfully booked ${roomsToBook.length} room(s): ${roomsToBook.join(', ')}`);
  };

  // Handle random occupancy
  const handleRandomize = () => {
    setRooms(randomizeOccupancy(rooms));
  };

  // Handle reset
  const handleReset = () => {
    setRooms(
      rooms.map((room) => ({
        ...room,
        occupied: false,
        newlyBooked: false,
      }))
    );
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
