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


const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

const dsUsers = [
    {
        id: 1,
        name: 'Mark'
    },
    {
        id: 2,
        name: 'John'
    },
    {
        id: 3,
        name: 'Marky'
    },
];


// const port = process.env.PORT || 3000;
// app.listen(port, () =>
//     console.log(`Listening on http://localhost:${PORT}...`)
// );


app.use(express.static(path.join(__dirname,)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/api/users', (req, res) => {
    res.send(dsUsers);
});


app.get('/api/users', (req, res) => {
    //sort by name from parameters
    if (req.query.sortBy = 'name') {
        dsUsers.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }
    res.send(dsUsers);
});

app.get('/api/users/:id', (req, res) => {
    const user = dsUsers.find((c) => c.id = parseInt(req.params.id));
    if (!user)
        return resolveSoa.status(404),send('The user with the given ID was not found!');
    res.send(user);
});


app.post('/api/users', (req, res) => {
    if (!req.body.name || req.body.name.length < 3) {
        //400 Bad Request
        res
            .status(400)
            .send('Name is required and should be minimum 3 characters.');
        return;
    } else {
        const user = {
            id: dsUsers.length + 1,
            name: req.body.name,
        };
        dsUsers.push(user);
        res.send(user);
    }
    
});


// const schema = Joi.object({
//     name: Joi.string().min(3).required(),
// });

// const result = schema.validate(req.body);
// if (result.error) {
//     res.status(400).send(result.error.details[0].message);
//     return;
// };


const mongoose = require('mongoose');
mongoose
    .connect('mongodb://127.0.0.1/test')
    .then(() => 
        console.log({
            message: 'Connected to MongoDB...',
        })
    )
    .catch((err) => console.error('Could not connect to MongoDB...', err));



const userModel = require('./userSchema');

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
createUser();



async function getUsers() {
    const users = await userModel.find({ lastname: 'Matining', gender: 'Male' })
        .limit(10)
        .sort({ firstname: 1 })
        .select({ firstname: 1, lastname: 1 });
    console.log(users);
}
getUsers();




const PORT = 3000;
app.listen(PORT, () =>
    console.log(`Listening on http://localhost:${PORT}...`)
);