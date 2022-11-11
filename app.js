//Initialization
const express = require("express");
const cors = require("cors"); //Cross-Origin Resource Sharing- for server to share its resources only with clients that are on the same domain.
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // to process data sent in an HTTP request body
let alert = require('alert');

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //to parse incoming requests
app.use(express.json());
app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose
.connect("mongodb+srv://user:user@cluster0.vhxr2p6.mongodb.net/?retryWrites=true&w=majority")
.then(() => console.log("Connected to db"))
.catch(err => console.log(`Could not Connected to db ${process.env.DB_CONNECTION} `, err));

//Making Schema for database
const tournamentSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  NumberOfPlayers: {
    type: Number,
    required: true
  },
  Format: {
    type: String,
    required: true
  },
  Time: {
    type: String,
    required: true
  },
  Venue: {
    type: String,
    required: true
  },
  Contact: {
    type: String,
    required: true
  },
  Date:{
    type: Date,
    required: true
  },
  Remarks:{
    type: String
  },
  People:[{
    Name:{
      type: String,
    },
    Contact:{
      type: String
    }
  }]
});
const Tournaments = new mongoose.model("Tournaments",tournamentSchema);

//GET routes
app.get("/",function(req,res){
  return res.sendFile(__dirname+"/loginPage.html");
})

app.get("/asahost.html",function(req,res){
  var arr=[];
  var arr1=[];
  Tournaments.find({},function(err,tourn){
    tourn.forEach((element) => {
      arr.push(element.Name);
      arr1.push(element._id);
    });
    })
    setTimeout(function(){
       return res.render("asahost",{tourn:arr,id:arr1});
       return res.send();
 },3000)
})

app.get("/asahost2.html",function(req,res){
  return res.sendFile(__dirname+"/asahost2.html");
})

app.get("/asaplayer.html",function(req,res){
  var arr=[];
  var arr1=[];
  Tournaments.find({},function(err,tourn){
    tourn.forEach((element) => {
      arr.push(element.Name);
      arr1.push(element._id);
    });
  })
  setTimeout(function(){
     return res.render("asaplayer",{Tourna:arr,Id:arr1});
     return res.send();
},1000);
})

app.get("/guest.html",function(req,res){
  var arr1=[];
  var arr2=[];
  var arr3=[];
  var arr4=[];
  var arr5=[];
  var arr6=[];
  var arr7=[];
  Tournaments.find({},function(err,tourn){
    tourn.forEach((element) => {
      arr1.push(element.Name);
      arr2.push(element.Time);
      arr3.push(element.Venue);
      arr4.push(element.Contact);
      arr5.push(element.Format);
      arr6.push(element.Date);
      arr7.push(element.Remarks);
    });
  })
  setTimeout(function(){
     return res.render("guest",{Name:arr1,Time:arr2,Date:arr6,Venue:arr3,Contact:arr4,Format:arr5,Remarks:arr7});
     return res.send();
},3000)
})

app.get("/tournament.html",function(req,res){
  return res.sendFile(__dirname+"/tournament.html");
})

//POST routes
app.post("/join",function(req,res){
  var obj=req.body;
  var id;
  var objId=Object.keys(obj)[0];
  if(objId!=='undefined'){
   id=objId;
  }
  var arr1;
  var arr2;
  var arr3;
  var arr4;
  var arr5;
  var arr6;
  var arr7;
  var arrDate;
  var remarks;
  Tournaments.findById(id,(err,tou)=>{
    arr1=tou.Name;
    arr2=tou.NumberOfPlayers;
    arr3=tou.Format;
    arr4=tou.Time;
    arrDate=tou.Date;
    arr5=tou.Venue;
    arr6=tou.Contact;
    arr7=tou.People.length;
    remarks=tou.Remarks;
  })
  setTimeout(function(){
    return res.render("join",{Name:arr1,NumberOfPlayers:arr2,Format:arr3,Time:arr4,Date:arrDate,Venue:arr5,Contact:arr6,Id:id,Count:arr7,Remarks:remarks});
    return res.send();
},3000)
})

app.post("/viewPlayer",function(req,res){
  var obj=req.body;
  var id;
  var objId=Object.keys(obj)[0];
  if(objId!=='undefined'){
   id=objId;
  }
  var arrP1=[];
  var arrP2=[];
  var arr1;
  var arr2;
  var arr3;
  var arr4;
  var arrDate;
  var arr5;
  var arr6;
  var arr7;
  var arr3;
  var stat="Tournament yet to complete";
  Tournaments.findById(id,(err,tou)=>{
    arrId=tou._id;
    let data_ob = new Date();
    if(data_ob-tou.Date>0)
    {
      stat="Tournament Complete";
    }
    arr1=tou.Name;
    arr2=tou.NumberOfPlayers;
    arr3=tou.Format;
    arr4=tou.Time;
    arrDate=tou.Date;
    arr5=tou.Venue;
    arr6=tou.Contact;
    arr7=tou.People.length;
    tou.People.forEach((person) => {
      arrP1.push(person.Name);
      arrP2.push(person.Contact);
    });
  })
  setTimeout(function(){
    return res.render("viewPlayer",{NameHost:arrP1,ContactHost:arrP2,Id:arrId,Date:arrDate,Status:stat,Name:arr1,NumberOfPlayers:arr2,Format:arr3,Time:arr4,Venue:arr5,Contact:arr6,Id:id,Count:arr7});
    return res.send();
},3000)
})

app.post("/deleteTourn",function(req,res){
  var id=req.body.id;
  Tournaments.findOneAndDelete({_id:id},(err,tou)=>{
    if(err)
    {
      console.log(err);
    }
    else
    {
      alert("Tournament has been deleted");
      return res.sendFile(__dirname+"/loginPage.html");
    }
  })
})

app.post("/player",function(req,res){
  var {name,contact,id,noOfPlay}= req.body;
  Tournaments.findById(id,(err,tou)=>{
    if(tou.People.length<noOfPlay)
    {
    tou.People.push({
      Name: name,
      Contact: contact
    })
    tou.save(err=>{
      if(err){
        res.send(err);
      }
      else{
        alert("Successfully added to the game");
        return res.sendFile(__dirname+"/loginPage.html");
      }
    });
  }
  else{
    alert("Game is full, join another game!");
    return res.sendFile(__dirname+"/loginPage.html");
  }
  })
})

app.post("/updateTournDetails",(request,response)=>{
  const {Name, NoOfPlay, Format, Time, Date, Venue, Contact,Remarks,id}=request.body;
  Tournaments.findOneAndUpdate({_id:id},
  {
  Name:Name,
  NoOfPlay:NoOfPlay,
  Format:Format,
  Time:Time,
  Date:Date,
  Venue:Venue,
  Contact:Contact,
  Remarks:Remarks,
  },(err,tou)=>{
    if(err)
    {
      console.log(err);
    }
    else
    {
      alert("Successfully updated tournament details");
    }
  })
  return response.sendFile(__dirname+"/loginPage.html");
})

app.post("/tournamentDetails",(request,response)=>{
const {Name, NoOfPlay, Format, Time, Date, Venue, Contact,Remarks}=request.body;
const tournament = new Tournaments({
  Name:Name,
  NumberOfPlayers : NoOfPlay,
  Format: Format,
  Time:Time,
  Date:Date,
  Venue:Venue,
  Contact:Contact,
  Remarks: Remarks
})
tournament.save(err=>{
  if(err){
    response.send(err);
  }
  else{
    Tournaments.find({},function(err,tourn){
      var arr=[];
      tourn.forEach((element) => {
        arr.push(element.Name);
      });
      setTimeout(function(){
         response.render("asahost",{tourn:arr});
         response.send();
   },3000)
    })
    alert("Successfully created tournament");
  }
});
return response.sendFile(__dirname+"/loginPage.html");
})

//PORTS to listen to
app.listen(process.env.PORT ||27017,()=>console.log("Server is running"));
