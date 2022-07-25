const client = require("./client");
const bcrypt = require("bcrypt")

// database functions

// user functions
async function createUser({ username, password }) {
  // const SALT_COUNT = 10;
  // const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users(username, password)
    VALUES($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING username
    `,
      [username, password]
    );

    return user;
  } catch (error) {
    console.error("Problems creating user..");
    throw error;
  }  


  
}

async function getUser({ username, password }) {
const user = await getUserByUserName(username);
// const hashedPassword = user.password;
// const isValid = await bcrypt.compare(password, hashedPassword);



}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
