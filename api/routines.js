const express = require('express');
const { response } = require('../app');
const { getAllRoutines, getAllPublicRoutines, createRoutine } = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

router.use((req, res, next) => {
  console.log("A request is being made to /routines");

  next();
});
// GET /api/routines
router.get("/", async (req, res, next) => {
    try {
       const allroutines = await getAllPublicRoutines()
       console.log(allroutines)
        

        res.send(allroutines)
     } catch(message){
        next()
    }
})



// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  console.log(req.body);

  const data = {};

  //   try {
  data.isPublic = isPublic;
  data.name = name;
  data.goal = goal;
  // data.creatorId = req.user.id
  const newroutine = await createRoutine(data);
    // delete newroutine.id
    delete newroutine.creatorName
 
  console.log(newroutine, "sss");
  if(newroutine.creatorId == req.user.id){
  res.send( newroutine );
}
  //   next({
  //     name: "UnauthorizedUserError",
  //     message: "You cannot update a post that is not yours",
  //   });
  // }
  //   } catch ({ name, message }) {
  //     next({ name, message });
  //   }
});

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
