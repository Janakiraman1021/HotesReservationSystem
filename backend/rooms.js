export function generateRooms() {
  const rooms = [];

  for (let floor = 1; floor <= 9; floor++) {
    for (let pos = 1; pos <= 10; pos++) {
      rooms.push({
        id: floor * 100 + pos,
        floor,
        position: pos,
        occupied: false
      });
    }
  }

  for (let pos = 1; pos <= 7; pos++) {
    rooms.push({
      id: 1000 + pos,
      floor: 10,
      position: pos,
      occupied: false
    });
  }

  return rooms;
}
