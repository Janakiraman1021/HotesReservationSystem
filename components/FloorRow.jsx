/**
 * Renders a single floor with all its rooms
 */
import { RoomCell } from './RoomCell';

export function FloorRow({ floor, rooms }) {
  const floorRooms = rooms
    .filter((room) => room.floor === floor)
    .sort((a, b) => a.position - b.position);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: 'rgba(15, 22, 41, 0.5)',
        border: '1px solid rgba(26, 39, 73, 0.8)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          minWidth: '50px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#00d4ff',
          textShadow: '0 0 8px rgba(0, 212, 255, 0.5)',
        }}
      >
        F{floor}
      </div>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          flex: 1,
        }}
      >
        {floorRooms.map((room) => (
          <RoomCell key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
