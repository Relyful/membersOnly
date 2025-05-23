const pool = require("./pool");

async function setMemTrue(userID) {
  await pool.query(`UPDATE users SET mem_status = $1 WHERE id = $2`, ['t', userID]);
};

async function insertNewMessage(messageData, user) {
  await pool.query(`INSERT INTO messages (title, text, created_by)
      VALUES ($1, $2, $3)`, [messageData.title, messageData.text, user.id]);
};

async function inserNewUser(data, hashedPassword) {
  return await pool.query(`INSERT INTO users (fname, sname, username, password) 
    VALUES ($1, $2, $3, $4) RETURNING id`, [data.firstName, data.secondName, data.username, hashedPassword]);
};

async function getAllMessages() {
  const { rows } = await pool.query("SELECT messages.*, users.username FROM messages LEFT JOIN users ON messages.created_by = users.id");
  return rows;
};

async function setAdmin(userID) {
  await pool.query(`UPDATE users SET admin_status = TRUE, mem_status = TRUE WHERE id = $1`, [userID]);
};

async function deleteMessage(messageID) {
  await pool.query(`DELETE FROM messages WHERE id = $1`, [messageID]);
};

module.exports = {
  setMemTrue,
  insertNewMessage,
  inserNewUser,
  getAllMessages,
  setAdmin,
  deleteMessage
}