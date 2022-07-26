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
    const {rows : [routine]} = await client.query(`
    SELECT * FROM routines
    JOIN users ON username = "creatorName"
    JOIN activities ON 
    ;
    `)
    const {rows: [user]} = await client.query(`
    SELECT username 
    FROM users
    JOIN ;
    `)
    const {rows : [activity]} = await client.query(`
    SELECT "routineId",  
    FROM activities;
    `)

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
