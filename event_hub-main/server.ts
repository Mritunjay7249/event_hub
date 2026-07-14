import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db.ts";
import { v4 as uuidv4 } from "uuid";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Users
  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT * FROM users").all();
    res.json(users);
  });

  app.post("/api/login", (req, res) => {
    const { email } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "User not found" });
    }
  });

  // Events
  app.get("/api/events", (req, res) => {
    const events = db.prepare(`
      SELECT e.*, 
             (SELECT COUNT(*) FROM registrations WHERE event_id = e.id AND status = 'Confirmed') as attendees,
             (SELECT SUM(e.price) FROM registrations r WHERE r.event_id = e.id AND r.status = 'Confirmed') as revenue
      FROM events e
    `).all();
    res.json(events);
  });

  app.post("/api/events", (req, res) => {
    const { title, description, date, location, category, capacity, price, organizer_id, image, needs_volunteers, needs_workers } = req.body;
    const id = uuidv4();
    db.prepare(`
      INSERT INTO events (id, title, description, date, location, category, capacity, price, organizer_id, image, status, needs_volunteers, needs_workers)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)
    `).run(id, title, description, date, location, category, capacity, price, organizer_id, image, needs_volunteers ? 1 : 0, needs_workers ? 1 : 0);
    res.json({ id });
  });

  app.patch("/api/events/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const keys = Object.keys(updates);
    const setClause = keys.map(k => `${k} = ?`).join(", ");
    const values = [...Object.values(updates), id];
    db.prepare(`UPDATE events SET ${setClause} WHERE id = ?`).run(...values);
    res.json({ success: true });
  });

  // Registrations
  app.get("/api/registrations/:userId", (req, res) => {
    const { userId } = req.params;
    const registrations = db.prepare(`
      SELECT r.*, e.title, e.date, e.location, e.image, e.price
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = ?
    `).all(userId);
    res.json(registrations);
  });

  app.post("/api/register", (req, res) => {
    const { event_id, user_id } = req.body;
    const id = uuidv4();
    const qr_code_data = `TICKET-${id}-${event_id}-${user_id}`;
    db.prepare(`
      INSERT INTO registrations (id, event_id, user_id, qr_code_data)
      VALUES (?, ?, ?, ?)
    `).run(id, event_id, user_id, qr_code_data);
    res.json({ id, qr_code_data });
  });

  app.delete("/api/registrations/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM registrations WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Reviews
  app.get("/api/reviews/:eventId", (req, res) => {
    const { eventId } = req.params;
    const reviews = db.prepare(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.event_id = ?
    `).all(eventId);
    res.json(reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const { event_id, user_id, rating, comment } = req.body;
    const id = uuidv4();
    db.prepare(`
      INSERT INTO reviews (id, event_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, event_id, user_id, rating, comment);
    res.json({ id });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
