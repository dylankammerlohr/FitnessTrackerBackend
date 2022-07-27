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

async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routine } = await client.query(`
    SELECT * 
    FROM routines;
    `);
    console.log(routine, "routine");
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
    // // routine.activity.map((activity)=>activity.id)
    // // console.log(rows,'activities')
    // routine.activity = activity.map(activity=>activity.id)
    // routine.activities.id = activity[0].id
    // console.log(routine.activities.id,'routine activities')

    console.log(activity)
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
