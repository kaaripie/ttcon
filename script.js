var input_val;

function add_del(id, user_name, user_id) {
  var _l_id = document.getElementById(user_id).value;
  var _l_name = document.getElementById(user_name).value;
  // ----------- рабочий парсинг списка контактов ---------------- //
  var source = $.getJSON( "/result.json", function() {
      console.log( "getJSON" );
    })
      .done(function() {
        //console.log( "success" );
      })
      .fail(function() {
        alert( "error" );
      })
      .always(function() {
        //console.log( "complete" );
      });
  // ----------
    
  source.done(function(data) {
        //console.log( "processing" );
        /*
        //список имен фамилий моих контактов
        for (var i = 0; i < data.contacts.list.length; i++) {
          console.log( data.contacts.list[i].last_name + " " + data.contacts.list[i].last_name );
        }
        */
        // число сообщений от контакта по клику на кнопку "отправить"
        for (var i = 0; i < data.chats.list.length; i++) {
          if (data.chats.list[i].name == _l_name || data.chats.list[i].id == _l_id)
            console.log( data.chats.list[i].messages.length );
        }
  });
  return true;
}