const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require('body-parser');
// Creating the Express server
const app = express();

// Server configuration
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
const PORT = process.env.PORT || 3000;

app.set('index', './');

const db_name = path.join(__dirname, "data", "lab9.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'lab9.db'");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Додавання даних в таблицю
app.get("/create", function(req, res){
  res.render("create.hbs");
});

app.post('/create', (req, res) => {
  const { surname, name, patronymic, degree, position} = req.body;
 
  const sql = 'INSERT INTO Teachers (Surname, Name, Patronymic, Degree, Position) VALUES ($1, $2, $3, $4, $5)';
  const teacher = [surname, name, patronymic, degree, position];
  db.run(sql, teacher, err => {
    if (err) return console.log(err.message);
    res.redirect('/');
  })
  });


// Видалення
app.post("/delete/:id", function(req, res){
          
  const id = req.params.id;
  const sql = "DELETE FROM Teachers WHERE Id=$1";
  db.run(sql, id, err =>{
    if (err) return console.log(err.message);
    res.redirect('/');
  })
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

  const sql = "UPDATE Teachers SET Surname=$1, Name=$2, Patronymic=$3, Degree=$4, Position=$5 WHERE Id=$6";
  const teacher = [surname, name, patronymic, degree, position, id];
  db.run(sql, teacher, err =>{
    if (err) return console.log(err.message);
    res.redirect('/');
  })
});

// Відображення даних з таблиці
app.get('/', (req, res) => {
  const sql = ('SELECT * FROM Teachers');
  db.all(sql, [], (err, rows) => {
    if(err) return console.log(err.message);

    res.render("index.hbs", {model: rows});
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));