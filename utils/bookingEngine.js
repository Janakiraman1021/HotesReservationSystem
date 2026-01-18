/**
 * MOCK BACKEND - Hotel Room Booking Engine
 * Pure logic, no side effects, no UI mutations
 * 
 * Algorithm:
 * 1. Filter available rooms
 * 2. Group available rooms by floor
 * 3. For each floor with enough rooms: use sliding window to find minimal horizontal span
 * 4. If same-floor solution exists: pick the one with minimum horizontal distance
 * 5. Else: generate combinations across floors (brute force) and pick minimum total travel time
 */

/**
 * Calculate travel time between two rooms
 * Vertical distance = |floorA - floorB| * 2
 * Horizontal distance = |positionA - positionB|
 * Total = vertical + horizontal
 */
function calculateTravelTime(room1, room2) {
  const verticalDistance = Math.abs(room1.floor - room2.floor) * 2;
  const horizontalDistance = Math.abs(room1.position - room2.position);
  return verticalDistance + horizontalDistance;
}

/**
 * Calculate total travel time for a set of rooms
 * Sum of all pairwise distances
 */
function calculateTotalTravelTime(roomList) {
  let total = 0;
  for (let i = 0; i < roomList.length; i++) {
    for (let j = i + 1; j < roomList.length; j++) {
      total += calculateTravelTime(roomList[i], roomList[j]);
    }
  }
  return total;
}

/**
 * Get all available rooms
 */
function getAvailableRooms(rooms) {
  return rooms.filter((room) => !room.occupied);
}

/**
 * Find best rooms on the same floor using sliding window
 * Returns { roomIds: [id1, id2, ...], horizontalDistance: number } or null
 */
function findBestRoomsOnFloor(rooms, floor, count) {
  const available = getAvailableRooms(rooms).filter((room) => room.floor === floor);

  if (available.length < count) {
    return null; // Not enough rooms on this floor
  }

  // Sort by position (left to right)
  available.sort((a, b) => a.position - b.position);

  let bestSpan = Infinity;
  let bestRooms = null;

  // Sliding window to find minimal horizontal span
  for (let i = 0; i <= available.length - count; i++) {
    const window = available.slice(i, i + count);
    const span = window[window.length - 1].position - window[0].position;

    if (span < bestSpan) {
      bestSpan = span;
      bestRooms = window.map((r) => r.id);
    }
  }

  return bestRooms ? { roomIds: bestRooms, horizontalDistance: bestSpan } : null;
}

/**
 * Generate all combinations of rooms across floors (brute force)
 * For a given set of floor groups, select one room from each group
 */
function generateCombinations(floorGroups, targetCount) {
  const combinations = [];

  // Recursive helper to build combinations
  function buildCombination(groupIndex, current) {
    if (current.length === targetCount) {
      combinations.push([...current]);
      return;
    }

    if (groupIndex >= floorGroups.length) {
      return;
    }

    // Try adding one room from current floor group
    for (const room of floorGroups[groupIndex]) {
      current.push(room);
      buildCombination(groupIndex + 1, current);
      current.pop();
    }

    // Skip current floor group and continue with next
    buildCombination(groupIndex + 1, current);
  }

  buildCombination(0, []);
  return combinations;
}

/**
 * Find best rooms across multiple floors
 * Groups rooms by floor, then generates combinations to minimize total travel
 */
function findBestRoomsMultiFloor(rooms, count) {
  const available = getAvailableRooms(rooms);

  if (available.length < count) {
    return null; // Not enough rooms
  }

  // Group available rooms by floor
  const floorMap = {};
  for (const room of available) {
    if (!floorMap[room.floor]) {
      floorMap[room.floor] = [];
    }
    floorMap[room.floor].push(room);
  }

  // Sort rooms within each floor by position
  for (const floor in floorMap) {
    floorMap[floor].sort((a, b) => a.position - b.position);
  }

  const floorList = Object.keys(floorMap)
    .map(Number)
    .sort((a, b) => a - b);

  // Generate combinations across floors
  const floorGroups = floorList.map((floor) => floorMap[floor]);
  const combinations = generateCombinations(floorGroups, count);

  if (combinations.length === 0) {
    return null;
  }

  // Find combination with minimum total travel time
  let bestCombination = null;
  let minTravelTime = Infinity;

  for (const combination of combinations) {
    const travelTime = calculateTotalTravelTime(combination);

    if (travelTime < minTravelTime) {
      minTravelTime = travelTime;
      bestCombination = combination;
    }
  }

  return bestCombination ? bestCombination.map((r) => r.id) : null;
}

/**
 * Main allocation function - MOCK BACKEND
 * Rules:
 * 1. Max 5 rooms
 * 2. Prefer rooms on the SAME FLOOR first
 * 3. If not possible: minimize total travel time
 * 4. Algorithm is deterministic
 */
export function allocateRooms(rooms, requestedCount) {
  // Validation
  if (requestedCount < 1 || requestedCount > 5) {
    return [];
  }

  const available = getAvailableRooms(rooms);

  if (available.length < requestedCount) {
    return []; // Not enough rooms available
  }

  // Step 1: Try to find rooms on the same floor, starting from floor 1
  let bestSameFloor = null;
  let minHorizontalDistance = Infinity;

  for (const floor of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const sameFloorResult = findBestRoomsOnFloor(rooms, floor, requestedCount);
    if (sameFloorResult && sameFloorResult.horizontalDistance < minHorizontalDistance) {
      minHorizontalDistance = sameFloorResult.horizontalDistance;
      bestSameFloor = sameFloorResult.roomIds;
    }
  }

  // If same-floor solution exists, return it
  if (bestSameFloor) {
    return bestSameFloor;
  }

  // Step 2: Find best rooms across multiple floors
  const multiFloor = findBestRoomsMultiFloor(rooms, requestedCount);
  return multiFloor || [];
}
