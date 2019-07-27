class ToDoList {
    constructor(tasks) {
        this.tasks = tasks;
    }

    addTask(task) {
        this.tasks.push(task);
        this.updateTaskInLocalStorage();
    }

    updateTaskInLocalStorage() {
        localStorage.removeItem('tasks');
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.updateTaskInLocalStorage();
    }

    toggleState(taskId) {
        let currentTask = this.tasks.find(task => task.id === taskId);

        currentTask.done = !currentTask.done;
        this.updateTaskInLocalStorage();
    }

    getInitialTask() {
        return {
            title: '',
            done: false,
            id: Date.now()
        }
    }
}

class View {
    constructor(element) {
        this.root = element;
    }

    clear() {
        this.root.innerHTML = '';
    }

    renderForm(initialData) {
        let form = document.createElement('form'),
            titleInput = document.createElement('input'),
            submitBtn = document.createElement('button');

        titleInput.value = initialData.title;
        titleInput.setAttribute('data-id', initialData.id);
        titleInput.type = 'text';
        titleInput.placeholder = 'Название задачи...';
        submitBtn.innerText = '+';
        submitBtn.type = 'submit';

        form.classList.add('form');
        titleInput.classList.add('form__input');
        submitBtn.classList.add('form__button');

        form.appendChild(titleInput);
        form.appendChild(submitBtn);

        this.form = form;
        this.formInput = titleInput;

        this.root.appendChild(form);
    }

    renderList(data) {
        this.listHTML = document.createElement('ul');
        data.map(this.renderItem).forEach(li => this.listHTML.appendChild(li), this);

        this.listHTML.classList.add('list');
        this.root.appendChild(this.listHTML);
    }

    renderItem(task) {
        let li = document.createElement('li'),
            checkbox = document.createElement('input'),
            label = document.createElement('label'),
            span = document.createElement('span'),
            removeBtn = document.createElement('button');

        li.classList.add('list__item');
        checkbox.classList.add('list__item-checkbox');
        checkbox.id = `input${task.id}`;
        label.classList.add('list__item-label');
        label.htmlFor = checkbox.id;
        span.classList.add('list__item-span');
        removeBtn.classList.add('list__item-btn');

        checkbox.type = 'checkbox';
        span.innerText = task.title;

        if (task.done) {
            checkbox.setAttribute('checked', true);
            span.style.textDecoration = 'line-through';
        }

        li.setAttribute('data-id', task.id);
        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(span);
        li.appendChild(removeBtn);

        return li;
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    createForm() {
        this.view.renderForm(this.model.getInitialTask());
    }

    renderToDoList() {
        this.view.renderList(this.model.tasks);
    }

    addListeners() {
        this.view.listHTML.addEventListener('click', e => {
            let target = e.target;

            if (target.nodeName === 'BUTTON' || target.nodeName === 'INPUT') {
                let id = +target.parentNode.getAttribute('data-id');

                target.type === 'checkbox' ?
                    this.model.toggleState(id) :
                    this.model.removeTask(id);

                this.view.clear();
                this.init();
            }
        })

        this.view.form.addEventListener('submit', e => {
            e.preventDefault();

            let value = this.view.formInput.value,
                id = this.view.formInput.getAttribute('data-id');

            if (!value.length) {
                alert('Введите название задачи!');
                return;
            }

            this.model.addTask({
                title: value,
                done: false,
                id: +id
            });

            this.view.clear();
            this.init();
        })
    }

    init() {
        this.createForm();
        this.renderToDoList();
        this.addListeners();
    }
}

let data = JSON.parse(localStorage.getItem('tasks')),
    tasks = Array.isArray(data) ? data : [];

let toDoList = new Controller(
    new ToDoList(tasks),
    new View(document.getElementById('root'))
);

toDoList.init();