import express from "express";
import { generateRooms } from "./rooms.js";
import { allocateRooms } from "./bookingEngine.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://hotes-reservation-system.vercel.app"
  ]
}));


app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

let rooms = generateRooms();

app.get("/api/rooms", (req, res) => {
  res.json(rooms);
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend running' });
});

app.post("/api/book", (req, res) => {
  const { requestedCount } = req.body;

  if (requestedCount < 1 || requestedCount > 5) {
    return res.status(400).json({ error: "Invalid room count" });
  }

  const availableCount = rooms.filter(r => !r.occupied).length;
  if (availableCount < requestedCount) {
    return res.status(400).json({ error: `Not enough available rooms. Only ${availableCount} free.` });
  }

  const selectedIds = allocateRooms(rooms, requestedCount);

  rooms = rooms.map(r =>
    selectedIds.includes(r.id)
      ? { ...r, occupied: true }
      : r
  );

  res.json({
    bookedRooms: selectedIds
  });
});

app.post("/api/random", (req, res) => {
  let occupiedCount = 0;
  const occupiedRooms = [];

  rooms = rooms.map(r => {
    const isOccupied = Math.random() < 0.4;
    if (isOccupied) {
      occupiedCount++;
      occupiedRooms.push(r.id);
    }
    return {
      ...r,
      occupied: isOccupied
    };
  });

  res.json({
    occupiedCount,
    occupiedRooms
  });
});

app.post("/api/reset", (req, res) => {
  rooms = generateRooms();
  res.json({ status: "reset" });
});

app.listen(3001, () => {
  console.log("Backend running on https://hotes-reservation-system-kjt9.vercel.app");
});
