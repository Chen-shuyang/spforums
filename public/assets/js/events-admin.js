/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */

// url
const frontEndUrl = 'https://spforum.herokuapp.com';
const backEndUrl = 'https://spforum-backend.herokuapp.com';

// get item from url
const userData = localStorage.getItem('userInfo');
const tmpToken = JSON.parse(localStorage.getItem('token'));
let searchEventChar = [];
const searchEvent = document.getElementById('eventSearchBox');
let searchEventHostChar = [];

function loadUserProfilePic() {
  const pic = JSON.parse(localStorage.getItem('userImage'));
  document.getElementById('adminName').innerText = JSON.parse(userData);
  if (pic == null) {
    document.getElementById('profilePic').src = 'assets/images/spforumLogo.png';
  } else {
    document.getElementById('profilePic').src = pic;
  }
}

function displayEvents(cardInfo) {
  const card = `
        <tr>
            <th scope="row">${cardInfo.eventID}</th>
            <td>${cardInfo.title}</td>            
            <td>${cardInfo.count}</td>
            <td>${cardInfo.capacity}</td>
            <td>${cardInfo.username}</td>
            <td>${cardInfo.date}</td>
            <td>
            <button class="btn btn-danger" onclick="deleteEvent(${cardInfo.eventID})">Delete</button>
            </td>
        </tr>
    `;

  return card;
}

function allEvents() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/admin/events`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      searchEventChar = data;
      console.log(searchEventChar);

      searchEventHostChar = data;
      console.log(searchEventHostChar);

      $('#msg').html('');
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const event = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            eventID: event.eventid,
            title: event.eventTitle,
            description: event.eventDescription,
            capacity: event.maxCapacity,
            count: event.participantCount,
            username: event.username,
            date: event.date,
          };

          const newCard = displayEvents(cardInfo);

          $('#allEvents').append(newCard);
        }
      } else {
        $('#msg').append('No Posts Found');
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

function selectEventByDate(startDate, endDate) {
  const data = {
    start: startDate,
    end: endDate,
  };

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/events/date`,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    // eslint-disable-next-line no-shadow
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      $('#msg').html('');
      $('#allEvents').html('');

      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const event = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            eventID: event.eventid,
            title: event.eventTitle,
            description: event.eventDescription,
            capacity: event.maxCapacity,
            count: event.participantCount,
            username: event.username,
            date: event.date,
          };

          const newCard = displayEvents(cardInfo);

          $('#allEvents').append(newCard);
        }
      } else {
        $('#msg').append('No Events in this period of time');
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

// eslint-disable-next-line no-unused-vars
function deleteEvent(eventId) {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/events/${eventId}`,
    type: 'DELETE',
    // data: data,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null && data.success) {
        console.log('Question successfully deleted');
        $('#allEvents').html('');
        allEvents();
      }
    },
    // error handling
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      if (xhr.status === 405) {
        window.localStorage.clear();
        window.location.href = 'https://glacial-bastion-56154.herokuapp.com/error';
      } else if (xhr.status === 401) {
        window.localStorage.clear();
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Please log into your own account!',
        }).show();
        window.location.href = 'https://glacial-bastion-56154.herokuapp.com/login';
      }
    },
  });
}

searchEvent.addEventListener('keyup', (e) => {
  const searchString = e.target.value.toLowerCase();

  // eslint-disable-next-line arrow-body-style
  const filterEvent = searchEventChar.filter((event) => {
    return (
      event.eventTitle.toLowerCase().includes(searchString)
      || event.username.toLowerCase().includes(searchString)
    );
  });
  console.log(filterEvent);

  $('#allEvents').html('');
  $('#msg').html('');
  if (filterEvent.length !== 0) {
    for (let i = 0; i < filterEvent.length; i++) {
      const event = filterEvent[i];

      // compile the data that the card needs for its creation
      const cardInfo = {
        eventID: event.eventid,
        title: event.eventTitle,
        description: event.eventDescription,
        capacity: event.maxCapacity,
        count: event.participantCount,
        username: event.username,
        date: event.date,
      };

      const newCard = displayEvents(cardInfo);

      $('#allEvents').append(newCard);
    }
  } else {
    $('#msg').append('No Events Found');
  }
});

$(document).ready(() => {
  loadUserProfilePic();
  allEvents();

  $('#dateFilter').click(() => {
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    if (startDate <= endDate) {
      selectEventByDate(startDate, endDate);
    } else {
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Start date cannot be later than the end date',
      }).show();
    }
  });

  // logout button
  $('#logout').click(() => {
    window.localStorage.clear();
    window.location.assign(`${frontEndUrl}/homepage`);
  });
});

if (userData != null) {
  $('#loginBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#register').attr({ hidden: 'true', disabled: 'true' });
  $('#addqnsbtn').removeAttr('hidden disabled');
  $('#addStorybtn').removeAttr('hidden disabled');
  $('#addEventBtn').removeAttr('hidden disabled');
  $('#profilebtn').removeAttr('hidden disabled');
  $('#joinbtn').removeAttr('hidden disabled');
  $('#logout').removeAttr('hidden disabled');
  $('#welcome').append(`Hello ${userData}`);
} else {
  $('#welcome').append('Welcome Students');
  $('#joinbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#profilebtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addStorybtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addEventBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addqnsbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#logout').attr({ hidden: 'true', disabled: 'true' });
  $('#register').removeAttr('hidden disabled');
  $('#loginBtn').removeAttr('hidden disabled');
}
