  // ----------- парсинг json ---------------- //
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

function get_id(id, user_name) {
  var _l_name = document.getElementById(user_name).value;
    
  //список имен моих контактов
  for (var i = 0; i < data.frequent_contacts.list.length; i++) {
    if (_l_name == data.frequent_contacts.list[i].name )
      alert( "ID пользователя: " + data.frequent_contacts.list[i].id );
    else alert("нет такого пользователя, скопируй имя из чата")
  }
}

function count_messages(id, user_id) {
  var _l_id = document.getElementById(user_id).value;

  // количество сообщений  
  for (var i = 0; i < data.chats.list.length; i++) {
    if (data.chats.list[i].name == _l_name || data.chats.list[i].id == _l_id)
      alert ( "В чате с " + _l_name + " " + data.chats.list[i].messages.length + "сообщений" );
  }
}