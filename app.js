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


// const project = new Project({
//         projectId: "dc9bfc19-47e0-4f56-a751-84a616822fc9",
//         projectName: "Google",
//         description: "We've to make google",
//         totalResources: 5,
//         location: "IL",
//         __v: 0,
//         endDate: "2021-10-29",
//         startDate: "2021-03-01"
//       })

// project.save();

app.get("/", function(req, res){
    res.render("index");
})







//-------------------------------------------------------------------------------------
//                                 RESOURCE ALLOCATION
//-------------------------------------------------------------------------------------

app.get("/createProject", function(req, res){
    res.render("createProject");
});
app.post("/createProject" , async (req,res)=>{
    let arr = [];
    let team = [];
    const {
        Mainframe, 
        JAVA,
        ANGULAR,
        IBM,
        NET,
        cloud,
        SDE,
        Designer,
        location,
        projectName,
        projectDescription,
        startDate,
        endDate,
        resources
    } = req.body;
    if(Mainframe != undefined){
        arr.push(Mainframe);
    }
    if(JAVA != undefined){
        arr.push(JAVA);
    }
    if( ANGULAR != undefined){
        arr.push(ANGULAR);
    }
    if(IBM != undefined){
        arr.push(IBM);
    }
    if(NET != undefined){
        arr.push(NET);
    }
    if(cloud != undefined){
        arr.push(cloud);
    }
    if(SDE != undefined){
        team.push(SDE);
    }
    if(Designer != undefined){
        team.push(Designer);
    }
    // console.log(req.body);
    console.log(arr);
    console.log(team);
    // const skillReq = req.body.skill;
    var id = uuid();
const project = new Project({
    projectId: id,
    projectName,
    description:projectDescription,
    startDate,
    endDate,
    totalResources:resources,
    location,
});
project.save();
           User.find({skills: {$in: arr},location: location.toUpperCase()},(err,foundUsers)=>{
            if(err) {
                console.log(err);
            }else{
                // foundUsers.forEach(user =>{
                //     user.firstName = "shashank";
                // });
                console.log(foundUsers)
                foundUsers.splice(0,resources);
                var mainArr = [];
                arr.forEach(Element => {
                    foundUsers.forEach(user=>{
                        if(user.skills.includes(Element)){
                            user.score += 1;
                        }
                    })
                })         
                function compare( a, b ) {
                    if ( a.score > b.score ){
                      return -1;
                    }
                    if ( a.score < b.score ){
                      return 1;
                    }
                    return 0;
                  }
                  
                  foundUsers.sort( compare );
            }       
                team.forEach(team => {
                    foundUsers.forEach(user => {
                        if(user.role == team){
                            user.project.projectId = id;
                            user.save();
                            mainArr.push(user);
                        }

                    })
                })
                console.log(mainArr);
                res.render("designation" , {mainArr,team,arr})
              // console.log("inner main array")
                // console.log(mainArr);

             
    });
});

//-------------------------------------------------------------------
//                          PORT
//-------------------------------------------------------------------
app.listen(3000 , ()=>{
    console.log("server running at port 3000");
});
