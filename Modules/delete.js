const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function deleteBook(req, res) {
  const sql = `DELETE FROM books WHERE ID=${req.params.id}`;
  client.query(sql)
    .then(() => {
      res.redirect('/')
    })
}

module.exports = deleteBook;
