const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sqlite = require('sqlite3').verbose();
const url = require("url");
let sql;
const db = new sqlite.Database('./quote.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
});

app.use(bodyParser.json());

app.post('/quote', (req, res) => {
    try {
        const { movie, quote, character } = req.body;
        sql = "INSERT INTO quote(movie, quote, character) VALUES (?,?,?)"
        db.run(sql, [movie, quote, character], (err) => {
            if (err) return res.json({ status: 300, success: false, error: err });

            console.log("successful input", movie, quote, character);
        })
        res.json({
            status: 200,
            success: true,
        })
    } catch (error) {
        return res.json({
            status: 400,
            success: false,
        })
    }
})


//  get request
app.get("/quote", (res, req) => { 
    sql = "SELECT * FROM quote";
    try {
        db.all(sql, [], (err,rows)=>{
            if(!req.app){
                return res.status(400).send("invalid request");
            }

            if(err) return res.json({ status: 300, success: false, error: err });

            if(rows.length < 1)
                return res.json({ status: 300, success: false, error: "No match" });

            return res.json({ status: 200, data: rows, success: true})
        
        })
    } catch (error) {
        return res.json({
            status: 400,
            success: false,
        })
    }
})

app.listen(3000, ()=>{
    console.log("Your app is running!"); 
});
