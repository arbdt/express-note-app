// this is the main server js file

// server set-up
let express = require("express"); //express module
let path = require("path"); // for file / url paths
let fs = require("fs"); // for working with db.json file

let app = express(); // express server app
let PORT = process.env.PORT || 3003; // port: change when uploading to cloud / use 3003 for local testing

app.use(express.urlencoded({extended: true}));
app.use(express.json()); // for using json
app.use(express.static("public")); // to apply local js and css assets to html pages

// API PATHS ---
// GET notes
app.get("/api/notes", function(request, response){
    // read in content of db.json
    fs.readFile("db/db.json", "utf8", function(err, data){
        if (err){
            console.error(err);
        }
        // convert string into values
        let noteDBcontent = JSON.parse(data);
        // send values
        response.json(noteDBcontent);
    });
});

// POST notes
app.post("/api/notes", function(request, response){ // ERROR: Connection reset when saving
    // newNote has title and text properties
    let newNote = request.body;
    console.log(newNote); // check content
    //read from db.json
    // if everything here is run inside app.listen() it works, so it should work inside app.post() too...
    fs.readFile("db/db.json", "utf8", function(err, data){
        if (err){
            console.error(err);
        }
        console.log(data);
        // convert string into values
        let noteDBcontent = JSON.parse(data);
        // append new note
        noteDBcontent.push(newNote);
        // convert to string for writing
        let dataToWrite = JSON.stringify(noteDBcontent);
        //rewrite to db.json
        fs.writeFile("db/db.json", dataToWrite, "utf8", function(){ 
            response.json(newNote); // return new note to client
        });
    });
});

// DELETE notes
app.delete("/api/notes/:id", function(request, response){
    let idToDelete = request.params.id;
    console.log(idToDelete);
    // read in db.json content
    //match with :id
    // remove matching note
    // rewrite to db.json
});

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