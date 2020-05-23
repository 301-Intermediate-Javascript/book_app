const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function homeCallBack(request, respond) {
    const sqlQuery = 'SELECT * FROM books'
    client.query(sqlQuery)
      .then(value => {
        respond.render('Pages/index', { 'collection': value.rows })
      }).catch(error => {
  
        respond.render('Pages/errors', { 'errors': error })
  
      })
  }

module.exports = homeCallBack;
  