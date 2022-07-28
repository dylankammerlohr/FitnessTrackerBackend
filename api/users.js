/* eslint-disable no-useless-catch */
const express = require("express");
const { createUser, getUserByUsername, getPublicRoutinesByUser, getAllRoutinesByUser } = require("../db");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env
const {UserTakenError, PasswordTooShortError, UnauthorizedError} = require('../errors')
const { requireUser } = require('./utils')

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const _user = await getUserByUsername(username)
        if(_user){
            next({
                name: "ErrorUserExists",
                message: UserTakenError(username),
                error: "error",
            })
        }

        if(password.length < 8){
            res.send({
                name: "PasswordLengthError",
                message: PasswordTooShortError(),
                error: "error",
                })
        }

        const user = await createUser({
            username,
            password,
        })

        const token = jwt.sign({
            id: user.id,
            username,
        },
        process.env.JWT_SECRET,
        {expiresIn: "1w"}
        )

        res.send({
            message: "Thank you for registering",
            token,
            user,
        })

    } catch({name, message, error}){
        next({name, message, error})
    }
})

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1w" }
      );
      res.send({ 
        message: "you're logged in!",
        user,
        token,
        });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
})

// GET /api/users/:username/routines
router.get('/:username/routines', requireUser, async (req, res, next) => {
    const user = await getUserByUsername(req.params.username)
    try {
        
        if(req.user.id === user.id){
            const allRoutines = await getAllRoutinesByUser(user)
            console.log(allRoutines, 'bbbbb')
            res.send(allRoutines)
        } 
        else {
            const routines = await getPublicRoutinesByUser(user)
            res.send(routines)
        }
       
        
    } catch(error){
        throw error
    }
})

// GET /api/users/me
router.get('/me', requireUser, async (req, res, next) => {
    const user = await req.user
    res.send(user)
    console.log(req.user, 'aaaa')
    // if(!req.user){
        
    //     res.status(401).send(UnauthorizedError)
    // }
})

module.exports = router;
