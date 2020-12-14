const http = require('http');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const Sequelize = require('sequelize')
const {Little_Wins} = require('./models')

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
    <h1>Little wins</h1>
    <form method="POST">
      <label>
        Name:
        <input name="title" type="text" autofocus />
      </label>
      <label>
        Type of Win:
        <select name="category">
          <option value="dev">Tech/programming</option>
          <option value="family">The fam</option>
          <option value="life">Life, in genral</option>
        </select>
      </label> 
     <input type="submit" value="do it!" />
    </form>
    `);
});

app.post('/new', async (req, res) => {
    const { title, category } = req.body;
    const lilWin= await Little_Wins.create({
      title,
      category
    })
    res.redirect('/list');
});

app.get('/list', async (req, res) => {
  const little_win = await Little_Wins.findAll()
    res.send(`
<a href="/new">Go to the form</a>
<ul>
  ${
    little_win.map(w => `<li>${w.title}: ${w.category}</li>`).join('')
  }
</ul>
    `);
});

server.listen(PORT, HOST, () => {
    console.log(`Listening at http://${HOST}:${PORT}`);
});

