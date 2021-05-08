require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid').v4;
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());




mongoose.connect(`mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.cneb1.mongodb.net/ProjectDB?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true });

const projectSchema = new mongoose.Schema({
    projectId:String,
    projectName: String,
    description:String,
    startDate:String,
    endDate:String,
    totalResources:Number,
    location:String,
    isCompleted:Boolean,
})
const userSchema = new mongoose.Schema({
    username : String,
    password : String,
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
    transferrable:Boolean,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const Project = mongoose.model("Project", projectSchema);



// const project = new Project({
//      projectId:"1f6aea75-fca3-4b2f-b87b-fb71b5c8e21a",
//     projectName: "Alpino Jalpino",
//     description:"This is a short project",
//     startDate:"2021-02-21",
//     endDate:"2021-12-03",
//     totalResources:3,
//     location:"AZ",
// })

// project.save();





app.get("/", function(req, res){
    res.render("index");
})


app.get("/dashboard",(req,res)=>{
res.render("dashboard");
});

app.get("/projectData",(req,res)=>{
    Project.find({},(err,foundProjects)=>{
        if(err){
            console.log(err);
        }else{
            res.json(foundProjects);
        }
    })
})

app.get("/projects/:projectId",(req,res)=>{
    const reqProj = req.params.projectId;
    let arr = [];
    let engineers = [];
    let designers = [];
    Project.find({projectId: reqProj} , (err,foundProject)=>{
        if(err){
            console.log(err);
        }else{
             arr = foundProject;
        }
    }).then(()=>{
        User.find({"project.projectId": reqProj},(err,foundUsers)=>{
            if(err){
                console.log(err);
            }else{
                foundUsers.forEach(user => {
                    if(user.role == 'engr'){
                        engineers.push(user);
                    }else if(user.role == 'UX'){
                        designers.push(user);
                    }
                })
                res.render("project",{foundUsers,arr,engineers,designers})
            }
        })
    })
    })




/*

REGISTER


*/

app.get("/register",(req,res)=>{
    res.render('register')
})

app.get("/employees",(req,res)=>{
    User.find({},(err,foundUsers)=>{
        if(err){
            console.log(err);
        }else{
            res.json(foundUsers);
        }
    })
})

app.get("/employees/:empId",(req,res)=>{
    const reqEmployee = req.params.empId;
    User.find({_id: reqEmployee},(err,foundUser)=>{
        if(err){
            console.log(err);
        }else{
            res.render("employee",{foundUser});
        }
    })
})

app.post("/empRegister",function(req,res){
    console.log(req.body);
    const {
    username,
    password,
    location,
    startDate,
    gender,
    vendor,
    role,
    rolelevel,
    Prole,
    cloud,
    mainframe,
    angular,
    java,
    NET,
    IBM,
    projectId,
    projectStartDate,
    projectEndDate,
    transferrable,
    }=req.body
   let arr =[]
   if(mainframe != undefined){
    arr.push(mainframe);
    }
    if(java != undefined){
        arr.push(java);
    }
    if( angular != undefined){
        arr.push(angular);
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
    console.log(arr);
       User.register(
        {
            username : username,
            role: role,
            roleLevel:rolelevel,
            projectRole:Prole,
            vendor: vendor,
            startDate:startDate,
            gender:gender,
            skills: arr,
            score:0,
            location:location,
            project: {
                projectId:projectId,
                projectStartDate: projectStartDate,
                projectEndDate:projectEndDate,
            },
            transferrable:transferrable,
            

        },
        password,
        function (err, user) {
            if (err) {
                console.log(err);
                res.redirect('/empRegister');
            } else {
                passport.authenticate('local')(req, res, function () {
                    if(req.user.role.toUpperCase() == "PM"){                 
                    res.redirect('/pmLanding'); }
                    else{
                        res.redirect('/empLanding');
                    }
                   
                });
            }
        }
        )
})
 
app.get("/pmLanding",(req,res)=>{
    res.render('pmLanding')
})

app.get("/empLanding",(req,res)=>{
    res.render('empLanding')
})










app.listen(3000 , ()=>{
    console.log("server running at port 3000");
});


// "https://xd.adobe.com/view/26bb4dd1-2368-4f71-bf5f-4d7927e93c17-73e8/screen/dbab38c8-e61c-4720-92e2-c5536bfb53af/specs/"