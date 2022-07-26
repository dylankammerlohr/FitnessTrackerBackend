const client = require("./client");

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

async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {}

async function getAllRoutines() {
  try {
    const {rows : routine} = await client.query(`
    SELECT * 
    FROM routines;
    `)

    // const {rows : user } = await client.query(`
    // SELECT username AS "creatorName" 
    // FROM users
    // JOIN routines ON users.username =  routines."creatorName"
    // ;
    // `, [user.username])

    const {rows: activity} = await client.query(`
    SELECT activities.*
    FROM activities
    JOIN routine_activities ON activities.id = routine_activities."activityId"
    WHERE routine_activities."routineId" = $1 
    `, [routine.id])

    // routine.creatorName = user
    routine.activity = activity
   
    return routine
  } catch (error) {
    console.error("error getting all routines")
    throw error
  }
}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

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
};
