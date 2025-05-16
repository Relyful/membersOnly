const pool = require("./pool");

async function setMemTrue(userID) {
  await pool.query(`UPDATE users SET mem_status = $1 WHERE id = $2`, ['t', userID]);
};

async function insertNewMessage(messageData, user) {
  await pool.query(`INSERT INTO messages (title, text, created_by)
      VALUES ($1, $2, $3)`, [messageData.title, messageData.text, user.id]);
};

async function inserNewUser(data, hashedPassword) {
  await pool.query(`INSERT INTO users (fname, sname, username, password) 
    VALUES ($1, $2, $3, $4)`, [data.firstName, data.secondName, data.username, hashedPassword]);
};

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

module.exports = {
  setMemTrue,
  insertNewMessage,
  inserNewUser,
  getAllMessages
}