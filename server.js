//Setting up Required Modules
const express = require('express') // we are requiring express and we will consume it with code in line 2
const app = express() //wherever you see app, this is really just express 
const MongoClient = require('mongodb').MongoClient //this package helps us connect to our database 

const PORT = 2121 // this is setting our port 

require('dotenv').config() // This has also been added alongside line 16. This means use dotenv and run it
//There should now be a separate .env file within your folder to store the server link


//Setting up Required Modules 

//Database Set Up
let db, // this is a global variable
    //dbConnectionStr = 'mongodb+srv://ashcarey0421:Neli-Ash-and-Kaleo@testcluster.ydsl9q8.mongodb.net/', // this connection string is given by Mongo Atlas that is given when creating a cluster
    dbConnectionStr = process.env.DB_STRING, //These are environment variables to hold our sensitive data
    dbName = 'rap' // this is the name of the actual database 

MongoClient.connect(dbConnectionStr) // this connects our application to our db. 
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) // This is a global vairable that stores the database that is connected
    })
//Database Set Up 

// Middleware/Application Set Up
app.set('view engine', 'ejs') // telling this to use the templating language ejs 
app.use(express.static('public')) // telling this to serve up any files placed in the public folder 
app.use(express.urlencoded({extended: true})) // use this code to parse or look at any of the requests that are coming in
app.use(express.json()) // this line and the one above enable us to look at the data that was sent with the form 
// Middleware/Application Set Up

//This whole section makes up our API

// GET Request 
app.get('/', (request, response) => {
    db.collection('rappers').find().sort({likes: -1}).toArray() // adding the .sort({likes: -1}) sorts the list by highest likes 
    .then(data => { // data is the array that holds the objects 
        response.render('index.ejs', {info: data}) //we are assigning the data to the cariable info which is used in our EJS file
        //the render is what spits out html from that ejs file 
    })
    .catch(error => console.error(error))
})
// GET Request 

//POST Request
app.post('/addRapper', (request,response) => {
    db.collection('rappers').insertOne({stageName: request.body.stageName,
        birthName: request.body.birthName, likes: 0}) //the items inputted into the form is not the request.body
    // db.collection('rappers).insertOne({zebra: request.body.a, unicorn: request.body.b}) => in out data base we will see zebra: a and unicorn: b
    .then(result =>{
        console.log('Rapper Added')
        response.redirect('/')
    })
})
//POST Request

//DELETE Request

app.delete('/deleteRapper', (request,response) => {
    db.collection('rappers').deleteOne({stageName: request.body.stageNameS})
    .then(result => {
        console.log('Rapper Deleted')
        response.json('Rapper Deleted')
    })
    .catch(error => console.error(error))
})

app.put('/likeRapper', (request, response) => {
    db.collection('rappers').updateOne({stageName: request.body.stageNameS,
        birthName: request.body.birthNameS,likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
        }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})

// app.put('/likeRapper', (request,response) => {
//     db.collection('rappers').updateOne({stageName: request.body.stageNameS,
//         birthName: request.body.birthNameS, likes: request.body.likesS},{
//             $set: {
//                 likes: request.body.likesS + 1 
//             }
//         },{
//             sort: {_id: -1}, // This line says to look in descending order to find the match because there could be multiple properties with the same names 
//             upsert: true // this means if you dont find the match, create a new document that has all this informaion
//         })
//         .then(result => {
//             console.log('Added One Like')
//             response.json('Like Added')
//         })
// })
//This whole section makes up our API

//Setting up the app to listen on the port set on line 5
app.listen(process.env.PORT || PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
//If she up with Heroku we will use whatever port Heroku assigns 

