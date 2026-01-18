function getCombinations(arr, k, start = 0, path = [], res = []) {
  if (path.length === k) {
    res.push([...path]);
    return res;
  }

  for (let i = start; i < arr.length; i++) {
    path.push(arr[i]);
    getCombinations(arr, k, i + 1, path, res);
    path.pop();
  }

  return res;
}

export function allocateRooms(rooms, requestedCount) {
  const available = rooms.filter(r => !r.occupied);

  const floorMap = {};
  for (const r of available) {
    if (!floorMap[r.floor]) floorMap[r.floor] = [];
    floorMap[r.floor].push(r);
  }

  let bestSameFloor = null;
  let minHorizontal = Infinity;

  const floorsOrdered = Object.keys(floorMap).map(Number).sort((a, b) => a - b);
  for (const floor of floorsOrdered) {
    const list = floorMap[floor];
    if (list.length < requestedCount) continue;

    list.sort((a, b) => a.position - b.position);

    for (let i = 0; i <= list.length - requestedCount; i++) {
      const window = list.slice(i, i + requestedCount);
      const dist = window[window.length - 1].position - window[0].position;

      if (dist < minHorizontal) {
        minHorizontal = dist;
        bestSameFloor = window;
      }
    }
  }

  if (bestSameFloor) {
    return bestSameFloor.map(r => r.id);
  }

  const combos = getCombinations(available, requestedCount);
  let bestCombo = null;
  let minTravel = Infinity;

  let bestAvgFloor = Infinity;
  for (const combo of combos) {
    const floors = combo.map(r => r.floor);
    const positions = combo.map(r => r.position);

    const vertical = (Math.max(...floors) - Math.min(...floors)) * 2;
    const horizontal = Math.max(...positions) - Math.min(...positions);
    const total = vertical + horizontal;

    const avgFloor = floors.reduce((s, v) => s + v, 0) / floors.length;

    if (total < minTravel || (total === minTravel && avgFloor < bestAvgFloor)) {
      minTravel = total;
      bestCombo = combo;
      bestAvgFloor = avgFloor;
    }
  }

  return bestCombo ? bestCombo.map(r => r.id) : [];
}
