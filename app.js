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
    .connect('mongodb://localhost:27017/db_users')
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

// // Function to create a new user in MongoDB
// async function createUser() {
//     const user = new userModel({
//         lastname: 'Matining',
//         firstname: 'Mark John',
//         gender: 'Male',
//         birthday: new Date('2002-12-13'),
//     });
//     const result = await user.save();
//     console.log(result);
// }
// createUser(); // Call the function to create a user





// Function to get users from MongoDB
/**
 * Asynchronously retrieves and filters users from the database.
 *
 * This function fetches a list of users from the user model by applying case-insensitive regex filters on the
 * lastname and gender properties. It then limits the result set to 10 documents, sorts them based on the
 * firstname property in ascending order, and selects only the firstname and lastname fields for each document.
 * After fetching the initial list, an additional filter is applied to ensure that each user's lastname starts with
 * the letter "M", and the filtered users are logged to the console.
 *
 * @async
 * @function getUsers
 * @returns {Promise<void>} A promise that resolves when the process of retrieving and filtering users is complete.
 */
async function getUsers() {
    // const users = await userModel.find({
    //     $and: [
    //         { lastname: 'Matining' },
    //         { gender: 'Male' },
    //         {
    //             $and: [
    //                 { birthday: { $gte: new Date('2001-12-13') } },
    //                 { birthday: { $lte: new Date('2024-12-31') } }
    //             ]
    //         }
    //     ]
    // })
    //     .limit(10)
    //     .sort({ firstname: 1 })
    //     .select({ firstname: 1, lastname: 1 });
    // console.log("Got Users " + users);

    const users = await userModel.find({
        lastname: /Matining/i,
        gender: /Male/i,
    })
        .limit(10)
        .sort({ firstname: 1 })
        .select({ firstname: 1, lastname: 1 });

    const regex = /^M/i;
    const filteredUsers = users.filter((user) => regex.test(user.lastname));
    console.log("Filtered Users: " + filteredUsers);
}
getUsers(); // Call the function to get users

// Asynchronous function to update a user document in MongoDB based on a query
async function updateUser(query, update) {
    // Find the first user document that matches the query criteria
    const user = await userModel.findOne(query);
    if (user) { 
        // Update the user's firstname and gender using the values from the update object
        user.firstname = update.$set.firstname;
        user.gender = update.$set.gender;
        // Save the updated document back to the database
        const result = await user.save();
        // Log the result of the update operation to the console
        console.log(result);
    }
}

// Define a query object with regex filters for lastname and firstname
const query = {
    lastname: /Matining/i,  // Case-insensitive match for lastname "Matining"
    firstname: /Mark John/i  // Case-insensitive match for firstname "Mark John"
};

// Define an update object that sets new values for firstname and gender fields
const update = { 
    $set: { 
        firstname: 'Marky',  // New firstname value
        gender: 'Female'     // New gender value
    } 
};

// Execute the updateUser function with the defined query and update objects
updateUser(query, update);













// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}...`));