import express from 'express';
import bodyParser from "body-parser";
import bcrypt from 'bcrypt';
import cors from 'cors';
// import { use } from 'express/lib/application';
import knex from 'knex';
import { response } from 'express';
import { use } from 'bcrypt/promises.js';
import image from './controllers/image.js ';

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '18harsh18',
      database : 'smart_brain'
    }
  }); 

    // db.select().from('users').then(data => {
    //     console.log(data);
    // });
const app = express();

app.use(bodyParser.json());

app.use(cors())

// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'john',
//             email: 'john@gmail.com',
//             pass: 'cookies',
//             entries: 0,
//             joined:  new Date()
//         },
//         {
//             id: '124',
//             name: 'sally',
//             email: 'sally@gmail.com',
//             pass: 'banana',
//             entries: 0,
//             joined:  new Date()
//         }
//     ],
//     login: [
//         {
//             "id":"123",

//         }
//     ]
// }

app.get('/' , (req,res) => {
    res.send('!success!');
})


app.post('/signin', (req,res)=> {
    const {email, pass} = req.body;
    if (!email || !pass){
        return res.status(400).json("incorrect form submission");
    }
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(pass , data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
    // if (req.body.email === database.users[0].email && 
    //     req.body.pass === database.users[0].pass){
    //         res.json(database.users[0]);
    //     }
    // else {
    //     res.status(400).json('error loggin in');
    // }
})

const saltRounds = 10;

app.post('/register',(req,res) => {
    // bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    //     // result == true
    // });
    // bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    //     // result == false
    // });

    const { email, name, pass} = req.body;
    if (!email || !name || !pass){
        return res.status(400).json("incorrect form submission");
    }
    const hash = bcrypt.hashSync(pass, saltRounds);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail =>{
                return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                }).then(user =>{
                    res.json(user[0])
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        // return db('users')
        // .returning('*')
        // .insert({
        //     email: email,
        //     name: name,
        //     joined: new Date()
        // }).then(user =>{
        //     res.json(user[0])
        // })
    .catch(err => res.status(400).json("unable to register!!"))
    // bcrypt.hash(pass, saltRounds, function(err, hash) {
    //     console.log(hash);
    // });

    // database.users.push(  {
    //     id: '125',
    //     name: name,
    //     email: email,
    //     // pass: pass,
    //     entries: 0,
    //     joined:  new Date()
    // })
    // res.json(database.users[database.users.length-1])
})


app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    // let found = false; 
    db.select("*").from('users').where({id: id })
    .then(user => {
        if(user.length){
            res.json(user[0])
        } else{
            res.status(400).json("not found")
        } 
        // console.log(user);
    }).catch(err =>res.status(400).json("error getting user"))
    // database.users.forEach(users => {
    //     if(users.id === id){
    //         found = true;
    //         res.json(users);
    //     }
    // })
    // if(!found){
    //     res.status(400).json("galat haiu");
    // }
})



app.put('/image', (req,res) => {image.handleImahe(req,res,db)}) 
app.post('/imageurl', (req,res) => {image.handelApicall(req,res)}) 

//     let found = false;
//     database.users.forEach(user => {
//         if(user.id === id){
//             found = true;
//             user.entries++;
//             return res.json(user.entries);
//         }
//     }) 
//     if(!found){
//         res.status(400).json("galat hau");
//     }
// })


// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });
    
app.listen(3001);

// const express = require('express')

// import { createServer } from 'http';


// const server = createServer((request, response) => {
//     const user = {
//         name: 'John',
//         hobby: 'gym' 
//     }
//     response.setHeader('Content-Type', 'application/json');
//     response.end(JSON.stringify(user));
// })
// // const server = createServer((request, response) => {
// //     response.setHeader('Content-Type', 'text/html');
// //     response.end('<h1>Helloooo</h1>');
// // })

// server.listen(3001 );  