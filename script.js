// @kaaripie

let data, result; // файл, Json объект, текстовые данные в новом формате

function alert(o_item, s_class, s_message) {
  // оформление текста уведомлений
  o_item.className = s_class;
  o_item.innerHTML = s_message;
}

function hide_id_forms(hide) {
  // показать-скрыть блок выбора пользователя при экспорте из множества чатов
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
  // поиск идентификатора пользователя по его имени. для множества чатов
  // вернет ID пользователя или null, сообщит об ошибке в имени
  let _alert_name = document.getElementById('text_result');
  let _name = document.getElementById('add_fullname').value;
  // получить ID чата по имени пользователя
  let _contact_list = data.frequent_contacts;

  if (data && _contact_list) {
    for ( let i = 0; i < data.frequent_contacts.list.length; i++ ) {
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
  // проверка наличия и типа данных в загруженном файле
  // определит, 1 чат или несколько, покажет/скроет форму ввода имени пользователя
  // заполнит переменную data извлеченными из файла данными
  let _selectedFile = document.getElementById('inputFile').files[0];
  let _reader = new FileReader();

  _reader.onload = function (e) {
    let _source = e.target.result;
    let _alert_file = document.getElementById('check_file_result');

    // парсинг json из файла-источника (_source), результат кладем в глобальный объект data
    data = JSON.parse(_source);
    
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

  _reader.readAsText(_selectedFile);
}

function messages_array_to_file(_msgs) {
  // распарсит полученную из конкретного чата переписку и сохранит её в txt
  result = "";
  for ( let i = 0; i < _msgs.length; i++ ) {
    let _item = _msgs[i];
    let _date = _item.date;
    result += "[" 
            + _date.split("T")[0]
            + ", "
            + _date.split("T")[1]
            + "] "
            + _item.from 
            + ": "
            +_item.text
            + "\r\n";
  } 
  
  // сохранить в файл и автоматически скачать
  let _blob = new Blob([result], { type: "text/plain" });
  let _link = document.createElement("a");
  _link.setAttribute( "href", URL.createObjectURL(_blob) );
  _link.setAttribute( "download", "_chat.txt" );
  _link.click();
  alert(document.getElementById('text_success'), "text-success", "Готово! Файл нужно загрузить на телефон и отправить в приложение Telegram. Оно предложит добавить данные из файла в один из твоих диалогов");  
}

// ------------- нажатие на кнопку Скачать -----------------------------
function download_chat() {
  let _alert_file = document.getElementById('check_file_result');
  // проверяяем, что файл загружен, идем парсить
  if (data) {
    let _id = check_id();
    if (_id) {
          // если чатов много, найдет чат по id и отправит его на сохранение
          for ( let i = 0; i < data.chats.list.length; i++ ) {
            if ( data.chats.list[i].id == _id ) {
              messages_array_to_file( data.chats.list[i].messages );
            }
          }
    } else {
      messages_array_to_file( data.messages );
    }
  } else {
    alert(_alert_file, "text-danger", "Выбери файл");
  }
}