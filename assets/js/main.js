/**
 * Global variables
 *
 * @author Jonathan Path
 */

// CREATE ELEMENT
// var newEl = document.createElement('div');

// GET ATTRIBUTE
// document.querySelector('.el').setAttribute('key', 'value');
// document.querySelector('.el').getAttribute('key');

// ADD/REMOVE/TOGGLE CLASS
// document.querySelector('.el').classList.add('class');
// document.querySelector('.el').classList.remove('class');
// document.querySelector('.el').classList.toggle('class');

// REMOVE
// remove('.el');

// function remove(el) {
//   var toRemove = document.querySelector(el);

//   toRemove.parentNode.removeChild(toRemove);
// }

// PARENT
// document.querySelector('.el').parentNode;

// PREV/NEXT ELEMENT
// document.querySelector('.el').previousElementSibling;
// document.querySelector('.el').nextElementSibling;

// Remove NavBar from iOS
if( !window.location.hash && window.addEventListener ){
    window.addEventListener( "load",function() {
        setTimeout(function(){
            window.scrollTo(0, 0);
        }, 0);
    });
    window.addEventListener( "orientationchange",function() {
        setTimeout(function(){
            window.scrollTo(0, 0);
        }, 0);
    });
}

// $(function(){
    console.info('main.js Loaded');
// });