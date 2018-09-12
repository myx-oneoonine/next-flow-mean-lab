'use strict'

let express = require('express');
let bodyParser = require('body-parser');
let db = require('monk')('mongo:27017/employee');
let path = require('path');
let app = express();


//middleware
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', (req, res, next) => {
    console.log(`${req.body}: ${Date()}`)
    next();
})

app.use((req, res, next) => {
    req.db = db;
    next();
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
})

app.get('/employee', (req, res) => {
    let collection = req.db.get('users');

    collection.find().then(docs => {
        // res.json(docs);
        res.render('employee.pug', { "employees": docs });
    }).catch(error => { res.send(error) });
})

app.get('/api/employee', (req, res) => {
    let collection = req.db.get('users');

    collection.find().then(docs => {
        // res.json(docs);
        res.json({results:docs});
    }).catch(error => { res.send(error) });
})

app.post('/api/employee/create', (req, res) => {
    let name = req.body.name;
    let collection = req.db.get('users');
    let user = req.body;

    collection.insert(user).catch(error => {res.send(error)});

    res.send({successFlag:'done'});
    
})


app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    res.render('login.pug', req.body);
})

app.post('/customer/regis', (req, res) => {

});

app.get('/customer/:id', (req, res) => {
    res.json(
        {
            "message": `your id is ${req.params.id}`
        }
    )
});

app.get('/', (req, res) => {
    res.render('index.pug');
});


//server
app.listen(3000, () => {
    console.log("server start at localhost:3000");
})