// this is the main server js file

// server set-up
let express = require("express"); //express module
let path = require("path"); // for file / url paths
let fs = require("fs"); // for working with db.json file

let app = express(); // express server app
let PORT = process.env.PORT || 3003; // port: change when uploading to cloud / use 3003 for local testing

app.use(express.urlencoded({extended: true}));
app.use(express.json()); // for using json
app.use(express.static("public")); // to apply js and css assets to html pages

// PAGE PATHS ---
// notes page
app.get("/notes", function(request, response){
    //send notes.html to the client
    response.sendFile(path.join(__dirname, "public/notes.html"));
});

// home page
app.get("*", function(request, response){
    // send home page to the client
    response.sendFile(path.join(__dirname, "public/index.html"));
});

// ---------- 

// run server
app.listen(PORT, function (){
    console.log(`Server is active and listening on PORT ${PORT}.`);
});