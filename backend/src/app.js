import express from 'express';
import session from 'express-session';
import passport from 'passport';
import connectDB from './database/connection.js';
import User from './database/models/User.js';
import dotenv from 'dotenv';
import connectEnsureLogin from 'connect-ensure-login';
import bodyParser from 'body-parser';
import cors from 'cors';
import Team from './database/models/Team.js';
import Task from './database/models/Task.js';
import MongoStore from 'connect-mongo';

dotenv.config();

const app = express();

await connectDB()

// console.log("environment: ", process.env.NODE_ENV !== 'development')
// console.log(process.env.FRONTEND_URL, process.env.NODE_ENV)

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

app.use(express.json())
// Configure Sessions Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, 
    sameSite: 'none', 
    secure: process.env.NODE_ENV !== 'development',
    // domain: process.env.NODE_ENV !== 'development' ? '.vercel.app' : undefined
  }, // 1 week
  proxy: true,
  // store: MongoStore.create({
  //   mongoUrl: process.env.MONGODB_URI,
  //   collectionName: 'sessions', // optional - defaults to 'sessions'
  //   ttl: 7 * 24 * 60 * 60 // Session TTL (in seconds)
  // }),
}));

// Configure More Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.set('trust proxy', 1); // trust first proxy

// Passport Local Strategy
passport.use(User.createStrategy());

// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ success: false, message: "Unauthorized" });
}

app.get('/', (req, res) => {
  res.send('Welcome to the Glacier App');
})

app.get('/secret', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.send('This is the secret page. Only logged in users can see this.');
});

app.get("/api/logout", (req, res, next) => {
    console.log('Logout route hit');
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect("/login");
  });
});

app.post('/api/signup', async (req, res) => {
    // console.log('Signup route hit');
  try {
        const { name, username, password } = req.body;

        // Validate required fields
        if (!name || !username || !password) {

            // console.log('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Name, username, and password are required'
            });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            // console.log('Username already exists:', username);
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Create new user object
        const newUser = new User({
            name,
            username
        });

        // Register user with passport-local-mongoose
        const registeredUser = await User.register(newUser, password);

        // Automatically log in the user after registration
        req.login(registeredUser, (err) => {
            // console.log('Auto login after registration');
            if (err) {
                console.error('Login error after registration:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Registration successful but login failed'
                });
            }

            res.status(201).json({
                success: true,
                message: 'User registered and logged in successfully',
                user: {
                    id: registeredUser._id,
                    name: registeredUser.name,
                    username: registeredUser.username
                }
            });
        });

    } catch (error) {
        // console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

app.post('/api/login', (req, res, next) => {
    
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log("pass error: ", err)
            return next(err);
        }
        if (!user) {
            console.log("Invalid credentials")
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            
            console.log('Login successful');
            console.log('Logged in user:', req.user);
            
            return res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username
                }
            });
        });
    })(req, res, next);
});

app.get('/api/user/isauthenticated', (req, res) => {
    console.log('is authenticated route hit')
    // console.log('User is authenticated:', req?.user);
    if (req.isAuthenticated()) {
        console.log('User is authenticated:', req.user);
        res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                username: req.user.username
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
});

app.post('/api/create/team', async (req,res) => {
    console.log("create team route hit");
    
    const { title } = req.body;
    console.log('Create team route hit');
    console.log('Team Name:', title);
    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'Team name is required'
        });
    }
    const team = await Team.create({ title, admin: req.user._id, members: [req.user._id] });
    console.log('Team created:', team);
    res.status(201).json({
        success: true,
        message: 'Team created successfully',
        team
    });
})

app.patch('/api/team/memebers/add', async (req,res) => {
    console.log('Add team member route hit');
    const isAdmin = await Team.findOne({ _id: req.body.teamId, admin: req.user._id });
    if (!isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Only team admin can add members'
        });
    }
    const { teamId, userId } = req.body;
    console.log('Team ID:', teamId);
    console.log('User ID:', userId);
    if (!teamId || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Team ID and User ID are required'
        });
    }
    const team = await Team.findByIdAndUpdate(teamId, { $addToSet: { members: userId } }, { new: true });
    console.log('Team updated:', team);
    res.status(200).json({
        success: true,
        message: 'Member added to team successfully',
        team
    });
})

app.post("/api/team/add/task", async (req, res) => {
    console.log('Add task route hit');
  try {
    const { teamId, title, description, assignedTo, dueDate } = req.body;

    // verify admin
    const isAdmin = await Team.findOne({ _id: teamId, admin: req.user._id });
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only team admin can add tasks",
      });
    }

    if (!title || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Title and Assigned To are required",
      });
    }

    // create task
    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
    });

    // push task into team
    await Team.findByIdAndUpdate(teamId, { $push: { tasks: task._id } });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.error("Add task error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get('/api/admin/teams', isAuthenticated, async (req,res) => {
    console.log('Admin get teams route hit');
    console.log('Get teams route hit');
    const teams = await Team.find({ members: req.user._id }).populate('admin', 'name username').populate('members', 'name username');
    res.status(200).json({
        success: true,
        teams
    });
})

app.get('/api/team/:id', async (req,res) => {
    console.log('Get team by ID route hit');
    const team = await Team.findOne({ _id: req.params.id, members: req.user._id })  
    .populate('admin', 'name username')
    .populate('members', 'name username');
    if (!team) {
        return res.status(404).json({
            success: false,
            message: 'Team not found or you are not a member'
        });
    }
    const tasks = await Task.find({ assignedTo: { $in: team.members } }).populate('assignedTo', 'name username')
    res.status(200).json({
        success: true,
        team,
        tasks
    });
})

// Search user by username
app.get('/api/user', async (req, res) => {
  console.log('Search users route hit');
  const { username } = req.query;  // use query, not params

  if (!username) {
    return res.status(400).json({
      success: false,
      message: 'Username query is required',
    });
  }

  const users = await User.find(
    { username: new RegExp(username, 'i') }, // case-insensitive search
    'name username'
  );

  res.status(200).json({
    success: true,
    users,
  });
});

app.post("/api/teams/:teamId/add-member", async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // check team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // check if already a member
    if (team.members.includes(userId)) {
      return res.status(400).json({ error: "User already in team" });
    }

    // add member
    team.members.push(userId);
    await team.save();

    res.status(200).json({ message: "Member added successfully", team });
  } catch (err) {
    console.error("Add member error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/teams/:teamId/:username/assign-task", async (req, res) => {
    console.log('Assign task route hit');
  try {
    const { teamId, username } = req.params;
    const { title, description } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Include team reference
    const newTask = new Task({
      title,
      description,
      team: team._id,
      assignedTo: user._id,
    });

    await newTask.save();

    team.tasks.push(newTask._id);
    await team.save();

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error assigning task:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get tasks assigned to the logged-in user
app.get("/api/my-tasks", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("team", "title") // show team name
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching my tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/teams", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const teams = await Team.find({ members: req.user._id })
      .populate("admin", "name username")
      .populate("members", "name username");

    res.status(200).json({
      success: true,
      teams,
    });
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// assign port  
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`This app is listening on port http://localhost:${port}`));
