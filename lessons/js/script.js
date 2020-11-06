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

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  deleteItem(target) {
  let li = target.closest('li').key;
    this.todoData.forEach((elem, i) => {
      if (elem.key === li) {
        this.todoData.delete(i);
      }
    });
    this.render();
  }

  completedItem(target) {
    let li = target.closest('li').key;
    this.todoData.forEach((elem, i) => {
      if (elem.key === li) {
        if (elem.completed) {
          elem.completed = false;
        } else {
          elem.completed = true;
        }
      }
    });
    this.render();
  }

  handler() {
    this.todoList.addEventListener('click', (event) => {
      let target = event.target;
      if (target.closest('.todo-remove')) {
        this.deleteItem(target);
      } else if (target.closest('.todo-complete')) {
        this.completedItem(target);
      }
    });

    this.todoCompleted.addEventListener('click', (event) => {
      let target = event.target;

      if (target.closest('.todo-remove')) {
        this.deleteItem(target);
      } else if (target.closest('.todo-complete')) {
        this.completedItem(target);
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
