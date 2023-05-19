const express = require('express')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const app = express()

//this parses the body and puts on req object
app.use(express.urlencoded({extended: false}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index' )
})

app.post('/edit', (req, res) => {
    let id =  req.body.uniqueId
    let jsonData = loadUsers()
    let users = jsonData.users
    let user = users.find(({uniqueId}) => uniqueId === id)
    res.render('edit', {user: user})
})

app.post('/removeUser', (req, res) => {
    let id =  req.body.uniqueId
    let jsonData = loadUsers()
    let users = jsonData.users
    console.log(id)
    console.log(users);
    let someone = users.find( user => user.uniqueId === id )
    console.log(`someone: ${someone}`)
    let userIndex = users.indexOf(someone)

    console.log(userIndex)
    users.splice(userIndex, 1)
    jsonData.users=users

    saveUsers(jsonData)

    res.redirect('userListing')
})

app.get('/userListing', (req, res) => {
    let jsonData = loadUsers()
    let users = jsonData.users

    res.render('userListing', {
        users: users,
    })
})

app.post('/create', (req, res) => {
    let jsonData = loadUsers()
    let users = jsonData.users
  
    const user = {
        uniqueId: uuidv4(),
        userName: req.body.userName,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    }
    users.push(user)
    jsonData.users = users

    saveUsers(jsonData)
    res.redirect('/userListing')
})

app.post('/update', (req, res) => {
    let id =  req.body.uniqueId
    let jsonData = loadUsers()
    let users = jsonData.users
    let someone = users.find( user => user.uniqueId === id )
    let userIndex = users.indexOf(someone)

    const user = {
        uniqueId: req.body.uniqueId,
        userName: req.body.userName,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    }
    users.splice(userIndex, 1, user)
    jsonData.users = users

    saveUsers(jsonData)
    res.redirect('/userListing')
})

app.listen(3001, () => {
    console.log('listening on port 3001')
})

function loadUsers() {
    let userListJson = fs.readFileSync('userList.json', 'utf-8')
    let jsonData = JSON.parse(userListJson)

    return jsonData
}

function saveUsers(jsonData) {
    fs.writeFile('userList.json', JSON.stringify(jsonData), function(err) {
        if (err) {{
            console.log(err)
        }}
    })
}