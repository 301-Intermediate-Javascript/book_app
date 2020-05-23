const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function booksCallBack(request, respond) {
  // console.log(request.params);
  const sqlShelf = 'SELECT DISTINCT bookshelf FROM books';
  client.query(sqlShelf)
    .then(shelfData => {
      const sqlQuery = `SELECT * FROM books WHERE id=$1`;
      const sqlValue = [request.params.id];
      client.query(sqlQuery, sqlValue)
        .then(value => {
          if (request.query.displayUpdate) {
            respond.render('Pages/books/show', { 'book': value.rows[0], displayButton: true, 'shelf': shelfData.rows })

          }else {
            respond.render('Pages/books/show', { 'book': value.rows[0], displayButton: false, 'shelf': shelfData.rows })
          }
        }).catch(error => {

          respond.render('Pages/errors', { 'errors': error })

        })
    })
}

module.exports = booksCallBack;
