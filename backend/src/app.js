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

dotenv.config();

const app = express();

await connectDB()

app.use(cors({
  origin: process.env.FRONTEND_URL, // frontend URL
  credentials: true // allow session cookie from browser to pass through
}));
app.use(express.json())
// Configure Sessions Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure More Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(User.createStrategy());

// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
  res.send('Welcome to the Glacier App');
})

app.get('/api/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.send(`Hello ${req.user.username}. Your session ID is ${req.sessionID}
   and your session expires in ${req.session.cookie.maxAge}
   milliseconds.<br><br>
   <a href="/logout">Log Out</a><br><br>
   <a href="/secret">Members Only</a>`);
});

app.get('/secret', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.send('This is the secret page. Only logged in users can see this.');
});

app.get("/api/logout", (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect("/login");
  });
});

app.post('/api/signup', async (req, res) => {
    console.log('Signup route hit');
  try {
        const { name, username, password } = req.body;

        // Validate required fields
        if (!name || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, username, and password are required'
            });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
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
            if (err) {
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
        console.error('Signup error:', error);
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
    // console.log('is authenticated route hit')
    if (req.isAuthenticated()) {
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
    if (!teamName) {
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
    const isAdmin = await Team.findOne({ _id: req.body.teamId, admin: req.user._id });
    if (!isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Only team admin can add members'
        });
    }
    const { teamId, userId } = req.body;
    console.log('Add team member route hit');
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

app.post('api/team/add/task', async (req,res) => {
    const isAdmin = await Team.findOne({ _id: req.body.teamId, admin: req.user._id });
    if (!isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Only team admin can add tasks'
        });
    }
    // to be implemented
    console.log('Add task route hit');
    const { title, description, assignedTo } = req.body;
    if (!title || !assignedTo) {
        return res.status(400).json({
            success: false,
            message: 'Title and Assigned To are required'
        });
    }
    const task = await Task.create({ title, description, assignedTo });
    res.status(201).json({
        success: true,
        message: 'Task created successfully',
        task
    }); 
})

// assign port 
const port = 3000;
app.listen(port, () => console.log(`This app is listening on port http://localhost:${port}`));
