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
})
const userSchema = new mongoose.Schema({
    fullname: String,
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




/*//////////////////////////////////////////////////////////////

REGISTER

////////////////////////////////////////////////////////////////*/


app.get("/register",(req,res)=>{
    res.render('register')
})

app.post("/empRegister",function(req,res){
    console.log(req.body);
    const {
    fullname,
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
        {   fullname :fullname,
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




/*//////////////////////////////////////////////////////////////

 PM-LOGIN

////////////////////////////////////////////////////////////////*/




app.get("/pmLogin",(req,res)=>{
    res.render('pmLogin')
})


app.post("/login",(req,res)=>{
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
        }
        
        else{
            console.log(req.user)
            passport.authenticate('local',{failureRedirect: '/pmLogin'})(req,res,function(){
                console.log(req.user);
                if(req.user.role.toUpperCase()=="PM"){
                    res.redirect("/pmLanding");
                }
            });
                
         }
    });

});




/*//////////////////////////////////////////////////////////////

 EMP-LOGIN

////////////////////////////////////////////////////////////////*/


app.get("/empLogin",(req,res)=>{
    res.render('empLogin')
})


app.post("/empLogin",(req,res)=>{
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
        }
        
        else{
            console.log(req.user)
            passport.authenticate('local',{failureRedirect: '/empLogin'})(req,res,function(){
                console.log(req.user);
                if(req.user.role.toUpperCase()=="UX" || req.user.role.toUpperCase()=="ENGR" ){
                    res.redirect("/empLanding");
                }
            });
                
         }
    });

});











app.listen(3000 , ()=>{
    console.log("server running at port 3000");
});