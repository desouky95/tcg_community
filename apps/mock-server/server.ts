import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data: any) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// OTP mapping logic (mobile -> fake otp)
const otpStore: Record<string, string> = {};
// Store registration data until OTP is verified
const pendingSignups: Record<string, { fullName: string; username: string }> = {};

app.post('/api/auth/request-otp', (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ error: 'Mobile required' });
  
  // Fake sending WhatsApp, we always set OTP to "1234" for mock convenience
  otpStore[mobile] = '1234';
  res.json({ message: 'OTP sent to WhatsApp' });
});

app.post('/api/auth/signup', (req, res) => {
  const { mobile, fullName, username } = req.body;
  if (!mobile || !fullName || !username) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const db = readDB();
  if (db.users.find((u: any) => u.mobile === mobile)) {
    return res.status(400).json({ error: 'Mobile number already registered' });
  }
  if (db.users.find((u: any) => u.username === username)) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  // Store metadata and "send" OTP
  pendingSignups[mobile] = { fullName, username };
  otpStore[mobile] = '1234';
  
  res.json({ message: 'OTP sent to WhatsApp' });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { mobile, otp } = req.body;
  if (otpStore[mobile] !== otp) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  const db = readDB();
  let user = db.users.find((u: any) => u.mobile === mobile);
  
  if (!user) {
    const signupData = pendingSignups[mobile];
    if (!signupData) {
      return res.status(400).json({ error: 'No pending signup found. Please sign up first.' });
    }

    user = {
      id: String(Date.now()),
      mobile,
      fullName: signupData.fullName,
      username: signupData.username,
      role: 'user',
      points: 0,
      blocked: false
    };
    db.users.push(user);
    delete pendingSignups[mobile]; // Clean up
    writeDB(db);
  } else if (user.blocked) {
    return res.status(403).json({ error: 'User is blocked by admin' });
  }

  // Very fake token
  const token = `mock-jwt-token-for-${user.id}`;
  
  res.json({ token, user });
});

app.get('/api/checklists', (req, res) => {
  const db = readDB();
  res.json(db.checklists);
});

app.get('/api/checklists/:id', (req, res) => {
  const db = readDB();
  const item = db.checklists.find((c: any) => c.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Collection not found' });
  res.json(item);
});

// Category Management
app.get('/api/categories', (req, res) => {
  const db = readDB();
  res.json(db.categories || []);
});

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  
  const db = readDB();
  const exists = db.categories.find((c: any) => c.name.toLowerCase() === name.toLowerCase());
  if (exists) return res.status(400).json({ error: 'Category already exists' });

  const newCategory = { id: String(Date.now()), name, subcategories: [] };
  db.categories.push(newCategory);
  writeDB(db);
  res.status(201).json(newCategory);
});

app.post('/api/categories/:id/subcategories', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Subcategory name is required' });

  const db = readDB();
  const category = db.categories.find((c: any) => c.id === req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });

  if (category.subcategories.includes(name)) {
    return res.status(400).json({ error: 'Subcategory already exists' });
  }

  category.subcategories.push(name);
  writeDB(db);
  res.json(category);
});

app.delete('/api/categories/:id', (req, res) => {
  const db = readDB();
  db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
  writeDB(db);
  res.status(204).send();
});

// Admin adds checklist
app.post('/api/checklists', (req, res) => {
  const { game, name, totalCards } = req.body;
  const db = readDB();
  const newChecklist = {
    id: String(Date.now()),
    game,
    name,
    totalCards
  };
  db.checklists.push(newChecklist);
  writeDB(db);
  res.json(newChecklist);
});

// Admin users logic
app.get('/api/admin/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

app.post('/api/admin/users/:id/block', (req, res) => {
  const { id } = req.params;
  const { blocked } = req.body; // true or false
  const db = readDB();
  
  const userIndex = db.users.findIndex((u: any) => u.id === id);
  if (userIndex > -1) {
    db.users[userIndex].blocked = blocked;
    writeDB(db);
    res.json(db.users[userIndex]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users/:targetUserId/reviews', (req, res) => {
  const { targetUserId } = req.params;
  const { reviewerId, type, comment } = req.body; // type is 'positive' or 'negative'
  
  const db = readDB();
  const targetUser = db.users.find((u: any) => u.id === targetUserId);
  if (!targetUser) return res.status(404).json({ error: 'User not found' });

  const review = {
    id: String(Date.now()),
    reviewerId,
    targetUserId,
    type,
    comment
  };
  
  db.reviews.push(review);
  
  // Calculate points: positive = +10, negative = -5
  if (type === 'positive') targetUser.points += 10;
  if (type === 'negative') targetUser.points -= 5;
  
  writeDB(db);
  res.json({ review, newPoints: targetUser.points });
});

app.get('/api/users/:id/reviews', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const reviews = db.reviews.filter((r: any) => r.targetUserId === id);
  res.json(reviews);
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const user = db.users.find((u: any) => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
