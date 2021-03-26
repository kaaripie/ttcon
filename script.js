  // ----------- парсинг json, результат кладем в объект data ---------------- //
  let data;

  var source = $.getJSON( "/result.json", function() {
    console.log( "getJSON" );
  })
      .done(function(imported) {
        //console.log( "success" );
        data = imported;
      })
      .fail(function() {
        alert( "error" );
      })
      .always(function() {
        //console.log( "complete" );
      });
// ----------

function get_user_id(in_name) {
  //список имен моих контактов
  for ( var i = 0; i < data.frequent_contacts.list.length; i++ ) {
    if ( data.frequent_contacts.list[i].name == in_name ) {
      return data.frequent_contacts.list[i].id;
    } else {
      alert( "нет такого пользователя" );
      return null;
    }
  }
}

function count_messages(id, user_name) {
  var _l_name = document.getElementById(user_name).value;
  var _l_id = get_user_id(_l_name);

  // количество сообщений  
  if (_l_id)
  for ( var i = 0; i < data.chats.list.length; i++ ) {
    if ( data.chats.list[i].id == _l_id ) {
      alert ( "В чате с " + _l_name + " " + data.chats.list[i].messages.length + "сообщений" );
    }
  }
}