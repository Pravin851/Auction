const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const moment = require("moment");
const cors = require("cors");

// Initialize the app
const app = express();
const PORT = 8080;
const dbURI = "mongodb+srv://pravinkumara67:Pravin%40123@cluster0.p0ljh.mongodb.net/SA";

// Middleware for static files and request parsing
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());  // Enable CORS globally

// Configure session middleware
app.use(
  session({
    secret: "your-secret-key", // Use a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }, // 1 hour session expiry
  })
);

// MongoDB Models
const Student = require("./models/user"); // Assuming the Student model exists

// MongoDB Schema for Bids
const bidSchema = new mongoose.Schema({
  item: String,
  bidAmount: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }, // Reference to Student model
  timestamp: { type: Date, default: Date.now },
});
const Bid = mongoose.model("Bid", bidSchema);

// Connect to MongoDB
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Database connection error: ", err));

// Default route: Serve the auction page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/auction.html");
});

// Route: Sign up a new student
app.post("/signup", async (req, res) => {
  const { register_number, name, dept, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      register_number,
      name,
      dept,
      phone,
      password: hashedPassword,
    });
    await newStudent.save();
    res.status(201).json({ success: true, message: "Sign-up successful!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

// Middleware: Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send("Unauthorized: Please log in.");
  }
};

// Route: Logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to log out.");
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.send("Logged out successfully.");
  });
});

// Protected Route: Place a bid
app.post("/place-bid", isAuthenticated, async (req, res) => {
  const { item, bidAmount } = req.body;

  if (!item || !bidAmount) {
    return res.status(400).send("Item and bid amount are required.");
  }

  try {
    const newBid = new Bid({
      item,
      bidAmount,
      userId: req.session.user.id, // Use session user ID
    });
    await newBid.save();

    const formattedTimestamp = moment(newBid.timestamp).format(
      "MMMM Do YYYY, h:mm:ss a"
    );
    res.send(`<h1>Bid placed successfully for ${item} at ${formattedTimestamp}!</h1>`);
  } catch (err) {
    res.status(500).send("Failed to place bid.");
  }
});

// Route: Serve the home page
app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/public/home.html");
});

// Route: Serve the auction page (optional)
app.get("/auction", (req, res) => {
  res.sendFile(__dirname + "/public/auction.html");
});

app.post("/login", async (req, res) => {
  const { register_number, password } = req.body;

  try {
    const student = await Student.findOne({ register_number });
    
    // Log if student is found
    console.log("Student found: ", student);

    if (!student) {
      return res.status(400).json({ success: false, message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    
    // Log the password match result
    console.log("Password match: ", isMatch);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials!" });
    }

    req.session.user = {
      id: student._id,
      register_number: student.register_number,
      name: student.name,
    };

    // Log session info
    console.log("Session info: ", req.session.user);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Error during login: ", err);
    res.status(500).json({ success: false, message: "An error occurred while logging in!" });
  }
});
