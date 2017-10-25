const express = require("express");
const path = require("path");
const app = express();

app.get("/", (req, res, next) => {
    let indexFile = path.join(__dirname + "/index.html");
    res.sendFile(indexFile, err => {
        if (err) {
            next(err);
        } else {
            console.log(`Sent: ${indexFile}`);
        }
    });
});

app.get("/assets/bundle.js", (req, res) => {
    let bundleFile = path.join(__dirname + "/build/bundle.js");
    res.sendFile(bundleFile, err => {
        if (err) {
            next(err)
        } else {
            console.log(`Sent: ${bundleFile}`);
        }
    });
});

app.listen(3000, () => {
    console.log("minesweeper server now listening on port 3000");
});