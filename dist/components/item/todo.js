import { BaseComponent } from '../component.js';
export class TodoComponent extends BaseComponent {
    constructor(title, todo) {
        super(`<section class='todo'>
  <h2 class="page-item__title todo__title"></h2>
  <div class="todo__list">
    <input type="checkbox" id="todo-checkbox">
    <label for="todo-checkbox" class="todo-label"></label>
  </div>
</section>`);
        const titleElement = this.element.querySelector('.todo__title');
        titleElement.textContent = title;
        const todoElement = this.element.querySelector('.todo-label');
        todoElement.textContent = todo;
    }
}
