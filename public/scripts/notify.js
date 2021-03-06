$(document).ready(function () {
  Notify.init();
});

let Notify = {
  init: function () {
    $('#reset').click($.proxy(function(e) {
      e.preventDefault();
      
      this.reset();
    }, this));
    
    $('form').submit($.proxy(function(e) {
      if (this.isEmptyMessage()) {
        e.preventDefault();

        this.displayError();
      }
    }, this));
  },

  displayError: function() {
    $('#validation_message').html('Please input a message');
  },

  isEmptyMessage: function() {
    return $('textarea[name=message]').val() === '';
  },

  reset: function () {
    $('textarea[name=message]').val('');
    $('#validation_message').text('');    
  },
};

