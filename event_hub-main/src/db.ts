import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('events.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    location TEXT,
    category TEXT,
    status TEXT DEFAULT 'Pending',
    capacity INTEGER DEFAULT 100,
    price REAL DEFAULT 0,
    organizer_id TEXT,
    image TEXT,
    needs_volunteers BOOLEAN DEFAULT 0,
    needs_workers BOOLEAN DEFAULT 0,
    FOREIGN KEY (organizer_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'Confirmed',
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    qr_code_data TEXT,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Seed initial data if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)');
  insertUser.run('u1', 'Admin User', 'admin@eventhub.pro', 'Admin');
  insertUser.run('u2', 'John Organizer', 'organizer@eventhub.pro', 'Organizer');
  insertUser.run('u3', 'Sarah Attendee', 'user@eventhub.pro', 'User');

  const insertEvent = db.prepare(`
    INSERT INTO events (id, title, description, date, location, category, status, capacity, price, organizer_id, image, needs_volunteers, needs_workers)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  insertEvent.run(
    '1', 
    'Global Tech Summit 2024', 
    'The premier conference for technology leaders.', 
    '2024-05-15T09:00:00Z', 
    'San Francisco, CA', 
    'Conference', 
    'Published', 
    500, 
    299, 
    'u2', 
    'https://picsum.photos/seed/tech/800/400',
    0, 0
  );
  
  insertEvent.run(
    'ind-1', 
    'Diwali Festival of Lights', 
    'Grand celebration of Diwali with music, dance and food.', 
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 18, 0).toISOString(), 
    'Mumbai, India', 
    'Social', 
    'Published', 
    2000, 
    0, 
    'u2', 
    'https://picsum.photos/seed/diwali/800/400',
    1, 0
  );

  insertEvent.run(
    'ind-2', 
    'Holi Color Run', 
    'Experience the joy of colors in this 5k run.', 
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 8, 0).toISOString(), 
    'Delhi, India', 
    'Social', 
    'Published', 
    1000, 
    500, 
    'u2', 
    'https://picsum.photos/seed/holi/800/400',
    1, 1
  );

  insertEvent.run(
    'ind-3', 
    'Classical Music Concert', 
    'Evening of Indian classical music featuring renowned artists.', 
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 19, 30).toISOString(), 
    'Bangalore, India', 
    'Social', 
    'Published', 
    300, 
    1200, 
    'u2', 
    'https://picsum.photos/seed/music/800/400',
    0, 1
  );

  insertEvent.run(
    'ind-4', 
    'Tech Startup Expo', 
    'Showcasing the best of Indian tech startups.', 
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15, 10, 0).toISOString(), 
    'Hyderabad, India', 
    'Conference', 
    'Published', 
    800, 
    1500, 
    'u2', 
    'https://picsum.photos/seed/startup/800/400',
    0, 0
  );

  insertEvent.run(
    'ind-5', 
    'Navratri Garba Night', 
    'Experience the vibrant energy of Garba dance.', 
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 20, 0).toISOString(), 
    'Ahmedabad, India', 
    'Social', 
    'Published', 
    5000, 
    200, 
    'u2', 
    'https://picsum.photos/seed/garba/800/400',
    1, 0
  );

  insertEvent.run(
    'ind-6', 
    'Jaipur Literature Festival', 
    'The worlds largest free literary festival.', 
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12, 9, 0).toISOString(), 
    'Jaipur, India', 
    'Conference', 
    'Published', 
    10000, 
    0, 
    'u2', 
    'https://picsum.photos/seed/jaipur/800/400',
    1, 1
  );

  insertEvent.run(
    'ind-7', 
    'Sunburn Festival Goa', 
    'Asias biggest Electronic Dance Music festival.', 
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 20, 16, 0).toISOString(), 
    'Goa, India', 
    'Social', 
    'Published', 
    15000, 
    5000, 
    'u2', 
    'https://picsum.photos/seed/sunburn/800/400',
    0, 1
  );

  // New Indian Festivals
  insertEvent.run(
    'fest-1', 
    'Ganesha Chaturthi Celebration', 
    'Grand celebration of Lord Ganesha with traditional rituals and music.', 
    '2026-09-14T10:00:00Z', 
    'Mumbai, India', 
    'Social', 
    'Published', 
    5000, 
    0, 
    'u2', 
    'https://picsum.photos/seed/ganesha/800/400',
    1, 0
  );

  insertEvent.run(
    'fest-2', 
    'Krishna Janmashtami', 
    'Celebrating the birth of Lord Krishna with Dahi Handi and prayers.', 
    '2026-09-04T18:00:00Z', 
    'Mathura, India', 
    'Social', 
    'Published', 
    3000, 
    0, 
    'u2', 
    'https://picsum.photos/seed/krishna/800/400',
    1, 1
  );

  // PCACS College Events
  insertEvent.run(
    'coll-1', 
    'PCACS Education Fair 2026', 
    'Annual education fair for career guidance and university admissions.', 
    '2026-03-15T10:00:00Z', 
    'Panvel Campus, PCACS', 
    'Conference', 
    'Published', 
    1000, 
    0, 
    'u2', 
    'https://picsum.photos/seed/edu/800/400',
    1, 0
  );

  insertEvent.run(
    'coll-2', 
    'Mega Blood Donation Camp', 
    'NSS organized blood donation drive to save lives.', 
    '2026-05-10T09:00:00Z', 
    'PCACS Auditorium', 
    'Social', 
    'Published', 
    500, 
    0, 
    'u2', 
    'https://picsum.photos/seed/blood/800/400',
    1, 0
  );

  insertEvent.run(
    'coll-3', 
    'Career Counseling Seminar', 
    'Expert sessions on career paths and skill development.', 
    '2026-04-12T11:00:00Z', 
    'PCACS Seminar Hall', 
    'Workshop', 
    'Published', 
    300, 
    0, 
    'u2', 
    'https://picsum.photos/seed/career/800/400',
    0, 0
  );

  insertEvent.run(
    'coll-4', 
    'Azadi Ka Amrit Mahotsav', 
    'Celebrating 79 years of Indian Independence with cultural programs.', 
    '2026-08-15T08:00:00Z', 
    'PCACS Ground', 
    'Social', 
    'Published', 
    2000, 
    0, 
    'u2', 
    'https://picsum.photos/seed/azadi/800/400',
    1, 0
  );

  insertEvent.run(
    'coll-5', 
    'Free Eye Check-up Camp', 
    'Community service event for health awareness and eye care.', 
    '2026-06-20T10:00:00Z', 
    'PCACS Health Center', 
    'Social', 
    'Published', 
    200, 
    0, 
    'u2', 
    'https://picsum.photos/seed/eye/800/400',
    1, 1
  );

  insertEvent.run(
    'fest-3', 
    'Holi Festival of Colors', 
    'Celebrate the arrival of spring with colors, music, and sweets.', 
    '2026-03-03T10:00:00Z', 
    'Delhi, India', 
    'Social', 
    'Published', 
    10000, 
    0, 
    'u2', 
    'https://picsum.photos/seed/holi2/800/400',
    1, 0
  );

  insertEvent.run(
    'fest-4', 
    'International Yoga Day', 
    'Join thousands in a mass yoga session for health and peace.', 
    '2026-06-21T06:00:00Z', 
    'Rishikesh, India', 
    'Social', 
    'Published', 
    2000, 
    0, 
    'u2', 
    'https://picsum.photos/seed/yoga/800/400',
    0, 0
  );

  insertEvent.run(
    'fest-5', 
    'Navratri Dandiya Night', 
    'Traditional folk dance celebration with vibrant costumes and music.', 
    '2026-10-10T19:00:00Z', 
    'Surat, India', 
    'Social', 
    'Published', 
    8000, 
    300, 
    'u2', 
    'https://picsum.photos/seed/dandiya/800/400',
    1, 1
  );

  insertEvent.run(
    'fest-6', 
    'Diwali Grand Mela', 
    'A huge fair with shopping, food stalls, and fireworks display.', 
    '2026-11-08T17:00:00Z', 
    'Lucknow, India', 
    'Social', 
    'Published', 
    15000, 
    0, 
    'u2', 
    'https://picsum.photos/seed/diwali2/800/400',
    1, 0
  );

  insertEvent.run(
    'fest-7', 
    'Christmas Carnival', 
    'Winter wonderland with rides, games, and festive treats.', 
    '2026-12-25T11:00:00Z', 
    'Kolkata, India', 
    'Social', 
    'Published', 
    5000, 
    100, 
    'u2', 
    'https://picsum.photos/seed/christmas/800/400',
    0, 1
  );
}

export default db;
