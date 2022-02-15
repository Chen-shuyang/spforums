/* eslint-disable linebreak-style */
const moment = require('moment-timezone');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().tz('Asia/Singapore').format('h:mm a'),
  };
}

module.exports = formatMessage;
