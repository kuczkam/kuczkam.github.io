let tasks = (() => {
    'use strict';
  
    const arrTasks      = [];
    const input         = document.getElementById('js__task-input');
    const list          = document.getElementById('js__tasks');
    const button        = document.getElementById('js__task-add');
    const buttonClose   = document.getElementById('js__task-add-close');
    const date          = document.getElementById('js__task-date');
    const btnRemove     = document.getElementById('js__task-remove');
    const divAddTask    = document.getElementById('js__task-add_div');
    const btnEdittask   = document.querySelector('.js__task-edit');
    const btnAddTask    = document.querySelector('.js__task-add');
    const btnSaveTask   = document.getElementById('js__task-add-edit');
    const btnCheckTask  = document.querySelector('.js__task-check');
  
    const addTask = () => {
        const daySelected = document.querySelector('.selected');
        let val = input.value;
        let valReplaced;

        if (val !== '') {
            if (val.startsWith(' ')) {
                valReplaced = val.replace(' ', 'NULL');
                arrTasks.push(valReplaced);
                createTaskElement(valReplaced);
            } else {
                arrTasks.push(val);
                createTaskElement(val);
            }
        }
        val = '';
        date.innerText = '';
        if (daySelected !== null) {
            daySelected.classList.remove('selected');
        }
        __sortList();
        saveInLocalStorage();
        document.querySelector('.aside').classList.add('hide');
        history.pushState(null, null, "./");
    }
  
    const __uniqueId = () => {
        return Math.random().toString(36).substr(2, 5);
    }

    const createTaskElement = (value) => {
        const element = document.createElement('li');
        const taskDate = document.createElement('div');
        const sort = document.createElement('div');
        const p = document.createElement('p');
        let dateInMilliseconds;

        taskDate.innerText = date.innerText;
        dateInMilliseconds = Date.parse(taskDate.innerText.replace(/.{6}/g, "$&,"));
        sort.innerHTML = dateInMilliseconds;

        if (taskDate.innerText === '') {
            taskDate.innerText = 'no deadline';
            sort.innerHTML = Date.parse("31 Dec, 2200");
        }

        p.innerText = value;
        console.log('jakiś log, tu powinno coś chyba być czy coś');

        element.setAttribute('class', 'todo-element');
        element.setAttribute('id', __uniqueId());
        p.setAttribute('id', __uniqueId());
        p.setAttribute('class', 'todo-element__item');
        taskDate.setAttribute('class', 'task-date');
        taskDate.setAttribute('id', __uniqueId());
        sort.setAttribute('class', 'sort');
        element.appendChild(p);
        element.appendChild(taskDate);
        element.appendChild(sort);
        list.appendChild(element);
    }

    const __taskIndex = () => {
        const li = document.getElementsByClassName('js__to-edit')[0];
        var nodes = Array.prototype.slice.call( list.children );
        var index = nodes.indexOf(li);

        return index;
    }

    const deleteTask = (index) => {
        if(btnRemove) {
            const todos = document.querySelectorAll('#js__tasks li');
            if (todos.length > 0) {
                [...todos].find((todo, key) => key === __taskIndex()).remove();
                arrTasks.splice(__taskIndex(), 1);    
            }
            __activeClassButton(); 
        }
        saveInLocalStorage();
    }

    const _addClassToFindTask = (e) => {
        if (e.target.tagName === 'P' || e.target.tagName === 'DIV') {
          const c = document.querySelector('#js__tasks li.js__to-edit');
          const item = e.target.closest('LI');
          const hasEditClass = item.classList.contains('js__to-edit')
          if (c !== null) {
            c.classList.remove('js__to-edit');
            __activeClassButton(e);
          }
          if (!hasEditClass) {
            item.classList.add('js__to-edit');
            __activeClassButton(e);
          }
        }
      }

    const bindEvents = () => {
        //add and edit start
        btnAddTask.addEventListener('click', () => {
            input.value = '';
            date.innerText = '';
            divAddTask.className = 'visible';
            document.querySelector('.aside').classList.remove('hide');
            getFocus(divAddTask, input);
            history.pushState(null, null, "./modal");
        });
        buttonClose.addEventListener('click', () => {
            document.querySelector('.aside').classList.add('hide');
            button.classList.remove('hide');
            btnSaveTask.classList.add('hide');;
            history.pushState(null, null, "./");
        });
        input.addEventListener('keyup', (e) => {
          e.preventDefault();
          if (e.keyCode === 13) {
            button.click();
            history.pushState(null, null, "./");
          }
        });
        btnEdittask.addEventListener('click', __editTask);
        btnSaveTask.addEventListener('click', saveTask);
        //add edit stop

        list.addEventListener('click', _addClassToFindTask);
        button.addEventListener("click", function(e) {
            if (input.value === '') {
                alert('error');
            }
        });
        button.addEventListener('click', addTask);
        
        btnRemove.addEventListener('click', deleteTask);
        btnCheckTask.addEventListener('click', checkTask);

        loadFromLocalStorage();
        __sortList();
        window.addEventListener('popstate', e => {
            e.preventDefault();
            document.querySelector('.aside').classList.add('hide');
        });

        var storage = localStorage.getItem("tasks");
        var claim = document.querySelector('.claim');
        if (storage) {
            claim.classList.add('hide');
        } else {
            claim.classList.remove('hide');
        }
    }


    const __editTask = () => {
        const p = document.querySelector('li.js__to-edit p');
        const elementId = p.getAttribute('id');
        const val = document.getElementById(elementId).innerText;
        const modalDate = document.querySelector('li.js__to-edit div.task-date');
        const dateId = modalDate.getAttribute('id');
        const dateVal = document.getElementById(dateId);
        document.querySelector('.aside').classList.remove('hide');
        divAddTask.className = 'visible';
        button.classList.add('hide');
        btnSaveTask.classList.remove('hide');
        history.pushState(null, null, "./modal");
        input.value = val;
        date.textContent = dateVal.innerText;
        getFocus(divAddTask, input);
    }

    const saveTask = () => {
        const newValue = input.value;
        const p = document.querySelector('li.js__to-edit p');
        const sort = document.querySelector('li.js__to-edit div.sort');
        const taskDate = document.querySelector('li.js__to-edit div.task-date');
        var dateInMilliseconds = Date.parse(taskDate.innerText.replace(/.{6}/g, "$&,"));

        p.innerHTML = newValue;
        arrTasks[__taskIndex()] = newValue;
        taskDate.innerHTML = date.innerText;
        sort.innerHTML = dateInMilliseconds;
        button.classList.remove('hide');
        btnSaveTask.classList.add('hide');
        document.querySelector('.aside').classList.add('hide');
        history.pushState(null, null, "./");
        
        __sortList();
        saveInLocalStorage();
    }

    const getFocus = (a, b) => {
        if (a.classList.contains('visible')) {
            b.focus();
        }
    }

    const __activeClassButton = () => {
        const selector = document.querySelector('#js__tasks li.js__to-edit');
        const btn = document.querySelectorAll('.btn');
        [].forEach.call(btn, (el) => {
            if (selector !== null) {
                el.classList.add('active');
                if (selector.classList.contains('task_done')) {
                    btnCheckTask.classList.remove('active');
                }
            } else {
                el.classList.remove('active');
            }
        });
    }

    const checkTask = () => {
        const elem = document.querySelector('#js__tasks li.js__to-edit');
        if (elem) {
            elem.classList.toggle('task_done');
            btnCheckTask.classList.toggle('active');
            saveInLocalStorage();
        }
    }

    const saveInLocalStorage = () => {
        localStorage.setItem('tasks', list.innerHTML);
        if ( localStorage.getItem('tasks') === "" ) {
            localStorage.removeItem('tasks');
        }
    }

    const loadFromLocalStorage = () => {
        var saved = localStorage.getItem('tasks');
        if (saved) {
            list.innerHTML = saved;
        }
    }

    const __sortList = () => {
        var todoList = new List('todos', {
            valueNames: ['sort']
        });
        todoList.sort("sort", {
            order: "asc"
        });
    }

    return {
        bindEvents: bindEvents,
        addTask: addTask,
        createTaskElement: createTaskElement,
        deleteTask: deleteTask
    }
  })();
tasks.bindEvents();