const superAgent = require('superagent');
function Book(object) {
  this.title = object.title ? object.title : 'Title unknown';
  this.author = object.authors ? object.authors[0] : 'Author unknown';
  if (object.imageLinks.smallThumbnail) {
    if (object.imageLinks.smallThumbnail.split(':')[4] === ":") {
      object.imageLinks.smallThumbnail = object.imageLinks.smallThumbnail.split(':').join('s:')
    }
  }
  this.isbn = object.industryIdentifiers ? `${object.industryIdentifiers[0].type} ${object.industryIdentifiers[0].identifier}` : 'ISBN not Found';
  this.image = object.imageLinks.smallThumbnail ? object.imageLinks.smallThumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
  this.description = object.description ? object.description : 'No description available';

}

function searchesCallBack(request, respond) {
  const bookApiUrl = request.body.Author ? `https://www.googleapis.com/books/v1/volumes?q=inauthor:${request.body.name}`
    : `https://www.googleapis.com/books/v1/volumes?q=intitle:${request.body.name}`;
  superAgent.get(bookApiUrl)
    .then(result => {
      const newBooks = result.body.items.map(value => {

        return new Book(value.volumeInfo);
      })
      respond.render('Pages/searches/shows', { 'books': newBooks })
    }).catch(error => {

      respond.render('Pages/errors', { 'errors': error })

    })
}
module.exports = searchesCallBack;