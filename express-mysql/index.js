const mysql = require("mysql2");
const express = require("express");
 
const app = express();
const urlencodedParser = express.urlencoded({extended: false});
 
const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "lab_6",
  password: "0x7s-gro9-2rdy"
});
 
app.set("view engine", "hbs");
 
// получение списка пользователей
app.get("/", function(req, res){
    pool.query("SELECT * FROM Teachers", function(err, data) {
      if(err) return console.log(err);
      res.render("index.hbs", {
          teachers: data
      });
    });
});
// возвращаем форму для добавления данных
app.get("/create", function(req, res){
    res.render("create.hbs");
});
// получаем отправленные данные и добавляем их в БД 
app.post("/create", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    const surname = req.body.surname;
    const name = req.body.name;
    const patronymic = req.body.patronymic;
    const degree = req.body.degree;
    const position = req.body.position;
    pool.query("INSERT INTO Teachers (Surname, Name, Patronymic, Degree, Position) VALUES (?,?,?,?,?)", [surname, name, patronymic, degree, position], function(err, data) {
      if(err) return console.log(err);
      res.redirect("/");
    });
});
 
// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
app.get("/edit/:id", function(req, res){
  const id = req.params.id;
  pool.query("SELECT * FROM Teachers WHERE Id=?", [id], function(err, data) {
    if(err) return console.log(err);
     res.render("edit.hbs", {
        teacher: data[0]
    });
  });
});
// получаем отредактированные данные и отправляем их в БД
app.post("/edit", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
  const surname = req.body.surname;
  const name = req.body.name;
  const patronymic = req.body.patronymic;
  const degree = req.body.degree;
  const position = req.body.position;
  const id = req.body.id;
   
  pool.query("UPDATE Teachers SET Surname=?, Name=?, Patronymic=?, Degree=?, Position=? WHERE Id=?", [surname, name, patronymic, degree, position, id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
});
 
// получаем id удаляемого пользователя и удаляем его из бд
app.post("/delete/:id", function(req, res){
          
  const id = req.params.id;
  pool.query("DELETE FROM teacherstatus WHERE TeacherId=?", [id], function(err, data) {
    if(err) return console.log(err);
  });

  pool.query("DELETE FROM Teachers WHERE Id=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
});

app.listen(3000, function(){
  console.log("Сервер ожидает подключения...");
});