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


app.use(session({secret: 'secret', resave: false, saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(`mongodb+srv://${
    process.env.ADMIN
}:${
    process.env.PASSWORD
}@cluster0.cneb1.mongodb.net/ProjectDB?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const projectSchema = new mongoose.Schema({
    projectId: String,
    projectName: String,
    description:String,
    startDate:String,
    endDate:String,
    totalResources:Number,
    location:String,
    isCompleted:Boolean,
})
const userSchema = new mongoose.Schema({
    fullname: String,
    username : String,
    password : String,
    role: String,
    roleLevel: String,
    projectRole: String,
    vendor: String,
    startDate: String,
    gender: String,
    skills: Array,
    score: Number,
    location: String,
    project: [{
        isCompleted:Boolean,
        projectId: String,
        projectStartDate: String,
        projectEndDate: String
    }],
    transferrable: Boolean
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const Project = mongoose.model("Project", projectSchema);


function dateToNumber(car){
    let str=[]
    for(let i = 0; i<car.length ; i++){
        if(car[i] == '-'){
            continue;
        }else{
            str.push(car[i]);
        }
    }
    let newStr = str.join('');
    let newNumber =  Number(newStr);
    return newNumber;
}
function numberToDate(nbr){
    let arr = []
   for(let i= 0; i<nbr.length ; i++){
       if(i == 3 || i == 5){
           arr.push(nbr[i]);
           arr.push("-");
       }else{
           arr.push(nbr[i]);
       }
   }
   return arr.join(''); 
}
//-----------------------------------------------------------------------------------
//                                   HOME ROUTE
//-----------------------------------------------------------------------------------
app.get("/", function (req, res) {
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
    let male,female;
    let genderRatio;
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
                    if(user.role == 'ENGR'){
                        engineers.push(user);
                    }else if(user.role == 'UX'){
                        designers.push(user);
                    }else if(user.gender == "M"){
                        male += 1;
                    }else if(user.female == "F"){
                        female += 1;
                    }
                })
                genderRatio = (male/female) * 100 ;
                res.render("project",{foundUsers,arr,engineers,designers,genderRatio})
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
            // console.log(foundUser);
            res.render("employee",{foundUser});
        }
    })
})


// -------------------------------------------------------------------------------------
//                                 RESOURCE ALLOCATION
// -------------------------------------------------------------------------------------

app.get("/createProject", function (req, res) {
    if(req.isAuthenticated()){
        let upid=req.user._id;
         console.log(upid);
        res.render("createProject",{upid});
    }
    else {
        res.render("pmLogin")
    }
   
});

app.post("/createProject", async (req, res) => {
    let arr = [];
    let team = [];
    let allotArr = [];
    let SEngrNum, MEngrNum, JEngrNum, SuxNum, MuxNum, JuxNum;
    const {
        Oid,
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
        resources,
        SEngr,
        MEngr,
        JEngr,
        SUX,
        MUX,
        JUX
    } = req.body;
    if (Mainframe != undefined) {
        arr.push(Mainframe);
       }
    if (JAVA != undefined) {
        arr.push(JAVA);
    }
    if (ANGULAR != undefined) {
        arr.push(ANGULAR);
    }
    if (IBM != undefined) {
        arr.push(IBM);
    }
    if (NET != undefined) {
        arr.push(NET);
    }
    if (cloud != undefined) {
        arr.push(cloud);
    }
    if (SDE != undefined) {
        team.push(SDE);
    }
    if (Designer != undefined) {
        team.push(Designer);
    }
    if(SEngr != undefined){
        SEngrNum = SEngr;
    }
    if(MEngr != undefined){
        MEngrNum = MEngr;
    }
    if(JEngr != undefined){
        JEngrNum = JEngr;
    }
    if(SUX != undefined){
        SuxNum = SUX;
    }
    if(MUX != undefined){
        MuxNum = MUX;
    }
    if(JUX != undefined){
        JuxNum = JUX; 
    }
    // console.log(req.body);
    console.log(arr);

    console.log(team);
    // const skillReq = req.body.skill;
    var id = uuid();
    const project = new Project({
        projectId:id,
        projectName,
        description: projectDescription,
        startDate,
        endDate,
        totalResources: resources,
        location,
        isCompleted:false
    });
    project.save();

    User.find({_id:Oid}, (err,founduser)=>{
        if(founduser){
            //console.log(founduser);
            let obj = {
                projectId: id,
                projectStartDate: startDate,
                projectEndDate: endDate
            }
            //console.log(founduser[0].project);
            founduser[0].project.push(obj)
            founduser[0].save();
        }
     });


    let updatedUsers = [];
    User.find({skills: {$in: arr}, location: location.toUpperCase()},(err, foundUsers) => {
        if (err) {
            console.log(err);
        } else {       
                                   
                foundUsers.forEach(elem => {
                    if(elem.score != 0){
                        elem.score = 0; 
                    }
                    var len = elem.project.length;
                    var flag;
                    for(var i=0;i<len;i++){
                        if(dateToNumber(elem.project[i].projectEndDate) < dateToNumber(startDate)){
                            flag = true;
                        }
                        else{
                            flag = false;
                            break;
                        } 
                    }

                    if(flag){
                        updatedUsers.push(elem);
                    }
                });
                
                //console.log(updatedUsers);
                var mainArr = [];
                arr.forEach(Element => {
                    updatedUsers.forEach(user => {
                        if (user.skills.includes(Element)) {
                            user.score += 1;
                        }
                    })
                })
                function compare(a, b) {
                    if (a.score > b.score) {
                        return -1;
                    }
                    if (a.score<b.score ){
                      return 1;
                    }
                    return 0;
                  }
                  
                  updatedUsers.sort( compare );
            }       
                team.forEach(team => {
                        updatedUsers.forEach(user => {
                            if (user.role.toUpperCase() == team.toUpperCase()) {
                                mainArr.push(user);
                            }

                        })
                    })
                    
                team.forEach(team => {
                    mainArr.forEach(elem => {
                        if(team.toUpperCase() == elem.role.toUpperCase()){
                            if(team.toUpperCase() == "ENGR"){
                                if(elem.roleLevel == "senior" && SEngrNum!=0){
                                    // allotArr.push(elem);
                                    // elem.project.projectId = id;
                                    // elem.project.projectStartDate = startDate;
                                    // elem.project.projectEndDate = endDate;
                                    // elem.save();
                                    allotArr.push(elem);
                                    let obj = {
                                        projectId: id,
                                        projectStartDate: startDate,
                                        projectEndDate: endDate
                                    }
                                    elem.project.push(obj)
                                    elem.save();
                                    SEngrNum--;
                                }
                                else if(elem.roleLevel == "mid" && MEngrNum!=0){
                                    // allotArr.push(elem);
                                    // elem.project.projectId = id;
                                    // elem.project.projectStartDate = startDate;
                                    // elem.project.projectEndDate = endDate;
                                    // elem.save();
                                    allotArr.push(elem);
                                    let obj = {
                                        projectId: id,
                                        projectStartDate: startDate,
                                        projectEndDate: endDate
                                    }
                                    elem.project.push(obj)
                                    elem.save();
                                    MEngrNum--
                                }
                                else if(elem.roleLevel == "junior" && JEngrNum!=0){
                                    allotArr.push(elem);
                                    let obj = {
                                        projectId: id,
                                        projectStartDate: startDate,
                                        projectEndDate: endDate
                                    }
                                    elem.project.push(obj);
                                    elem.save();
                                    // elem.project.append.projectId = id;
                                    // elem.project.append.projectStartDate = startDate;
                                    // elem.project.projectEndDate = endDate;
                                    // elem.project.push(obj);
                                    // elem.save();
                                    JEngrNum--;
                                }
                            }
                            else if(team == "UX"){
                                if(elem.roleLevel == "senior" && SuxNum!=0){
                                    // allotArr.push(elem);
                                    // elem.projectId = id;
                                    // elem.projectStartDate = startDate;
                                    // elem.projectEndDate = endDate;
                                    // elem.save();
                                    allotArr.push(elem);
                                    let obj = {
                                        projectId: id,
                                        projectStartDate: startDate,
                                        projectEndDate: endDate
                                    }
                                    elem.project.push(obj);
                                    elem.save();
                                    SuxNum--;
                                }
                                else if(elem.roleLevel == "mid" && MuxNum!=0){
                                    // allotArr.push(elem);
                                    // elem.projectId = id;
                                    // elem.projectStartDate = startDate;
                                    // elem.projectEndDate = endDate;
                                    // elem.save();
                                    allotArr.push(elem);
                                    let obj = {
                                        projectId: id,
                                        projectStartDate: startDate,
                                        projectEndDate: endDate
                                    }
                                    elem.project.push(obj);
                                    elem.save();
                                    MuxNum--
                                }
                                else if(elem.roleLevel == "junior" && JuxNum!=0){
                                    // allotArr.push(elem);
                                    // elem.projectId = id;
                                    // elem.projectStartDate = startDate;
                                    // elem.projectEndDate = endDate;
                                    // elem.save();
                                    allotArr.push(elem);
                                    let obj = {
                                        projectId: id,
                                        projectStartDate: startDate,
                                        projectEndDate: endDate
                                    }
                                    elem.project.push(obj);
                                    elem.save();
                                    JuxNum--;
                                }
                            }
                        }
                    })
                })

                    // console.log(allotArr);
                    // console.log(mainArr);
                    
                    res.render("ProjectEmp", {allotArr, team, arr, id})
                }
            );


        });

app.post("/role", function(req, res){
    var secMaven = req.body.id;
    User.findOne({_id: secMaven}, (err, foundUser) => {
        foundUser.projectRole = "Security Maven";
        foundUser.save();
    });
});
  

/*//////////////////////////////////////////////////////////////
REGISTER
////////////////////////////////////////////////////////////////*/

app.get("/register", (req, res) => {
            res.render('register');
        });

        app.post("/empRegister", function (req, res) {
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
                transferrable
            } = req.body
            let arr = []
            if (mainframe != undefined) {
                arr.push(mainframe);
            }
            if (java != undefined) {
                arr.push(java);
            }
            if (angular != undefined) {
                arr.push(angular);
            }
            if (IBM != undefined) {
                arr.push(IBM);
            }
            if (NET != undefined) {
                arr.push(NET);
            }
            if (cloud != undefined) {
                arr.push(cloud);
            }

            // console.log(arr);
            User.register({
                fullname: fullname,
                username: username,
                role: role,
                roleLevel: rolelevel,
                projectRole: Prole,
                vendor: vendor,
                startDate: startDate,
                gender: gender,
                skills: arr,
                score: 0,
                location: location,
                project: {
                    isCompleted:false,
                    projectId: projectId,
                    projectStartDate: projectStartDate,
                    projectEndDate: projectEndDate
                },
                transferrable: transferrable


            }, password, function (err, user) {
                if (err) {
                    console.log(err);
                    res.redirect('/empRegister');
                } else {
                    passport.authenticate('local')(req, res, function () {
                        if (req.user.role.toUpperCase() == "PM") {
                            res.redirect('/pmLanding');
                        } else {
                            res.redirect('/empLanding');
                        }

                    });
                }
            })
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
            //console.log(req.user)
            passport.authenticate('local',{failureRedirect: '/empLogin'})(req,res,function(){
                //console.log(req.user);
                if(req.user.role.toUpperCase()=="UX" || req.user.role.toUpperCase()=="ENGR" ){
                    res.redirect("/empLanding");
                }
            });
                
         }
    });

});

    // -------------------------------------------------------------------
    //                          LANDING ROUTES
    // -------------------------------------------------------------------


        
        app.get("/pmLanding", (req, res) => {
            const projs = [];
            if(req.isAuthenticated()){
                req.user.project.forEach(project => {
                    if(project.isCompleted == false){
                        projs.push(project);
                    }
                })
                res.render("pmLanding",{projects:projs})
            }else{
                res.redirect("/pmLogin")
            }
        })


        // app.get("/empLanding",function(req,res){ 
        //     let name;
        //     if(req.isAuthenticated()){
        //         console.log(req.user);
        //         name = req.user.username;
        //         console.log(name);
        //         res.render("empLanding",{passedname:name});    
        //     }
            
        // })
   // -------------------------------------------------------------------
    //                        Employee  LANDING ROUTES
    // -------------------------------------------------------------------
        app.get("/empLanding",function(req,res){ 
            if(req.isAuthenticated()){
                var techrole,level,gen;
                let name = req.user.fullname;
                let username = req.user.username;
                let role = req.user.role;
                let rolelevel = req.user.roleLevel;
                let projectrole = req.user.projectrole;
                let vendor = req.user.vendor;
                let startdate = req.user.startDate;
                let gender = req.user.gender;
                let skill = req.user.skills;
                let location = req.user.location;
                // let project = req.user.project[0];
                let transfer=req.user.transferrable;
                // let projectid=project.projectId;
             
    
                // var projname,projdesc,projStartDate,projEndDate,projloc; 
                
             
                if(role.toUpperCase()=="ENGR"){
                    techrole="Engineer";
                }
                else if(role.toUpperCase()=="UX")
                {
                    techrole="UX Developer";
                }
    
                if(rolelevel.toUpperCase()=="SENIOR")
                {
                    level="Senior";
                }
                else if(rolelevel.toUpperCase()=="JUNIOR")
                {
                    level="Junior";
                }
                else{
                    level="Mid";
                }
    
                if(gender=="M"){
                    gen="Male"
                }
                else{
                    gen="Female"
                }
                  
                // Project.find({projectId:projectid},(err,foundproject)=>{
                //     if(err){
                //         console.log(err);
                //     }
                //     else{
                //         // foundproject.forEach(item =>{
                           
                //               projname=foundproject[0].projectName;
                //               projdesc=foundproject[0].description;
                //               projStartDate=foundproject[0].startDate;
                //               projEndDate=foundproject[0].endDate;
                //               projloc=foundproject[0].location;
                            
                //         // });
                //     }
                // });

                res.render("empLanding",{passedname:name,username,techrole,level,projectrole,vendor,startdate,gen,skill,location,transfer});
                name = req.user.username;
                res.render("empLanding",{passedname:name});    
            }
            else res.redirect("/empLogin");     
        })

        // -------------------------------------------------------------------
        //                          completeProject
        // -------------------------------------------------------------------
            app.post("/completeProject",(req,res)=>{
                const projectId = req.body.projectId;
                let arr = [],completedProjects=[],ongoingProjects=[];
                Project.find({projectId: projectId},(err,foundProject)=>{
                    if(err){
                        console.log(err);
                    }else{
                        foundProject[0].isCompleted = true;
                        foundProject[0].save();
                    }
                })
                User.find({},(err,foundUsers)=>{
                    if(err){
                        console.log(err);
                    }else{
                        foundUsers.forEach(user => {
                            user.project.forEach(item=>{
                                if(item.projectId == projectId){
                                    arr.push(user);
                                }
                            })                     
                        })
                        arr.forEach(item => {
                            item.project.forEach(project =>{
                                if(project.projectId == projectId){
                                    project.isCompleted = true;
                                    completedProjects.push(project); 
                                    item.save();
                                }else{
                                    if(project.isCompleted == true){
                                        completedProjects.push(project)
                                    }else{
                                        ongoingProjects.push(project);
                                    }
                                }
                            })
                        });
                        res.render("completed/Ongoing",{completedProjects,ongoingProjects});
                    }
                })
            })

        // -------------------------------------------------------------------
        //                          PORT
        // -------------------------------------------------------------------

        app.listen(3000 , ()=>{
            console.log("server running at port 3000");
        });


// "https://xd.adobe.com/view/26bb4dd1-2368-4f71-bf5f-4d7927e93c17-73e8/screen/dbab38c8-e61c-4720-92e2-c5536bfb53af/specs/"