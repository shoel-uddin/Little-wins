const http = require('http');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const Sequelize = require('sequelize')
const {Pets} = require('./models')


const app = express();
const server = http.createServer(app);



const PORT = 3000;
const HOST = '0.0.0.0';

const logger = morgan('tiny');


const db = [];

app.use(logger);
// Disabling for local development
// app.use(helmet());

// Parse any form data from POST requests
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send(`<h1>Hello!</h1><br><a href="/new">Go to the form</a>`)
});

app.get('/new', (req, res) => {
    res.send(`
<h1>Say something!</h1>
<form method="POST">
  <label>
    Name :
    <input name="name" type="text" autofocus />
  </label>
  <br/>
  <label>
    Breed:
    <input name="breed" type="text" />
  </label>
  <br/>
  <input type="submit" value="do it!" />
</form>
    `);
});

app.post('/new', async (req, res) => {
    const { name, breed } = req.body;
    const newPet = await Pets.create({
      name,
      breed
    })
    res.redirect('/list');
});

app.get('/list', async (req, res) => {
    const pets = await Pets.findAll()
    res.send(`
<a href="/new">Go to the form</a>
<ul>
  ${
    pets.map(p => `<li>${p.name}: ${p.breed}</li>`).join('')
  }
</ul>
    `);
});

server.listen(PORT, HOST, () => {
    console.log(`Listening at http://${HOST}:${PORT}`);
});

