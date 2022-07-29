const { Router } = require('express');
const express = require('express');
const { reset } = require('nodemon');
const { getAllActivities, getPublicRoutinesByActivity, createActivity, getActivityById, updateActivity, getActivityByName } = require('../db');
const { ActivityExistsError, UnauthorizedError, ActivityNotFoundError } = require('../errors');
const { requireUser } = require('./utils');
const router = express.Router();

router.use((req, res, next)=>{
    console.log("A request is being made to /api/activities")
    next()
})

// GET /api/activities
router.get("/", async (req, res) =>{
    try{
        const response = await getAllActivities()
    
        res.send(response)
       
    }catch(error){
     console.error('error getting activities/')
     throw error   
    }
});

// // POST /api/activities
router.post('/', requireUser, async (req, res, next) => {
    const { name, description } = req.body
    const activityData = {}
    try {
        activityData.id = req.user.id
        activityData.name = name
        activityData.description = description 
        
        const activity = await createActivity(activityData)
        
        if(activity){
            res.send(activity)
        } else {
            next({
                name: "ActivityError",
                message: ActivityExistsError(name),
                error: "error"
            })
        }
    } catch ({name, message}){
        next({name, message})
    }
})

// router.post("/api/activities");

// // PATCH /api/activities/:activityId
router.patch('/:activityId', requireUser, async (req, res, next) => {
    const {activityId} = req.params
    const { name, description } = req.body
    
    const newActivityData = {}

    const noActivity = await getActivityById(activityId)
    if(!noActivity){
        res.send({
            error: "error",
            message: ActivityNotFoundError(activityId),
            name: "ActivityNotFoundError"
        })
    }

    const activityName = await getActivityByName(name)
    if(activityName){
        res.send({
            name: "ActivityExistsError",
            message: ActivityExistsError(name),
            error: "error",
        })
    }

    try {
        newActivityData.name = name
        newActivityData.description = description
        newActivityData.id = req.params.activityId
   
        if (req.user){
            const updatedActivity = await updateActivity(newActivityData)
            res.send(updatedActivity)
        } 
        else {
            next({
                name:"UnathorizedActivityError",
                message: UnauthorizedError(),
                error: "error"
            })
        }
    } catch ({name, message, error}) {
        next({name, message, error})
    }
})

// GET /api/activities/:activityId/routines
// router.get("/:activityId/routines", async (req, res, next) => {
//     const { activityId } = req.params
    
//     try {
//         const actIdRoutines = await getPublicRoutinesByActivity(activityId)
//         console.log(actIdRoutines, 'aaa')

//     } catch ({name, message, error}) {
//         next({name, message, error})
//     }
// })

router.get('/:activityId/routines', async (req, res, next) => {
    
})

module.exports = router;
