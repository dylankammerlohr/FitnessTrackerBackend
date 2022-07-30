const express = require("express");
const {UnauthorizedUpdateError} = require('../errors')
const {
  getAllRoutines,
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getAllRoutinesByUser,
  getActivityById,
  getRoutineById,
} = require("../db");
const { requireUser } = require("./utils");
const router = express.Router();

router.use((req, res, next) => {
  console.log("A request is being made to /routines");

  next();
});
// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const allroutines = await getAllPublicRoutines();

    res.send(allroutines);
  } catch (message) {
    next();
  }
});

// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal, creatorId } = req.body;

  const data = {};

  try {
    data.isPublic = isPublic;
    data.name = name;
    data.goal = goal;
    data.creatorId = req.user.id;
    const newroutine = await createRoutine(data);

    if (newroutine.creatorId == req.user.id) {
      delete newroutine.id;
      res.send(newroutine);
    }
    next({
      name: "UnauthorizedUserError",
      message: "You cannot update a post that is not yours",
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
//   const isUsersRoutine = await getAllRoutinesByUser(req.user);
//   console.log(isUsersRoutine);
  const { name, isPublic, goal, creatorId } = req.body;

  const data = {};
  try {
    // const noActivity = await getActivityById(activityId);
    // if (!noActivity) {
    //   res.send({
    //     error: "error",
    //     message: ActivityNotFoundError(activityId),
    //     name: "ActivityNotFoundError",
    //   });
    // }
    const routId = await getRoutineById(routineId)
    console.log(routId,'dddd')

    data.isPublic = isPublic;
    data.name = name;
    data.goal = goal;
    data.id = routineId;

    if (routId[0].creatorId == req.user.id) {
      const updatedActivity = await updateRoutine(data);
      res.send(updatedActivity);
    } else if(routId.creatorId != req.user.id){
       res.status(403)
      next({ 
        name: "UnathorizedActivityError",
        message: UnauthorizedUpdateError(req.user.username, routId[0].name),
        error: "error",
      });
       
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
