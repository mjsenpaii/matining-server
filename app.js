// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });
// app.get('/api/test', (req, res) => {
//     res.send([{ id: 1, text: 'Test Object'}]);
// });
// app.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.query);
// });

// const PORT = 3000;
// app.listen(PORT, () =>
//     console.log(`Listening on http://localhost:${PORT}...`)
// );

// -------new line here-------

// Import required modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userModel = require('./userSchema');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Sample in-memory user data
const dsUsers = [
    { id: 1, name: 'Mark' },
    { id: 2, name: 'John' },
    { id: 3, name: 'Marky' },
];

// Connect to MongoDB
mongoose
    .connect('mongodb://127.0.0.1/test')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...', err));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to get all users
app.get('/api/users', (req, res) => {
    // Sort by name if query parameter is provided
    if (req.query.sortBy === 'name') {
        dsUsers.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }
    res.send(dsUsers);
});

// Route to get a user by ID
app.get('/api/users/:id', (req, res) => {
    const user = dsUsers.find((c) => c.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('The user with the given ID was not found!');
    res.send(user);
});

// Route to create a new user
app.post('/api/users', (req, res) => {
    if (!req.body.name || req.body.name.length < 3) {
        // 400 Bad Request if name is missing or too short
        return res.status(400).send('Name is required and should be minimum 3 characters.');
    }
    const user = {
        id: dsUsers.length + 1,
        name: req.body.name,
    };
    dsUsers.push(user);
    res.send(user);
});

// Function to create a new user in MongoDB
async function createUser() {
    const user = new userModel({
        lastname: 'Matining',
        firstname: 'Mark John',
        gender: 'Male',
        birthday: new Date('2002-12-13'),
    });
    const result = await user.save();
    console.log(result);
}
createUser(); // Call the function to create a user

// Function to get users from MongoDB
async function getUsers() {
    const users = await userModel.find({ lastname: 'Matining', gender: 'Male' })
        .limit(10)
        .sort({ firstname: 1 })
        .select({ firstname: 1, lastname: 1 });
    console.log(users);
}
getUsers(); // Call the function to get users

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}...`));