// eslint-disable-next-line strict
"use strict";

class Todo {
  constructor(form, input, todoList, todoCompleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
  }

  addToStorage() {
    localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem, this); //callback функция не имеет своего this
    this.addToStorage();
  }

  createItem(todo) {
    const li = document.createElement('li');

    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML('beforeend', `
      <span class="text-todo">${todo.value}</span>
      <div class="todo-buttons">
        <button class="todo-edit"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `);
    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(e) {
    console.log(this);
    e.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.render();
    } else {
      alert('Нельзя добавить пустую задачу');
    }
  }

  animateDeleteItem(target) {
    const draw = timePassed => {
      target.style.opacity = 100 / timePassed;
      target.style.backgroundColor = 'tomato';
    };

    const start =  Date.now();
    const timer = setInterval(() => {
      const timePassed = Date.now() - start;

      if (timePassed > 1000) {
        clearInterval(timer);
        return;
      }

      draw(timePassed);
    }, 20);
  }

  animateShiftItem(target, direction) {
    const draw = timePassed => {
      if (direction === 'down') {
        target.style.position = 'relative';
        target.style.top = timePassed / 25 + 'px';
        target.style.backgroundColor = 'blue';
      } else if (direction === 'up') {
        target.style.position = 'relative';
        target.style.bottom = timePassed / 25 + 'px';
        target.style.backgroundColor = 'green';
      }
    };

    const start =  Date.now();
    const timer = setInterval(() => {
      const timePassed = Date.now() - start;

      if (timePassed > 1000) {
        clearInterval(timer);
        return;
      }

      draw(timePassed);
    }, 20);
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  editItem(target) {
    const li = target.closest('li').key;
    this.todoData.forEach((elem, i) => {
      if (elem.key === li) {
        target.closest('li').setAttribute('contenteditable', true);
        target.closest('li').style.backgroundColor = 'steelblue';
        target.closest('li').addEventListener('blur', () => {
          target.closest('li').setAttribute('contenteditable', false);
          target.closest('li').style.backgroundColor = 'white';
          elem.value = target.closest('li').textContent;
          this.render();
        }, { once: true });
      }
    });
  }

  deleteItem(target) {
    const li = target.closest('li').key;
    this.todoData.forEach((elem, i) => {
      if (elem.key === li) {
        this.todoData.delete(i);
      }
    });
    this.animateDeleteItem(target.closest('li'));
    setTimeout(() => {
      this.render();
    }, 1000);
  }

  completedItem(target) {
    const li = target.closest('li').key;
    this.todoData.forEach((elem, i) => {
      if (elem.key === li) {
        if (elem.completed) {
          elem.completed = false;
          this.animateShiftItem(target.closest('li'), 'up');
        } else {
          elem.completed = true;
          this.animateShiftItem(target.closest('li'), 'down');
        }
      }
    });
    setTimeout(() => {
      this.render();
    }, 1000);
  }

  handler() {
    this.todoList.addEventListener('click', event => {
      const target = event.target;
      if (target.closest('.todo-remove')) {
        this.deleteItem(target);
      } else if (target.closest('.todo-complete')) {
        this.completedItem(target);
      } else if (target.closest('.todo-edit')) {
        this.editItem(target);
      }
    });

    this.todoCompleted.addEventListener('click', event => {
      const target = event.target;

      if (target.closest('.todo-remove')) {
        this.deleteItem(target);
      } else if (target.closest('.todo-complete')) {
        this.completedItem(target);
      } else if (target.closest('.todo-edit')) {
        this.editItem(target);
      }
    });
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.render();
    this.handler();
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
