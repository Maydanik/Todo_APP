// Task manager
// 1. создать задачу
//      а. обработка формы
//          - проверить данные перед добавлением (валидация)
//      б. добавить задачу в массив
//      в. добавить данные в таблицу
//      г. офистить форму
// 2. удалить задачу
//      а. подтверждение
//      б. удаление данных из таблицы
//      в. удаление данных из массива 
// 3. редактировать задачу 
//      а. взять данные из массива
//      б. поместить в форму 
//      в. обработать форму на редактирование
//          - валидация
//      г. обновить данные в массиве
//      д. обновить данные в таблице
//      е. офистить форму

// task = {
//     id: {
//         type: 'String',
//         required: true
//     },
//     title: {
//         type: 'String',
//         required: true
//     },
//     text: {
//         type: 'String',
//         required: true
//     }
// }

// ;(function () {

let storage = {
    todos: []
};

// UI Elements
const table = document.querySelector('.table tbody');
const form = document.forms['addTodoForm'];
const title = form.elements['title'];
const text = form.elements['text'];

// click, keyUp, keyDown, submit
form.addEventListener('submit', function (e) {
    e.preventDefault();

    let submitStatus = document.querySelector('.submit');

    if (!submitStatus.classList.contains('d-none')) {

        if (!title.value || !text.value) return alertMessage('alert-danger', 'Введите название и текст задачи!');

        addNewTodoToStorage(generateId(), title.value, text.value);
        alertMessage('alert-info', 'Задача добавленна успешно!');
    }
    else {

        editTaskStorage(todoEditId, title.value, text.value);
        alertMessage('alert-info', 'Задача изменена успешно!');
        submitToggle();
        title.removeAttribute('value');
        text.removeAttribute('value');
    }

    form.reset();
});

function alertMessage(isError, message) {

    const template = alertTemplate(isError, message);
    let alertPlace = document.querySelector('.card');
    alertPlace.insertAdjacentHTML('afterend', template);

    setTimeout(alertMessageRemove, 2000);
}

function alertTemplate(isError, message) {

    return `<div class="alert ${isError}">${message}</div>`;
}

function alertMessageRemove() {

    const target = document.querySelector('.alert');
    target.parentElement.removeChild(target);
}

/**
 * 
 */
function generateId() {
    const words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let id = '';

    for (let char of words) {
        let index = Math.floor(Math.random() * words.length);
        id += words[index];
    }

    return id;
}

/**
 * 
 * @param {*} title 
 * @param {*} text 
 */
function addNewTodoToStorage(id, title, text) {
    if (!title) return alertMessage('alert-danger', 'Введите название задачи!');
    if (!text) return alertMessage('alert-danger', 'Введите текст задачи!');

    const newTask = {
        title,
        text,
        id
    };

    storage.todos.push(newTask);

    // Добавим в разметку
    addNewTodoToView(newTask);

    let btnTrash = document.querySelector('.fa-trash');
    let btnEdit = document.querySelector('.fa-edit');

    btnTrash.addEventListener('click', todoDelete);
    btnEdit.addEventListener('click', todoEdit);

    return storage.todos;
}

function todoDelete() {

    let todoId = event.currentTarget.closest('[data-id]').dataset.id;
    deleteTodoFromStorage(todoId);
    alertMessage('alert-info', 'Задача удалена успешно!');
}

let todoEditId, todoEditTitle, todoEditText;

function todoEdit() {

    todoEditId = event.currentTarget.closest('[data-id]').dataset.id;

    storage.todos.forEach(function (item) {

        if (todoEditId === item.id) {

            todoEditTitle = item.title;
            todoEditText = item.text;
        }
    });

    title.setAttribute('value', todoEditTitle);
    text.setAttribute('value', todoEditText);
    submitToggle();
}

function submitToggle() {
    let submitBtn = document.querySelector('.submit');
    submitBtn = submitBtn.classList.toggle('d-none');
    let editSubmitBtn = document.querySelector('.edit-submit');
    editSubmitBtn = editSubmitBtn.classList.toggle('d-none');
}

addNewTodoToStorage(generateId(), 'My title 1', 'My text 1');

/**
 * 
 * @param {*} id 
 */
function deleteTodoFromStorage(id) {
    const checkIdRes = checkId(id);
    if (checkIdRes.error) return alertMessage('alert-danger', msg);

    let removedTask;

    for (let i = 0; i < storage.todos.length; i++) {
        if (storage.todos[i].id === id) {
            removedTask = storage.todos.splice(i, 1);
            break;
        }
    }

    deleteTodoFromView(id);

    //btnTrash.removeEventListener('click', todoDelete);//не вызываются на удаленные элементы html
    //btnEdit.removeEventListener('click', todoEdit);

    return removedTask;
}

function checkId(id) {
    if (!id) return { error: true, msg: 'Передайте id задачи!' };

    const checkId = storage.todos.some(function (task, i) {
        return task.id === id
    });
    if (!checkId) return { error: true, msg: 'id не существует!' };

    return { error: false, msg: '' };
}

/**
 * 
 * @param {*} id 
 * @param {*} title 
 * @param {*} text 
 */
function editTaskStorage(id, title, text) {

    if (!title) return alertMessage('alert-danger', 'Введите название задачи!');    
    if (!text) return alertMessage('alert-danger', 'Введите текст задачи!');
    if (!id) return alertMessage('alert-danger', 'Передайте id задачи!');

    deleteTodoFromStorage(id);
    addNewTodoToStorage(id, title, text);

    return storage.todos;
}

function deleteTodoFromView(id) {
    const target = document.querySelector(`[data-id="${id}"]`);
    target.parentElement.removeChild(target);
}

/**
 * 
 * @param {*} task 
 */
function addNewTodoToView(task) {
    const template = todoTemplate(task);
    table.insertAdjacentHTML('afterbegin', template);
}

/**
 * 
 * @param {*} task 
 */
function todoTemplate(task) {
    return `
            <tr data-id="${task.id}"> 
                <td>${task.title}</td>
                <td>${task.text}</td>
                <td>
                    <i class="fas fa-trash"></i>
                    <i class="fas fa-edit"></i>
                </td>
            </tr>
        `;
}

// })();