/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable block-scoped-var */
/* eslint-disable no-redeclare */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

const frontEndUrl = 'https://spforum.herokuapp.com';
const backEndUrl = 'https://spforum-backend.herokuapp.com';

function createCard(cardInfo) {
  const card = `
      <div class="col-lg-4 templatemo-item-col all">
      <div class="meeting-item">
        <div class="thumb">
          <a href="/eventDetails?eventID=${cardInfo.eventID}"><img src="assets/images/meeting-01.jpg" alt=""></a>
        </div>
        <div class="down-content">
          <div class="title">
            <span>${cardInfo.eventTitle}</span>
          </div>
          <br><br><p>${cardInfo.eventDescription}</p>
        </div>
      </div>
    </div>
  
                `;

  return card;
}

function displayEventDetails(cardInfo) {
  const card = `

<div class="thumb">
  <div class="createdBy">
    <span>Created by: ${cardInfo.username}</span>
  </div>
  <img src="assets/images/event.jpg" alt="">
</div>
<div class="down-content">
  <h4>${cardInfo.eventTitle} | Current Capacity: ${cardInfo.currentCapacity}/${cardInfo.maxCapacity} </h4></a>
  <p>Event Date & Time Start: ${cardInfo.eventTime}</p>
  <p>Event Duration: ${cardInfo.eventDuration}</p>
  <p>Event created by: ${cardInfo.createdBy}</p>
  <p class="description" id='events'>
  ${cardInfo.eventDescription}
  </p>

  <button type="button" class="btn btn-success" onclick="joinEvent(${cardInfo.eventID})">Join Event</button>

  `;
  return card;
}

function displayEventDetailsGP(cardInfo) {
  const card = `

<div class="thumb">
  <div class="createdBy">
    <span>Created by: ${cardInfo.username}</span>
  </div>
  <img src="assets/images/event.jpg" alt="">
</div>
<div class="down-content">
  <h4>${cardInfo.eventTitle} | Current Capacity: ${cardInfo.currentCapacity}/${cardInfo.maxCapacity} </h4></a>
  <p>Event Date & Time Start: ${cardInfo.eventTime}</p>
  <p>Event Duration: ${cardInfo.eventDuration}</p>
  <p>Event created by: ${cardInfo.createdBy}</p>
  <p class="description" id='events'>
  ${cardInfo.eventDescription}
  </p>

  `;
  return card;
}

// load event
function loadEvent() {
  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/events`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const event = data[i];

        // compile the data that the card needs for its creation
        const cardInfo = {
          eventID: event.eventid,
          eventTitle: event.eventTitle,
          eventDescription: event.eventDescription,
          createdBy: event.username,
        };

        console.log('--------------Card Info Data Pack--------------');
        console.log(cardInfo);

        const newCard = createCard(cardInfo);

        $('#event').append(newCard);
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

function loadEventByID() {
  // extract user details from local storage
  const userData = localStorage.getItem('userInfo');
  console.log(userData);
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------------Query Params ----------------');
  console.log(`QUery Param(source): ${window.location.search}`);
  console.log(`Query parrams(extracted): ${queryParams}`);
  const eventID = queryParams.get('eventID');
  console.log(`Event: ${eventID}`);

  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/event/${eventID}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('back to frontend back with data');
      console.log('---------Response Data ------------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const event = data[i];

        // compile the data that the card needs for its creation
        const eventDetails = {
          eventID: event.eventid,
          eventTitle: event.eventTitle,
          eventDescription: event.eventDescription,
          createdBy: event.username,
          currentCapacity: event.currentCapacity,
          maxCapacity: event.maxCapacity,
          eventTime: event.eventTime,
          eventDuration: event.eventDuration,
        };

        console.log('--------------Card Info Data Pack--------------');
        console.log(eventDetails);

        let newCard;

        if (userData != null) {
          newCard = displayEventDetails(eventDetails);
          $('#eventDetails').append(newCard);
        } else {
          newCard = displayEventDetailsGP(eventDetails);
          $('#eventDetails').append(newCard);
        }
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

function addEvent() {
  // get token
  const tmpToken = JSON.parse(localStorage.getItem('token'));
  // data extraction
  const eventTitle = $('#title').val();
  const eventTime = $('#eventtime').val();
  const eventDuration = $('#eventduration').val();
  const maxCapacity = $('#maxcapacity').val();
  const eventDescription = $('#description').val();
  const userid = localStorage.getItem('userid');

  const data = {
    eventTitle,
    eventTime,
    eventDuration,
    maxCapacity,
    eventDescription,
    userid,
  };

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/newevent`,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus) {
      console.log(textStatus);
      if (data != null) {
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Event added Successfully!',
        }).show();
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Something went wrong! Contact Admin!',
        }).show();
      }
    },
    // errorhandling
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      if (xhr.status === 401) {
        window.localStorage.clear();

        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Please log into your own account!',
        }).show();
        window.location.href = `${frontEndUrl}`;
      }

      if (xhr.status === 403) {
        window.localStorage.clear();
        window.location.href = `${frontEndUrl}/error`;
      }
    },
  });
  window.location.reload();
  return false;
}

// join event
function joinEvent(join_id) {
  // call the web service endpoint
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  const data = {
    userid,
    eventid: join_id,
  };
  console.log(data);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/joinEvent`,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log(data.rowsAffected);

      if (data.rowsAffected === 0) {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'You have joined this Event already',
        }).show();
      } else {
        var data = {
          userid,
          eventid: join_id,
        };

        console.log('--------------Card Info Data Pack--------------');
        console.log(`Data: ${JSON.stringify(data)}`);
        window.location.reload();
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

// unjoin event
function unJoinEvent(unjoin_id) {
  // call the web service endpoint
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  const data = {
    userid,
    eventid: unjoin_id,
  };

  console.log(`DATA: ${JSON.stringify(data)}`);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/unjoinevent`,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log(data.rowsAffected);
      if (data.rowsAffected === 0) {
        console.log(data);
      } else {
        var data = {
          userid,
          eventid: unjoin_id,
        };
        console.log('--------------Card Info Data Pack--------------');
        console.log(`Data: ${JSON.stringify(data)}`);

        window.location.reload();
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

var userid = localStorage.getItem('userid');

$(document).ready(() => {
  loadEvent();
  loadEventByID();

  // add an event
  $('#add').click(() => {
    addEvent();
  });

  // log out
  $('#logout').click(() => {
    window.localStorage.clear();
    window.location.assign('https://glacial-bastion-56154.herokuapp.com/login');
  });
});

const userData = localStorage.getItem('userInfo');

if (userData != null) {
  $('#loginBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#register').attr({ hidden: 'true', disabled: 'true' });
  $('#addcommentbtn').removeAttr('hidden disabled');
  $('#addStorybtn').removeAttr('hidden disabled');
  $('#addEventBtn').removeAttr('hidden disabled');
  $('#profilebtn').removeAttr('hidden disabled');
  $('#joinbtn').removeAttr('hidden disabled');
  $('#logout').removeAttr('hidden disabled');
  $('#welcome').append(`Hello ${userData}`);
} else {
  $('#welcome').append('Welcome Students');
  $('#addcommentbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#joinbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#profilebtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addStorybtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addEventBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#logout').attr({ hidden: 'true', disabled: 'true' });
  $('#register').removeAttr('hidden disabled');
  $('#loginBtn').removeAttr('hidden disabled');
}
