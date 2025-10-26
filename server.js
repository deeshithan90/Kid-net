const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();
const path = require("path");
const fs = require("fs").promises;

const DATA_FILE = path.join(__dirname, "users.json"); // Use absolute path
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend


// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secretkey123",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// ✅ Ensure users.json exists
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), "utf8");
  }
}
ensureDataFile();

// ✅ Helpers
async function readUsers() {
  const data = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(data || "[]");
}
async function writeUsers(users) {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
}

// ✅ Signup route
app.post("/api/signup", async (req, res) => {
  const { mobile, parent, kidName, mail, school, location, password } = req.body;

  if (!mobile || !parent || !kidName || !mail || !school || !location || !password)
    return res.status(400).json({ ok: false, message: "All fields are required" });

  const users = await readUsers();
  if (users.some((u) => u.mobile === mobile))
    return res.status(400).json({ ok: false, message: "Mobile number already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now(),
    mobile,
    parent,
    kidName,
    mail,
    school,
    location,
    passwordHash: hashed,
  };

  users.push(newUser);
  await writeUsers(users);

  res.json({ ok: true, message: "Signup successful" });
});

// ✅ Login route
app.post("/api/login", async (req, res) => {
  const { mobile, password } = req.body;
  const users = await readUsers();
  const user = users.find((u) => u.mobile === mobile);

  if (!user) return res.status(404).json({ ok: false, message: "User not found" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ ok: false, message: "Invalid password" });

  req.session.userId = user.id;
  res.json({ ok: true, message: "Login successful" });
});

// ✅ Get logged-in user profile
app.get("/api/profile", async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ ok: false, message: "Not logged in" });

  const users = await readUsers();
  const user = users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(404).json({ ok: false, message: "User not found" });

  const { passwordHash, ...safeUser } = user;
  res.json({ ok: true, user: safeUser });
});

// ✅ Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true, message: "Logged out" }));
});

const PORT = 5000;

app.listen(PORT, '0.0.0.0', () => console.log("Server running on http://0.0.0.0:5000"));

