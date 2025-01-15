interface Control {
  open(): void;
  close(): void;
}

export class ControlPanal implements Control {
  private panelDropdown: HTMLElement;
  private panelVisible: boolean = false;
  constructor(private control: HTMLElement) {
    this.panelDropdown = this.control.querySelector(
      '.control-panel'
    )! as HTMLElement;

    const button = this.control.querySelector(
      '#panel-button'
    )! as HTMLButtonElement;
    button.addEventListener('click', () => {
      if (this.panelVisible) {
        this.close();
      } else {
        this.open();
      }
    });

    const createButton = this.control.querySelectorAll(
      '.create-button'
    )! as NodeListOf<HTMLButtonElement>;
    createButton.forEach((node) =>
      node.addEventListener('click', () => {
        this.close();
      })
    );
  }
  open(): void {
    this.panelDropdown.classList.add('open');
    this.panelVisible = true;
  }
  close(): void {
    this.panelVisible = false;
    this.panelDropdown.classList.remove('open');
  }
}
