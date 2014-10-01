// YOUR CODE HERE:

var app = {

  init:function(){

    var context = this;
    $('.username').on('click', function() {
      context.addFriend();
    });
    $('.submit').on('click', function() {
      context.handleSubmit();
    });
    $( "select" ).change(function () {
      $( "select option:selected" ).each(function() {
        console.log(this);
        context.selected = sanitizer.removeTags(this.val());
    });
  })
  //.ch
    this.addRoom('lobby');
    //this.fetch();
    setInterval(function(){ context.fetch();}, 1000);
  },

  server: 'http://127.0.0.1:3000/classes/messages',
// 'https://api.parse.com/1/classes/chatterbox'
//
  selected: 'lobby',

  fetch:function(){
    $.ajax({
      // always use this url
      url: this.server,
      type: 'GET',
      //data:{
        //order:'-createdAt'
      // },
      contentType: 'application/json',
      success: function (data) {
        app.appendMessages(data.results);
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
  },

  handleSubmit:function(){
    var msg = {};
    msg.username = sanitizer.removeTags(window.location.search.substring(10));
    msg.text =  sanitizer.removeTags($('#message').val());
    $('#message').val('');
    msg.roomname = 'lobby';
    this.send(msg);
    //console.log(JSON.stringify(msg));
  },

  send:function(msg){
    $.ajax({
      // always use this url
      url: this.server + '/send',
      type: 'POST',
      data: JSON.stringify(msg),
      contentType: 'application/json',
      success: function (data) {
        console.log("message sent successfully");
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });

  },

  addMessage:function(msg) {
    if (msg.roomname === this.selected || this.selected === 'lobby') {
      var msg = JSON.parse(sanitizer.removeTags(JSON.stringify(msg)));
      this.addRoom(msg.roomname);
      var out = '';
      out += '<button class=\"username\">' + msg.username + '</button>: ';
      out += msg.text;
      $('#chats').append('<p>' + out + '</p>');
    }
  },

  rooms: [],
  friends: {},

   addFriend: function() {

   },

  addRoom:function(roomName) {
    if (! _.contains(this.rooms, roomName)) {
      $('#roomSelect').append('<option value=\"'+ roomName + '\">'+ roomName + '</option>');
      this.rooms.push(roomName);
    }
  },

  appendMessages:function(messageArray) {
    this.clearMessages();
    //console.log(messageArray);
    for (var i = 0; i < messageArray.length; i++) {
      this.addMessage(messageArray[i]);
    }

  },
  clearMessages:function(){
    $('#chats').children().remove();
  }

}

var sanitizer = {

  tagBody : '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*',

  tagOrComment: new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + this.tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + this.tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + this.tagBody
    + ')>',
    'gi'),

  removeTags: function (html) {
    var oldHtml;
    do {
      oldHtml = html;
      html = html.replace(this.tagOrComment, '');
    } while (html !== oldHtml);
    return html.replace(/</g, '&lt;');
  }
}

$(document).ready(function() {
  app.init();
})
//app.send({username:'seb',roomname:'any', text:'<img src=\"http://theangrydead.com/misc/db.jpg\">'});


