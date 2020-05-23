const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function updateCallback(request, respond) {
  let sql = `
      UPDATE books
      SET title=$1, description=$2, author=$3, image=$4, isbn=$5, bookshelf=$7
      WHERE id=$6
      `;
  const values = [request.body.title, request.body.description, request.body.author, request.body.image, request.body.isbn, request.params.id, request.body.newBookShelf];
  client.query(sql, values)
    .then(() => {
      sql = `SELECT bookshelf FROM books WHERE id=${request.params.id}`;
      client.query(sql)
        .then(() => {
          respond.redirect(`/books/${request.params.id}`)

        })
    })
}

module.exports = updateCallback;
