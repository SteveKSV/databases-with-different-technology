const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
app.set('index', './');
app.set('view engine', 'ejs');
// Підключення до бази даних
const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lab_8',
  password: '0x7s-gro9-2rdy',
  port: 5432,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Додавання даних в таблицю
app.get("/create", function(req, res){
  res.render("create.hbs");
});

app.post('/create', (req, res) => {
  const { surname, name, patronymic, degree, position} = req.body;
  console.log(degree, position);
  pool.query('INSERT INTO Teachers (Surname, Name, Patronymic, DegreeId, PositionId) VALUES ($1, $2, $3, $4, $5)', [surname, name, patronymic, degree, position], (err, result) => {
    if (err) {
      return console.error(err);
    } else {
      res.redirect('/');
    }
  });
});

// Видалення
app.post("/delete/:id", function(req, res){
          
  const id = req.params.id;
  pool.query("DELETE FROM Teachers WHERE Id=$1", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
});

// Редагування даних в таблиці

app.get("/edit/:id", function(req, res){
  const id = req.params.id;
  res.render("edit.hbs", {id});
});

app.post("/edit", function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
  const surname = req.body.surname;
  const name = req.body.name;
  const patronymic = req.body.patronymic;
  const degree = req.body.degree;
  const position = req.body.position;
  const id = req.body.id;

  pool.query("UPDATE Teachers SET Surname=$1, Name=$2, Patronymic=$3, DegreeId=$4, PositionId=$5 WHERE Id=$6", [surname, name, patronymic, degree, position, id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
});

// Відображення даних з таблиці
app.get('/', (req, res) => {
  pool.query('SELECT * FROM Teachers', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
    } else {
      const rows = result.rows;
      res.render('index.hbs', { rows });
    }
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));