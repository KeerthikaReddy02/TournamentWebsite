//Initialization
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const https = require("https");
let alert = require('alert');

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
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
  Tournaments.find({},function(err,tourn){
    tourn.forEach((element) => {
      arr1.push(element.Name);
      arr2.push(element.Time);
      arr3.push(element.Venue);
      arr4.push(element.Contact);
    });
  })
  setTimeout(function(){
     return res.render("guest",{Name:arr1,Time:arr2,Venue:arr3,Contact:arr4});
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
  Tournaments.findById(id,(err,tou)=>{
    arr1=tou.Name;
    arr2=tou.NumberOfPlayers;
    arr3=tou.Format;
    arr4=tou.Time;
    arr5=tou.Venue;
    arr6=tou.Contact;
    arr7=tou.People.length;
  })
  setTimeout(function(){
    return res.render("join",{Name:arr1,NumberOfPlayers:arr2,Format:arr3,Time:arr4,Venue:arr5,Contact:arr6,Id:id,Count:arr7});
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
  var arr1=[];
  var arr2=[];
  Tournaments.findById(id,(err,tou)=>{
    tou.People.forEach((person) => {
      arr1.push(person.Name);
      arr2.push(person.Contact);
    });
  })
  setTimeout(function(){
    return res.render("viewPlayer",{Name:arr1,Contact:arr2});
    return res.send();
},3000)
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

app.post("/tournamentDetails",(request,response)=>{
const {Name, NoOfPlay, Format, Time, Venue, Contact}=request.body;
const tournament = new Tournaments({
  Name:Name,
  NumberOfPlayers : NoOfPlay,
  Format: Format,
  Time:Time,
  Venue:Venue,
  Contact:Contact
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
    alert("Successfully registered tournament");
  }
});
})

//PORTS to listen to
app.listen(process.env.PORT ||27017,()=>console.log("Server is running"));
