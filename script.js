
var source, data, result;

function check_id() {
  var _t_isname = document.getElementById('text_result');
  var _name = document.getElementById('add_fullname').value;
  // получить ID чата по имени пользователя

  if (data) {
    for ( var i = 0; i < data.frequent_contacts.list.length; i++ ) {
      if ( data.frequent_contacts.list[i].name == _name ) {
        _t_isname.innerHTML = "ID чата: " + data.frequent_contacts.list[i].id + " (можно конвертировать)";
        return data.frequent_contacts.list[i].id;
      }
    } 
    _t_isname.innerHTML = "Пользователь не найден";
    return null;
  } else {
    _t_isname.innerHTML = "Сначала выбери файл";
    return null;
  }
}

function check_file() {
  var selectedFile = document.getElementById('inputFile').files[0];
  var reader = new FileReader();

  reader.onload = function (e) {
    source = e.target.result;
    var _t_isfile = document.getElementById('check_file_result');
    // парсинг json из файла-источника (source), результат кладем в объект data
    data = JSON.parse(source);
  
    if (data) {
      _t_isfile.innerHTML = "Файл обработан, формат корректный";
    } else _t_isfile.innerHTML = "Ошибка обработки файла";

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

// ------------- нажатие на кнопку -----------------------------
function download_chat() {
  // берем Имя из поля ввода
  var user_name = document.getElementById('add_fullname').value;
  // проверяяем, что файл загружен, идем парсить
  if (source) id = check_id();
  if (id) download_file( check_id() );
  else document.getElementById('check_file_result').innertHTML = "нужно выбрать файл";
}
// --------------------------------------------------------------