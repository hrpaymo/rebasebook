const { Client } = require('pg');
const config = require('../process.env');
console.log('Initializing client');
const client = new Client({
  connectionString: 'postgres://postgres@localhost:5432/fb_database' || config.DATABASE_URL,
  ssl: true
});

client.connect();
console.log('Connected!');
module.exports = {
  getAllUsers: (callback) => {
    client.query('SELECT * FROM users;', (err, res) => {
      if (err) callback(err, null);
      callback(null, res.rows);
      // for (let row of res.rows) {
      //   console.log(JSON.stringify(row));
      // }
      // client.end();
    });
  },
  createPost: (username, text, callback) => {
    console.log('This is my client', client);
    let queryStr =
      `INSERT INTO posts (post_text, user_id) 
      VALUES ('${text}', (SELECT id FROM users WHERE username = '${username}'))`;
    console.log('This is my query string', queryStr);
    client.query(queryStr, (err, res) => {
      if (err) {
        console.log('Error', err);
        callback(err, null);
      } else {
        console.log('Posting!');
        callback(null, res.rows);
      }
    });
  },
  getAllPosts: (callback) => {
    let queryStr = 'SELECT posts.*, users.first_name, users.last_name FROM posts INNER JOIN users ON users.id = posts.user_id ORDER BY id DESC';
    console.log(queryStr);
    client.query(queryStr, (err, res) => {
      if (err) {
        console.log('Error', err);
        callback(err, null);
      } else {
        console.log('Got all posts!!!!');
        callback(null, res.rows);
      }
    });
  }
}