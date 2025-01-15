import { BaseComponent } from '../component.js';
export class InputDialog extends BaseComponent {
    constructor() {
        super(`<section class="dialog">
      <div class="dialog__container">
  <button class="close"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg></button>
  <div id="dialog__body"></div>
  <button class="dialog__submit">ADD</button>
  </div>
</section>`);
        const closeBtn = this.element.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            this.closeListener && this.closeListener();
        });
        const submitBtn = this.element.querySelector('.dialog__submit');
        submitBtn.addEventListener('click', () => {
            this.submitListener && this.submitListener();
        });
    }
    addChild(child) {
        const body = this.element.querySelector('#dialog__body');
        child.attachTo(body);
    }
    setOnCloseListener(listener) {
        this.closeListener = listener;
    }
    setOnSubmitListener(listener) {
        this.submitListener = listener;
    }
}
