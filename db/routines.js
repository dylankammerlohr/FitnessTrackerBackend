/* eslint-disable no-unused-vars */
const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows : [routine] } = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING "creatorId", "isPublic", name, goal, id;
    `,
      [creatorId, isPublic, name, goal] );
    
    return routine
  } catch (error) {
    console.error("Error creating new routine")
    throw error
  }
}

async function getRoutineById(id) {
  try {
    const { rows: [routine] } = await client.query(`
    SELECT * 
    FROM routines
    WHERE id = $1
    ;
    `,[id]);
    console.log(routine, "routine");
    return routine;
  } catch (error) {
    console.error("error getting all routines");
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routine } = await client.query(`
    SELECT * 
    FROM routines;
    `);
    // console.log(routine, "routine");
    return routine;
  } catch (error) {
    console.error("error getting all routines");
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: routine } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId"=users.id
    ;
    `);
    const activity = await attachActivitiesToRoutines(routine) 
    // console.log(activity,'activities')
    // const {rows: activity} = await client.query(`
    // SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities."routineId",routine_activities."activityId"
    // FROM activities
    // JOIN routine_activities
    // ON activities.id=routine_activities."routineId"
    // ;
    // `)
    routine.activity = activity
    // // routine.activity.map((activity)=>activity.id)
    // // console.log(rows,'activities')
    // routine.activity = activity.map(activity=>activity.id)
    // routine.activities.id = activity[0].id
    // console.log(routine.activities.id,'routine activities')

    // console.log(activity)
    return routine
    
  } catch (error) {
    console.error("error getting all routines")
    throw error
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routine } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId"=users.id
    WHERE routines."isPublic" = true
    ;
    `);
    const activity = await attachActivitiesToRoutines(routine)
    
  
    return routine
    
  } catch (error) {
    console.error("error getting all routines")
    throw error
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routine } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId"=users.id
    WHERE username=$1
    ;
    `,[username]);
    const activity = await attachActivitiesToRoutines(routine);

    return routine;
  } catch (error) {
    console.error("error getting all routines");
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routine } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId"=users.id
    WHERE routines."isPublic" = true AND users.username = $1
    ;
    `,[username]);
    const activity = await attachActivitiesToRoutines(routine);

    return routine;
  } catch (error) {
    console.error("error getting all routines");
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routine } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routines."isPublic" = true
    AND routine_activities."activityId" = $1
    ;
    `, [id]);
  
    
    // let activitys = activity.filter((e)=>activity.id===id)
    

    const activity = await attachActivitiesToRoutines(routine)
    console.log(routine)
    return routine ;
  } catch (error) {
    console.error("error getting all routines");
    throw error;
  }
}
async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");

  if (setString === 0) {
    return;
  }

  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    UPDATE routines
    SET ${setString}
    WHERE id = ${id}
    RETURNING *
    `,
      Object.values(fields)
    );

    return routine;
  } catch (error) {
    console.error("Error updating the Activity");
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId" = $1
    `,[id])
    const { rows } = await client.query(
      `
    DELETE 
    FROM routines
    WHERE id = $1
    RETURNING *
    ;
    `,
      [id]
    );
    console.log(rows,id, "routine");
    return rows;
  } catch (error) {
    console.error("error getting all routines");
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}