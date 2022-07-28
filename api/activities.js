const { Router } = require('express');
const express = require('express');
const { getAllActivities, getPublicRoutinesByActivity } = require('../db');
const router = express.Router();
router.use((req, res, next)=>{
    console.log("A request is being made to /api/activities")
    next()
})
// GET /api/activities/:activityId/routines
// router.get("/:activityId/routines", async (req, res)=>{
//     try {
//         const actIdRoutines = getPublicRoutinesByActivity()

//     } catch (error) {
//         console.error('error getting /activities/:activityId/routines')
//         throw error
//     }
// })
// GET /api/activities
router.get("/", async (req, res) =>{
    try{
        const response = await getAllActivities()
        // let activities =  await allActivities.filter(activity=>{
        //     return activity.isPublic === true
        // })
        
        // console.log()
        res.send(response)
        // return response
    }catch(error){
     console.error('error getting activities/')
     throw error   
    }
});
// // POST /api/activities
// router.post("/api/activities");
// // PATCH /api/activities/:activityId
// router.get("/api/activities/:activityId");
module.exports = router;
