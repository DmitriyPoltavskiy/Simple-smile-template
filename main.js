emojify.setConfig(
    {
        tag_type : 'img',
        img_dir: 'https://cdnjs.cloudflare.com/ajax/libs/emojify.js/1.1.0/images/basic'
    }
);
emojify.run();
var messageContainer = document.getElementById('messageContainer');
var messageForm = document.getElementById('messageForm');
var messageInput = document.getElementById('messageInput');
var smileButton = document.getElementById('smileButton');

function sendMessage(event) {
    event.preventDefault();

    let message = messageInput.innerHTML;

    messageInput.textContent = '';

    message = findAltInString(message);
    
    messageContainer.innerHTML += message;
    emojify.run();
}

function findAltInString(message) {
    for (var i = 0; i < message.length; i++) {
        if(message[i] === '<' || message[i] === '&lt;' || message[i] === '&#60;') { // Ищем тег
            for (var j = i; j < message.length; j++) {  
                if(message[j] === '>' || message[j] === '&gt;' || message[j] === '&#62;') { // Ищем конец тега
                    var alt;    // Переменная для атрибута "alt" в теге img
                    var altIndex = message.indexOf('alt=', i);  // Номер в массиве искомого атрибута 
                    if(altIndex === -1) {
                        break;  // Выходим если не нашли
                    }
                    else {
                        var endIndex = message.indexOf(' ', altIndex + 4);  // Ищем конец атрибута
                        if(endIndex === -1) {
                            console.error('Error: not find \'"\'');
                            break;  // Выходим если не нашли
                        }
                        alt = message.slice(altIndex + 5, endIndex - 1); // Вырезаем содержание атрибута в переменную
                        imgTag = message.slice(i, j + 1);   //  Вырезаем тег в переменную
                        
                        alt = ' ' + alt + ' ';  // Необходимо добавить пробелы вначале и в конце, что бы скрипт мог заменить строку на тег img 

                        message = message.replace(imgTag, alt); // Удаляем из сообщения тег
                        message = findAltInString(message); // Запускаем метод заново, для остальных тегов
                        break;
                    }
                    break;  // После того как нашли первый тег и заменили его, выходим
                }
            }
            break;  // Если не нашли закрывающий тег, то возвращаем сообщение 
        }
    }
    return message; // Если не нашли ни одного тега, то возвращаем сообщение
}

function choiceSmile(event, item) {
    messageInput.innerHTML += ` :${item.getAttribute('data-smile-item')}: `;
    emojify.run();
}

messageInput
    .addEventListener('keyup', function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            document.getElementById('submitButton').click();
        }
    });
