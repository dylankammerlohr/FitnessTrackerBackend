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
    // console.log(routine_activity[4],'eeeee')
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
    // console.log(routine_activity,'ddddddd')
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
      const { rows: routine_activities } = await client.query(`
    DELETE 
    FROM routine_activities
    WHERE id = $1
    RETURNING *;
    `, [id]);
    

    console.log(routine_activities, id, "routineActivity");
    return routine_activities[0];
  } catch (error) {
    console.error("error destroying routineActivity");
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try{
    const {rows: [routine_activity]} = await client.query(`
    SELECT *
    FROM routine_activities 
    JOIN routines ON routine_activities."routineId" = routines.id
    WHERE "creatorId" = ${userId}
    AND routine_activities.id = ${routineActivityId}
    ;
    `)
    // if(routine.creatorId !== userId){
    //   return false
    // } else {
    //   return true
    // }
     console.log(routine_activity, "edit function")
    // if(routine_activity.id === userId){
    //   return true
    // }
    // else{
      return routine_activity
      
    
   
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
