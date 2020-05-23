const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function books(request, respond) {
  const sqlQuery = 'INSERT INTO books (title, author, isbn, description, image, bookshelf) VALUES($1, $2, $3, $4, $5, $6) RETURNING id';
  const sqlValues = [request.body.title, request.body.author, request.body.isbn, request.body.description,
    request.body.image, 1];
  client.query(sqlQuery, sqlValues)
    .then(result => {
      respond.redirect('/books/' + result.rows[0].id + '?displayUpdate=true');
    })
}

module.exports = books;
