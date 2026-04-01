const express = require('express');

const Database = require('better-sqlite3')

const app = express();

const port = process.env.PORT || 3000
const cors = require("cors")
app.use(cors)

app.use(express.json());
const jsonParcer = express.json()
const db = new Database("./users.db")

db.exec("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, login TEXT NOT NULL, password TEXT NOT NULL)")

app.post('/user/api', jsonParcer, (req, res) => {
    const id = req.body.id
    console.log(id)
    const selectId = db.prepare("SELECT * FROM users WHERE id = ?").get(id)
    try {
        res.json({
            login: selectId.login,
            password: selectId.password,
            reg: true
        })
    }
    catch {
        res.json({
            reg: false
        })
    }
})

app.post('/user/reg', (req, res) => {
    const login = req.body.login;
    const password = req.body.password
    const sql = db.prepare("INSERT INTO users (login, password) VALUES(?, ?)").run(login, password)
    res.json({
        reg: true,
        id : sql.lastInsertRowid,
        login: login,
        password: password
    })
});



app.post("/user/log", (req, res) => {
    const login = req.body.login
    const password = req.body.password
    const sql = db.prepare("SELECT * FROM users WHERE login = ? AND password = ?").all(login, password)
    const selectId = db.prepare("SELECT id FROM users WHERE login = ? AND password = ?").get(login, password)
    if (sql.length === 0) {
        res.json({
            log: false
        })
    }
    else {
        res.json({
            log: true,
            login: login,
            password: password,
            id: selectId.id
        })
    }
})


app.listen(port, () => console.log('Server starting on port 3000'));