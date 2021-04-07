let data; // Json объект, полученный из файла

function alert(o_item, s_class, s_message) {
  // текст и оформление текста уведомлений
  o_item.className = s_class;
  o_item.innerHTML = s_message;
}

function hide_id_forms(hide) {
  // показать выбор пользователя, если из файла извлечено несколько чатов
  let _set_state = hide ? 'hidden' : 'visible'; // true or false

  let _req_text = document.getElementById('text_request_id');
  let _input_text = document.getElementById('add_fullname');
  let _idresult_text = document.getElementById('text_result'); 
  let _id_req_btn = document.getElementById('button_request_id');

  _req_text.style.visibility = _set_state;
  _input_text.style.visibility = _set_state;
  _idresult_text.style.visibility = _set_state;
  _id_req_btn.style.visibility = _set_state;
}

function check_id() {
  // поиск идентификатора пользователя по его имени. для множества чатов
  // вернет ID пользователя или null, сообщит об ошибке в имени
  // -------------- вызывается при нажатии на кнопку Проверить пользователя -----------------

  let _alert_name = document.getElementById('text_result');
  let _name = document.getElementById('add_fullname').value;
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
  } else if (data && !_contact_list) {
    console.log("в файле только один чат (не удалось извлечь список контактов)");
    return null;
  } else {
    alert(_alert_name, "text-danger", "Сначала выбери файл");
    return null;
  }
}

function check_file() {
  // извлекает данные из загруженного файла
  // определит, 1 чат или несколько и покажет/скроет форму ввода имени пользователя
  // заполнит глобальную переменную data извлеченными из файла данными
  let _selectedFile = document.getElementById('inputFile').files[0];
  let _reader = new FileReader();

  _reader.onload = function (e) {
    let _source = e.target.result;
    let _alert_file = document.getElementById('check_file_result');

    // парсинг json из файла-источника (_source), результат кладем в глобальную переменную data
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
  // преобразует полученный массив сообщений и сохранит его в txt
  let _result = "";

  if (_msgs) {
    for ( let i = 0; i < _msgs.length; i++ ) {
      let _item = _msgs[i];
      let _l_text = "";
      let _l_actor = "???";

      _item.from ? _l_actor = _item.from : _l_actor = _item.actor;

      if (_item.sticker_emoji) {
        _l_text = _item.sticker_emoji;
      } 
      else if (_item.file) {
        _l_text = _item.file.split("/")[1] + " <прикреплено: " + _item.file.split("/")[1] + ">";
      } 
      else if (_item.photo) {
        _l_text = "<прикреплено: " + _item.photo.split("/")[1] + ">";
      } 
      else if (_item.action == "phone_call") {
        if (_item.duration_seconds) {
          _l_text = "Аудиозвонок (" + _item.duration_seconds + " сек)";
        } else {
          _l_text = "Пропущенный аудиозвонок";
        }
      }
      else if (_item.text) {
        if (Array.isArray(_item.text)) {
          let _l_string = "";

          for ( let i = 0; i < _item.text.length; i++ ) {
            var _type = typeof _item.text[i];
            if (_type == "string") {
              _l_string += _item.text[i];
            } 
            else {
              _l_string += _item.text[i].text;
            }
          } 
          _l_text = _l_string;
        } 
        else {
          _l_text = _item.text;
        };
      } 
      else {
        console.log("ошибка обработки сообщения: " + JSON.stringify(_item));
      }

      _result += "[" 
              + _item.date.replace("T", ", ")
              + "] "
              + _l_actor 
              + ": "
              + _l_text
              + "\r\n";
    } 
    
    // сохранить в файл и автоматически скачать
    let _blob = new Blob([_result], { type: "text/plain" });
    
    let _link = document.createElement("a");
    _link.setAttribute( "href", URL.createObjectURL(_blob) );
    _link.setAttribute( "download", "_chat.txt" );
    _link.click();

    alert(document.getElementById('text_success'), "text-success", "Готово! Файл нужно загрузить на телефон и отправить в приложение Telegram. Оно предложит добавить данные из файла в один из твоих диалогов"); 
  }
  else {
    alert(document.getElementById('text_success'), "text-danger", "Нет данных для скачивания. Проверь имя пользователя"); 
  }
}

// ------------- вызывается при нажатии на кнопку Скачать -----------------------------
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
      // если чат только один, сохранит его в файл
      messages_array_to_file( data.messages );
    }
  } else {
    alert(_alert_file, "text-danger", "Выбери файл");
  }
}