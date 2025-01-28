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








const PORT = 3000;
app.listen(PORT, () =>
    console.log(`Listening on http://localhost:${PORT}...`)
);