const express = require('express');
// const cors = require("cors");
const router = express.Router();

// GET /api/health


router.get('/health', (req, res, next) => {
    try {
        // console.log(req.body.message)
        let response = 'fff';
        // response.body.message = 'response'
        // res.body.message= response
        // console.log(res)
        res.status(200).send((response))
        
        // next()
  
    } catch (error) {
        console.error
        throw error
        
    }
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);



// router.get("/:unknown", async(req,res)=>{
//     await res.status(404).send("Not a valid url")
// })
module.exports = router;
