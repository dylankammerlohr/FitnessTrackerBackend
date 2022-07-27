const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [routine_activity]} = await client.query(`
    INSERT INTO routine_activities ("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING "routineId", "activityId", count, duration, id;
    `, [routineId, activityId, count, duration])

    return routine_activity
  } catch (error){
    console.error("error with addActivityToRoutine")
    throw error
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [routine_activity] } = await client.query(`
    SELECT * 
    FROM routine_activities
    WHERE id = $1
    ;
    `,[id]);
    
    return routine_activity;
  } catch (error) {
    console.error("error getting all routines");
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routine_activity } = await client.query(`
    SELECT * 
    FROM routine_activities
    WHERE "routineId" = $1
    ;
    `,[id]);
    
    return routine_activity;
  } catch (error) {
    console.error("error getting all routines");
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
  .map((key, index)=> `"${key}"=$${index + 1}`).join(",")

  if (setString === 0){
    return
  }

  try {
    const {rows : [routine_activity] } = await client.query(`
    UPDATE routine_activities
    SET ${setString}
    WHERE id = ${id}
    RETURNING *
    `, Object.values(fields))

    return routine_activity
  } catch (error) {
    console.error("Error updating the routineActivity")
    throw error
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows } = await client.query(`
    DELETE  
    FROM routine_activities
    WHERE id = $1;
    `, [id]);

    console.log(rows, id, "routineActivity");
    return rows;
  } catch (error) {
    console.error("error destroying routineActivity");
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try{
    const {rows: [routine]} = await client.query(`
    SELECT *
    FROM routines
    WHERE "creatorId" = ${userId}
    `)
    // if(routine.creatorId !== userId){
    //   return false
    // } else {
    //   return true
    // }
    console.log(routine, "edit function")
    return routine
  } catch (error){
    console.error("Error with canEditRoutineActivity")
    throw error
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
