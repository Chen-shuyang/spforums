/* eslint-disable linebreak-style */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-shadow */
/* eslint-disable no-alert */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */
const username = localStorage.getItem('userInfo');

let finalString = '';

$(document).ready(() => {
  if (username != null) {
    finalString = username.replaceAll('"', '');
  } else {
    document.getElementById('exampleModal').style.display = 'flex';
  }
  $('#username').val(finalString);
});
