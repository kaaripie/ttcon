// @kaaripie release 1.0

var source, data, result; // файл, Json объект, текстовые данные в новом формате

function alert(o_item, s_class, s_message) {
  o_item.className = s_class;
  o_item.innerHTML = s_message;
}

function check_id() {
  let _alert_name = document.getElementById('text_result');
  let _name = document.getElementById('add_fullname').value;
  // получить ID чата по имени пользователя

  if (data) {
    for ( var i = 0; i < data.frequent_contacts.list.length; i++ ) {
      if ( data.frequent_contacts.list[i].name == _name ) {
        alert(_alert_name, "text-primary", "ID чата: " + data.frequent_contacts.list[i].id + " (можно конвертировать)");
        return data.frequent_contacts.list[i].id;
      }
    } 
    alert(_alert_name, "text-danger", "Пользователь не найден");
    return null;
  } else {
    alert(_alert_name, "text-danger", "Сначала выбери файл");
    return null;
  }
}

function check_file() {
  var selectedFile = document.getElementById('inputFile').files[0];
  var reader = new FileReader();

  reader.onload = function (e) {
    source = e.target.result;
    let _alert_file = document.getElementById('check_file_result');
    // парсинг json из файла-источника (source), результат кладем в объект data
    data = JSON.parse(source);
  
    if (data) {
      alert(_alert_file, "text-primary", "Файл обработан, формат корректный");
    } else {
      alert(_alert_file, "text-danger", "Ошибка обработки файла");
    }

  };

  reader.readAsText(selectedFile);
}

function download_file(_l_id) {

    for ( var i = 0; i < data.chats.list.length; i++ ) {
      var _chat_history = data.chats.list[i];
      if ( _chat_history.id == _l_id && _chat_history.messages.length > 0 ) {
        result = "";
        for ( var i = 0; i < _chat_history.messages.length; i++ ) {
          var _l_item = _chat_history.messages[i];
          var date = _l_item.date;
          result += "[" 
                  + date.split("T")[0]
                  + ", "
                  + date.split("T")[1]
                  + "] "
                  + _l_item.from 
                  + ": "
                  +_l_item.text
                  + "\r\n";
        } 
        
        // сохранить в файл и автоматически скачать
        var blob = new Blob([result], {type: "text/plain"});
        var link = document.createElement("a");
        link.setAttribute( "href", URL.createObjectURL(blob) );
        link.setAttribute( "download", "_chat.txt" );
        link.click();
      }
    }
}

// ------------- нажатие на кнопку Скачать -----------------------------
function download_chat() {
  let _alert_file = document.getElementById('check_file_result');
  // проверяяем, что файл загружен, идем парсить
  if (source) {
    id = check_id();
    if (id) download_file( check_id() );
  } else {
    alert(_alert_file, "text-danger", "Выбери файл");

  }
}