/**
 * Utility to randomize occupancy
 */

/**
 * Randomly mark 30-50% of rooms as occupied
 */
export function randomizeOccupancy(rooms) {
  const percentage = Math.random() * 0.2 + 0.3; // 30-50%
  const count = Math.floor(rooms.length * percentage);
  const indices = new Set();

  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * rooms.length));
  }

  return rooms.map((room, idx) => ({
    ...room,
    occupied: indices.has(idx),
    newlyBooked: false,
  }));
}
