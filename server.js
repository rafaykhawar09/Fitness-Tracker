const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();
app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());
app.use(express.static("public"));
mongoose.connect(process.env.MONGODB_URI || "mongodb://user:password1@ds129098.mlab.com:29098/heroku_c7c3d301t", {
    useNewUrlParser: true
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/stats.html"));
});


app.get("/api/workouts", (req, res) => {
    db.Workout.find({}).then(data=>{
        res.json(data);
    });
});

app.put("/api/workouts/:id", (req, res) => {
    db.Workout.findByIdAndUpdate(req.params.id, {
        $push: {
            exercises: req.body
        }
    }).then(data => {
        res.json(data);
    });
});

app.post("/api/workouts", ({body}, res) => {
    
    db.Workout.create(body).then(data=>{
        res.json(data);
    })
});

app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({}).then(data=>{
        res.json(data);
    })
    .catch(err=>{
        res.json(err);
    });
});

app.listen(PORT, () => {
     console.log(`App running on port 3000! http://localhost:${PORT}`);
});