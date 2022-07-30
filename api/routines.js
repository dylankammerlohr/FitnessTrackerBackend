const express = require("express");
const {
  UnauthorizedUpdateError,
  UnauthorizedDeleteError,
  DuplicateRoutineActivityError
} = require("../errors");
const {
  getAllRoutines,
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getAllRoutinesByUser,
  getActivityById,
  getRoutineById,
  destroyRoutine,
  destroyRoutineActivity,
  updateActivity,
  addActivityToRoutine,
  getRoutineActivityById,
  getRoutineActivitiesByRoutine,
  getAllActivities,
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
  const { name, isPublic, goal, creatorId } = req.body;

  const data = {};
  try {
    const routId = await getRoutineById(routineId);

    data.isPublic = isPublic;
    data.name = name;
    data.goal = goal;
    data.id = routineId;

    if (routId.creatorId == req.user.id) {
      const updatedActivity = await updateRoutine(data);
      res.send(updatedActivity);
    } else if (routId.creatorId != req.user.id) {
      res.status(403);
      next({
        name: "UnathorizedActivityError",
        message: UnauthorizedUpdateError(req.user.username, routId.name),
        error: "error",
      });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;

  const { name, isPublic, goal, creatorId } = req.body;

  const data = {};
  try {
    const routId = await getRoutineById(routineId);

    if (routId.creatorId == req.user.id) {
      const deletedRout = await destroyRoutine(routineId);
      res.send(deletedRout[0]);
    } else if (routId.creatorId != req.user.id) {
      res.status(403);
      next({
        name: "UnathorizedActivityError",
        message: UnauthorizedDeleteError(req.user.username, routId.name),
        error: "error",
      });
    }
  } catch (error) {
    next(error);
  }
});
// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", requireUser, async (req, res, next) => {
    const {routineId} = req.params
  const { activityId, count, duration } = req.body;

  const data = {};
    const dup = {}
  try {
    data.routineId = routineId
    data.activityId = activityId;
    data.count = count;
    data.duration = duration
    
    const newroutine = await addActivityToRoutine(data);
    console.log(newroutine)
    // if (newroutine.creatorId == req.user.id) {
    //   delete newroutine.id;
   const all = await getRoutineActivityById(routineId)
     if(newroutine) {res.send(newroutine);
     }else if(!newroutine.activityId === all.activityId ){
        dup.routineId = all.activityId;
        dup.activityId = all.activityId;
    next({
      name: "UnauthorizedUserError",
      message: DuplicateRoutineActivityError(dup.routineId, dup.activityId),
      error: "error",
    });}
  } catch (error) {
    next(error);
  }
});

module.exports = router;
