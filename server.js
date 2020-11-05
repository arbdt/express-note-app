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
    // note from client has title and text properties
    let postedNote = request.body;
    //read existing notes from db.json
    fs.readFile("db/db.json", "utf8", function(err, data){
        if (err){
            console.error(err);
        }
        // convert string into values
        let noteDBcontent = JSON.parse(data);
        // generate new note for storage from client content
        let noteToAdd = {title: postedNote.title, text: postedNote.text, id: 0};
        // generate note id
        if (noteDBcontent.length == 0){ // if no notes
            noteToAdd.id = 1;
        }
        else { // if notes exist
            let latestId = noteDBcontent[noteDBcontent.length-1].id;
            noteToAdd.id = latestId + 1;
        }
        // append new note to storage
        noteDBcontent.push(noteToAdd);
        // convert to string for writing
        let dataToWrite = JSON.stringify(noteDBcontent);
        //rewrite to db.json
        fs.writeFile("db/db.json", dataToWrite, "utf8", function(){ 
            response.json(postedNote); // return note to client
        });
    });
});

// DELETE notes
app.delete("/api/notes/:id", function(request, response){
    let idToDelete = request.params.id; // get target ID from url
    // read in content of db.json
    fs.readFile("db/db.json", "utf8", function(err, data){
        if (err){
            console.error(err);
        }
        // convert string into values
        let noteDBcontent = JSON.parse(data);
        // match :id with note.id
        for (let i = 0; i < noteDBcontent.length; i++){
            if (noteDBcontent[i].id == idToDelete){
                // remove matching note
                noteDBcontent.splice(i, 1);
                //rewrite to db.json
                let dataToWrite = JSON.stringify(noteDBcontent);
                fs.writeFile("db/db.json", dataToWrite, "utf8", function(){ 
                    response.json(`Note with ID:${idToDelete} deleted.`);
                });
            }
        }
    });


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