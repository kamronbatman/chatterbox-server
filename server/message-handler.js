var _ = require("underscore");

var genId = function() {
  return (60466176 + Math.floor(Math.random() * 2116316160)).toString(36).toUpperCase();
}

var messages = [];

messages.push({username: 'test',
      roomname: 'lobby',
      text: 'Hi World!', objectId: genId(),
      createdAt: new Date() });

module.exports = {
  addMessage: function(str) {
    var input = JSON.parse(str);

    var newObj = {username: input.username,
      roomname: input.roomname,
      text: input.text, objectId: genId(),
      createdAt: new Date() };

    messages.unshift(newObj);

    return newObj;
  },

  getMessages: function() {
    return messages;
    //return messages.slice(0,100);
  }
};
