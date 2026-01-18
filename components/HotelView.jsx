/**
 * Main hotel visualization - renders all floors
 */
import { FloorRow } from './FloorRow';

export function HotelView({ rooms }) {
  const floors = Array.from({ length: 10 }, (_, i) => 10 - i); // 10 to 1

  return (
    <div
      style={{
        flex: 1,
        padding: '32px',
        overflowY: 'auto',
        backgroundImage: 'linear-gradient(135deg, #0a0e27 0%, #0f1629 50%, #14213d 100%)',
      }}
    >
      <h2 style={{ marginBottom: '32px', fontSize: '24px', fontWeight: 'bold', color: '#f0f4ff', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Hotel Reservation System
      </h2>
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)', borderRadius: '8px' }}>
        <p style={{ color: '#a0afc9', fontSize: '13px', lineHeight: '1.6' }}>
          📍 <span style={{ color: '#00d4ff', fontWeight: '600' }}>Available</span> (Gray) │ 
          📍 <span style={{ color: '#ff1744', fontWeight: '600' }}>Occupied</span> (Red) │ 
          📍 <span style={{ color: '#00d4ff', fontWeight: '600' }}>Newly Booked</span> (Cyan Glow)
        </p>
      </div>
      <div style={{ marginTop: '24px' }}>
        {floors.map((floor) => (
          <FloorRow key={floor} floor={floor} rooms={rooms} />
        ))}
      </div>
    </div>
  );
}
