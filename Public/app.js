'use strict';
console.log('hello');

$('document').ready(() => {

  let button = $('#showForm');
  let form = $('#form');
  let button2 = $('#update')

  form.hide();
  console.log(form);
  button.on('click', function () {
  $('#bookInfo').toggle();
    form.toggle();
  })
  button2.on('click', function () {
    $('#bookInfo').toggle();
      form.toggle();
    })
})
$.get('/books/:id', renderOptions)


