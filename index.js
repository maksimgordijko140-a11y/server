const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000
const Database = require('better-sqlite3')
const db = new Database("./users.db")
const db_two = new Database("./tranzactions.db")

db.exec("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, login TEXT NOT NULL, password TEXT NOT NULL)")
db_two.exec("CREATE TABLE IF NOT EXISTS tranzactions(id INTEGER PRIMARY KEY AUTOINCREMENT, tranzaction INTEGER NOT NULL)")


app.use(cors())
app.use(express.json())

app.get("/api/users/:id", (req, res) => {
    const {id} = req.params
    const sql = db.prepare("SELECT login, password FROM users WHERE id = ?").get(id)
    if (sql) {
        res.json({
            login: sql.login,
            password: sql.password,
            isLogin: true
        })
    }  
    else{
        res.json({
            isLogin: false
        })
    }
})

app.get("/api/tranzactions/sum/:id", (req, res) => {
    const {id} = req.params
    console.log(id)
    const sql = db_two.prepare("SELECT tranzaction FROM tranzactions WHERE id = ?").get(id)
    console.log(sql.tranzaction)
    res.json({
        tranzaction: sql.tranzaction
    })
})

app.post("/api/tranzactions/add", (req, res) => {
    const {sum, id} = req.body
    try{
        const sql = db_two.prepare("UPDATE tranzactions SET tranzaction = tranzaction + ? WHERE id = ?").run(sum, id)
        const selectTranzaction = db_two.prepare("SELECT tranzaction FROM tranzactions WHERE id = ?").get(id)
        res.json({
            tranzaction: selectTranzaction.tranzaction
        })
    }
    catch (err) {
        console.log(err)
    }
} )

app.post("/api/reg", (req, res) => {
    const {login, password} = req.body
    const sql = db.prepare("INSERT INTO users (login, password) VALUES(?, ?)").run(login, password)
    const setTranzaction = db_two.prepare("INSERT INTO tranzactions (tranzaction) VALUES(?)").run(0)
    res.json({
        login: login,
        password: password,
        id: sql.lastInsertRowid,
        isLogin: true
    })
})


app.post("/api/log", (req, res) => {
    const {login, password} = req.body
    const sql = db.prepare("SELECT id FROM users WHERE login = ? AND password = ?").get(login, password)
    if (sql === undefined) {
        res.json({
            isLogin: false
        })
    }
    else{
        res.json({
            login: login,
            password: password,
            id: sql.id,
            isLogin: true
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`)
})
