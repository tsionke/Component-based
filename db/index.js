import fs from 'fs';
import path from 'path';

const USERS_DB_FILE = path.join(process.cwd(), 'users.db.json');
const PICKUPS_DB_FILE = path.join(process.cwd(), 'pickups.db.json');

// Load users DB
export const loadUsersDB = () => {
  let dbRaw = fs.existsSync(USERS_DB_FILE) ? JSON.parse(fs.readFileSync(USERS_DB_FILE, 'utf8')) : {};
  return {
    users: dbRaw.users || [],
    nextId: dbRaw.nextId || 1
  };
};

// Load pickups DB
export const loadPickupsDB = () => {
  let dbRaw = fs.existsSync(PICKUPS_DB_FILE) ? JSON.parse(fs.readFileSync(PICKUPS_DB_FILE, 'utf8')) : {};
  return {
    requests: dbRaw.requests || [],
    nextId: dbRaw.nextId || 1
  };
};

// Save users DB
export const saveUsersDB = (db) => {
  fs.writeFileSync(USERS_DB_FILE, JSON.stringify(db, null, 2));
};

// Save pickups DB
export const savePickupsDB = (db) => {
  fs.writeFileSync(PICKUPS_DB_FILE, JSON.stringify(db, null, 2));
};

// Get users
export const getUsers = () => loadUsersDB().users;

// Find user by email
export const findUserByEmail = (email) => {
  const db = loadUsersDB();
  return db.users.find(u => u.email === email);
};

// Create or update user
export const upsertUser = (userData) => {
  const db = loadUsersDB();
  let user = db.users.find(u => u.email === userData.email);
  if (!user) {
    user = { id: db.nextId++, ...userData };
    db.users.push(user);
  } else {
    Object.assign(user, userData);
  }
  saveUsersDB(db);
  return user;
};

// Update user
export const updateUser = (email, updates) => {
  const db = loadUsersDB();
  const user = db.users.find(u => u.email === email);
  if (user) {
    Object.assign(user, updates);
    saveUsersDB(db);
    return user;
  }
  return null;
};

// Calculate price: 1kg = 3 Birr
export const calculatePrice = (weight) => {
  return typeof weight === 'number' ? weight * 3 : 0;
};

// Get requests (pickup requests) - auto-migrate price
export const getRequests = () => {
  const requests = loadPickupsDB().requests || [];
  requests.forEach(request => {
    if (request.weight && typeof request.weight === 'number' && !request.price) {
      request.price = calculatePrice(request.weight);
    }
  });
  return requests;
};

// Update request status (approve/reject)
export const updateRequestStatus = (id, status) => {
  const db = loadPickupsDB();
  const requestIndex = db.requests.findIndex(r => r.id === id);
  if (requestIndex === -1) return null;

  db.requests[requestIndex].status = status;
  const timestamp = new Date().toISOString();
  if (status === 'approved') {
    db.requests[requestIndex].approvedAt = timestamp;
  } else if (status === 'rejected') {
    db.requests[requestIndex].rejectedAt = timestamp;
  }
  savePickupsDB(db);
  return db.requests[requestIndex];
};

// Create request (pickup) - auto calculate price
export const createRequest = (requestData) => {
  const db = loadPickupsDB();
  const weight = parseFloat(requestData.weight) || 0;
  const request = {
    id: db.nextId++,
    ...requestData,
    weight,
    price: calculatePrice(weight),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  db.requests = db.requests || [];
  db.requests.push(request);
  savePickupsDB(db);
  return request;
};
