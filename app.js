require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid').v4;
const ejs = require('ejs');
const mongoose = require('mongoose');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect(`mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.cneb1.mongodb.net/ProjectDB?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true });
const projectSchema = new mongoose.Schema({
    projectId:String,
    projectName: String,
    description:String,
    startDate:String,
    endDate:String,
    totalResources:Number,
    location:String,
})
const userSchema = new mongoose.Schema({
    firstName : String,
    role: String,
    roleLevel:String,
    projectRole:String,
    vendor: String,
    startDate:String,
    gender:String,
    skills: Array,
    score:Number,
    location:String,
    project: {
        projectId:String,
        projectStartDate: String,
        projectEndDate:String
    },
    transferable:Boolean,
});

const Project = mongoose.model("Project", projectSchema);
const User = mongoose.model("User", userSchema);


const project = new Project({
     projectId:"1f6aea75-fca3-4b2f-b87b-fb71b5c8e21a",
    projectName: "Alpino Jalpino",
    description:"This is a short project",
    startDate:"2021-02-21",
    endDate:"2021-12-03",
    totalResources:3,
    location:"AZ",
})

// project.save();





app.get("/", function(req, res){
    res.render("index");
})

app.listen(3000 , ()=>{
    console.log("server running at port 3000");
});
