const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
 
const GroupSchema = new Schema({
    Number: Number
});

const LoadSchema = new Schema({
    Teacher_Id: Number,
    Subject_Id: Number,
    Group_Id: Number
});

const SubjectSchema = new Schema({
    name: String
});

const TeacherSchema = new Schema({
    Surname: String, 
    Name: String,
    Patronymic: String,
    Degree: String,
    Position: String
}, {versionKey: false});

const Group = mongoose.model("Groups", GroupSchema);
const Load = mongoose.model("Load", LoadSchema);
const Subject = mongoose.model("Subjects", SubjectSchema);
const Teacher = mongoose.model("Teachers", TeacherSchema);

app.use(express.static(__dirname + "/public"));

async function main(){
    try {
        await mongoose.connect("mongodb://localhost/Lab-5");
    } catch(err) {
        console.log(err);
    } 
}

app.get("/api/teachers", async (req, res) => {
    // get all teachers 
    const teachers = await Teacher.find({});
    res.send(teachers);
});

app.get("/api/teachers/:id", async (req, res) =>{
    const id = req.params.id;

    // get one teacher by id 
    const teacher = await Teacher.findById({_id: id});
    if(teacher) res.send(teacher);
    else res.sendStatus(404);
});

app.post("/api/teachers", jsonParser, async(req, res) => {
    if (!req.body) return res.sendStatus(400);

    const surname = req.body.surname;
    const name = req.body.name;
    const patronymic = req.body.patronymic;
    const degree = req.body.degree;
    const position = req.body.position;

    const teacher = new Teacher({Surname: surname, Name: name, Patronymic: patronymic, Degree: degree, Position: position});
    
    // saving db 

    await teacher.save();
    res.send(teacher);
});

app.delete("/api/teachers/:id", async(req, res)=>{
          
    const id = req.params.id;

    // удаляем по id 
    
    const teacher = await Teacher.findByIdAndDelete(id);
    
    if(teacher) res.send(teacher);
    else res.sendStatus(404);
});
     
app.put("/api/teacher", jsonParser, async (req, res)=>{
          
    if(!req.body) return res.sendStatus(400);
    const id = req.body.Id;

    const teacherSurname = req.body.Surname;
    const teacherName = req.body.Name;
    const teacherPatronymic = req.body.Patronymic;
    const teacherDegree = req.body.Degree;
    const teacherPosition = req.body.Position;

    const newTeacher = {Surname: teacherSurname, Name: teacherName, Patronymic: teacherPatronymic, Degree: teacherDegree, Position: teacherPosition};
    // обновляем данные пользователя по id
    const teacher = await Teacher.findOneAndUpdate({_id: id}, newTeacher, {new: true}); 
    if(teacher) res.send(teacher);
    else res.sendStatus(404);
});
 
main();

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`);
});
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async() => {
      
    await mongoose.disconnect();
    console.log("Приложение завершило работу");
    process.exit();
});