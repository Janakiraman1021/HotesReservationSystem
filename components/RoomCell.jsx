'use client';

/**
 * Individual room cell
 */
export function RoomCell({ room }) {
  let bgColor = 'rgba(42, 63, 95, 0.5)'; // Available - dark blue
  let borderColor = '#2a3f5f';
  let boxShadow = '0 0 8px rgba(42, 63, 95, 0.3)';

  if (room.occupied && room.newlyBooked) {
    bgColor = 'rgba(0, 212, 255, 0.2)'; // Newly booked - cyan
    borderColor = '#00d4ff';
    boxShadow = '0 0 12px rgba(0, 212, 255, 0.5)';
  } else if (room.occupied) {
    bgColor = 'rgba(255, 23, 68, 0.2)'; // Occupied - red
    borderColor = '#ff1744';
    boxShadow = '0 0 12px rgba(255, 23, 68, 0.4)';
  }

  return (
    <div
      style={{
        width: '45px',
        height: '45px',
        backgroundColor: bgColor,
        border: `1.5px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#f0f4ff',
        fontWeight: 'bold',
        borderRadius: '6px',
        boxShadow: boxShadow,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      title={`Room ${room.id} - ${room.occupied ? 'Occupied' : 'Available'}`}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.boxShadow = boxShadow.replace('12px', '16px').replace('0.5)', '0.7)').replace('0.4)', '0.6)');
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = boxShadow;
      }}
    >
      {room.id}
    </div>
  );
}
