export class ControlPanal {
    constructor(control) {
        this.control = control;
        this.panelVisible = false;
        this.panelDropdown = this.control.querySelector('.control-panel');
        const button = this.control.querySelector('#panel-button');
        button.addEventListener('click', () => {
            if (this.panelVisible) {
                this.close();
            }
            else {
                this.open();
            }
        });
        const createButton = this.control.querySelectorAll('.create-button');
        createButton.forEach((node) => node.addEventListener('click', () => {
            this.close();
        }));
    }
    open() {
        this.panelDropdown.classList.add('open');
        this.panelVisible = true;
    }
    close() {
        this.panelVisible = false;
        this.panelDropdown.classList.remove('open');
    }
}
