  // ----------- парсинг json, результат кладем в объект data ---------------- //
var data;
var result;

var source = $.getJSON( "/result.json", function() {
    console.log( "gotJSON" );
})
    .done(function(json) {
      data = json;
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
  // получить ID чата по имени пользователя
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
  // получить информацию о чате (есть/нет, сколько сообщений, ID чата)
  var _l_name = document.getElementById(user_name).value;
  var _l_id = get_user_id(_l_name);

  if ( _l_id ) {
    for ( var i = 0; i < data.chats.list.length; i++ ) {
      if ( data.chats.list[i].id == _l_id ) {
        alert ( "В чате " + data.chats.list[i].messages.length + " сообщений\r\n\r" + "ID чата: " + _l_id);
      }
    }
  }
}

function download_chat(id, user_name) {
  // выгрузить все сообщения в консоль
  var _l_name = document.getElementById(user_name).value;
  var _l_id = get_user_id(_l_name);

  if ( _l_id ) {
    for ( var i = 0; i < data.chats.list.length; i++ ) {
      var _chat_history = data.chats.list[i];
      if ( _chat_history.id == _l_id && _chat_history.messages.length > 0 ) {
        result = "";
        for ( var i = 0; i < _chat_history.messages.length; i++ ) {
          var _l_item = _chat_history.messages[i];
          var date = _l_item.date;
          result += "[" + date.split("T")[0] + ", " + date.split("T")[1] + "] " + _l_item.from + ": " +_l_item.text + "\r\n";
        } 
        
        // сохранить в файл и автоматически скачать
        var blob = new Blob([result], {type: "text/plain"});
        var link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", "_chat.txt");
        link.click();

        break;
      }
    }
  }
}

