const express = require('express');
const { getRoutineActivityById, updateRoutineActivity, getRoutineById } = require('../db');
const { UnauthorizedUpdateError } = require('../errors');
const { requireUser } = require('./utils');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async (req, res, next)=>{
 const { routineActivityId } = req.params;
  const { routineId, activityId, duration, count, id } = req.body;

  const data = {};
  try {
    const routId = await getRoutineActivityById(routineActivityId);
    const name = await getRoutineById(routId.routineId)

    data.duration = duration;
    data.count = count;
    data.id = routId.id;
    console.log(name, 'name',data, 'ddata')
    
    if (name.creatorId == req.user.id) {
      const updatedActivity = await updateRoutineActivity(data);
      res.send(updatedActivity);
    } else if (routId.creatorId != req.user.id) {
      res.status(403);
      next({
        name: "UnathorizedActivityError",
        message: UnauthorizedUpdateError(req.user.username, name.name),
        error: "error",
      });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routine_activities/:routineActivityId

module.exports = router;
