// @kaaripie release 1.0

let source, data;
let result = ""; // файл, Json объект, текстовые данные в новом формате

function alert(o_item, s_class, s_message) {
  o_item.className = s_class;
  o_item.innerHTML = s_message;
}

function hide_id_forms(hide) {
  let _do = hide ? 'hidden' : 'visible';

  let _req_text = document.getElementById('text_request_id');
  let _input_text = document.getElementById('add_fullname');
  let _idresult_text = document.getElementById('text_result'); 
  let _id_req_btn = document.getElementById('button_request_id');

  _req_text.style.visibility = _do;
  _input_text.style.visibility = _do;
  _idresult_text.style.visibility = _do;
  _id_req_btn.style.visibility = _do;
}

function check_id() {
  let _alert_name = document.getElementById('text_result');
  let _name = document.getElementById('add_fullname').value;
  // получить ID чата по имени пользователя
  let _contact_list = data.frequent_contacts;

  if (data && _contact_list) {
    for ( var i = 0; i < data.frequent_contacts.list.length; i++ ) {
      if ( data.frequent_contacts.list[i].name == _name ) {
        alert(_alert_name, "text-primary", "ID чата: " + data.frequent_contacts.list[i].id);
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
      if (data.chats) {
        hide_id_forms(false);
        alert(_alert_file, "text-primary", "В файле несколько чатов. Выбери, какой конвертировать");
      } else {
        hide_id_forms(true);
        alert(_alert_file, "text-primary", "Файл обработан");
      }
    } else {
      alert(_alert_file, "text-danger", "Ошибка обработки файла");
    }

  };

  reader.readAsText(selectedFile);
}

function messages_array_to_file(_msgs) {
  result = "";
        for ( var i = 0; i < _msgs.length; i++ ) {
          var _l_item = _msgs[i];
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
        alert(document.getElementById('text_success'), "text-success", "Готово! Файл нужно загрузить на телефон и отправить в приложение Telegram. Оно предложит добавить данные из файла в один из твоих диалогов");
      
}

function download_file(_l_id) {
    for ( var i = 0; i < data.chats.list.length; i++ ) {
      if ( data.chats.list[i].id == _l_id ) {
        messages_array_to_file(data.chats.list[i].messages);
        break;
      }
    }
}

function download_file_single_chat() {
  messages_array_to_file(data.messages);
}

// ------------- нажатие на кнопку Скачать -----------------------------
function download_chat() {
  let _alert_file = document.getElementById('check_file_result');
  // проверяяем, что файл загружен, идем парсить
  if (source) {
    id = check_id();
    if (id) download_file( check_id() );
    else download_file_single_chat();
  } else {
    alert(_alert_file, "text-danger", "Выбери файл");
  }
}