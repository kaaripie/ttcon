  // ----------- парсинг json, результат кладем в объект data ---------------- //
var data;
var src = $.getJSON( "/result.json", function() {
    console.log( "getJSON" );
})
    .done(function(json_obj) {
      data = json_obj;
      //console.log( "success" );
    })
    .fail(function() {
      alert( "error" );
    })
    .always(function() {
      //console.log( "complete" );
    });
// -----------------------------------------------------------------------------//

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

  // показать количество сообщений
  if (_l_id)
  for ( var i = 0; i < data.chats.list.length; i++ ) {
    if ( data.chats.list[i].id == _l_id ) {
      alert ( "В чате " + data.chats.list[i].messages.length + " сообщений\r\n\r" + "ID чата: " + _l_id);
    }
  }
}

function download_chat(id, user_name) {
  var _l_name = document.getElementById(user_name).value;
  var _l_id = get_user_id(_l_name);

  // выгрузить все сообщения в консоль
  if (_l_id)
  var msgs = chats.list.id[_l_id].messages;

  for ( var i = 0; i < all_messages.length; i++ ) {
      var _l_item = msgs[i];
      console.log ( "[" + _l_item.date.replase("T", ", ") + "]" + _l_item.from + ": " +_l_item.text );
  }
}