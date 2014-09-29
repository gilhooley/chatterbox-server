server = 'https://api.parse.com/1/classes/chatterbox';

var Message = Backbone.Model.extend({
  initialize: function(){

  },
  send: function(){
    $.ajax({
      // always use this url
      url: server,
      type: 'POST',
      data: JSON.stringify(this.attributes),
      contentType: 'application/json',
      success: function (data) {
        console.log("message sent successfully");
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  }
});

var MessageView = Backbone.View.extend({
  initialize: function() {
    this.template= _.template($('#message_view').html());
  },

  render: function() {
    return this.$el.html(this.template(this.model.attributes))s;
    // var html =
    // '<p>' +
    // '<button class=\"username\">' +
    // this.model.get('username') +
    // '</button>: ' +
    // this.model.get('text') +
    // '</p>'
    // return this.$el.html(html);
  }
});




$(document).ready(function() {
  var m = new Message({username:'felipe', text:'hello', roomname:'lobby'});
  var mv = new MessageView({model: m});
  $('#chats').append(mv.render());// + mv.render());

});


