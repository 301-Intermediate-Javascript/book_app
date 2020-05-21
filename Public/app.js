'use strict';
console.log('hello');
$('document').ready(() => {
    let button = $('#showForm');
    let form = $('#form');
    
    form.hide();
    console.log(form);
    button.on('click', function(){
    form.toggle();
    })


})
