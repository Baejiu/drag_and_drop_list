import { Component } from './components/component.js';
import { ControlPanal } from './components/control.js';
import {
  InputDialog,
  MediaData,
  TextData,
} from './components/dialog/dialog.js';
import { MediaSectionInput } from './components/dialog/input.ts/media-input.js';
import { TextSectionInput } from './components/dialog/input.ts/text-input.js';
import { ImageComponent } from './components/item/image.js';
import { NoteComponent } from './components/item/note.js';
import { TodoComponent } from './components/item/todo.js';
import { VideoComponent } from './components/item/video.js';

import {
  Composable,
  PageComponent,
  PageItemComponent,
} from './components/page/page.js';

type InputComponentConstructor<T = (MediaData | TextData) & Component> = {
  new (): T;
};
class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    // For demo
    this.bindElementToDialog<MediaSectionInput>(
      '#new-image',
      MediaSectionInput,
      (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
    );
    this.bindElementToDialog<MediaSectionInput>(
      '#new-video',
      MediaSectionInput,
      (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
    );
    this.bindElementToDialog<TextSectionInput>(
      '#new-note',
      TextSectionInput,
      (input: TextSectionInput) => new NoteComponent(input.title, input.body)
    );

    this.bindElementToDialog<TextSectionInput>(
      '#new-todo',
      TextSectionInput,
      (input: TextSectionInput) => new TodoComponent(input.title, input.body)
    );

    this.page.addChild(
      new ImageComponent('Randim Image', 'https://picsum.photos/600/300')
    );
    this.page.addChild(
      new VideoComponent(
        'PlayList video',
        'https://www.youtube.com/watch?v=RRjy2B-bDs0'
      )
    );
    this.page.addChild(new NoteComponent('Drag and Drop!', 'Note contents.'));
    this.page.addChild(new TodoComponent('read a Book', 'Clean Architecture'));
    this.page.addChild(
      new ImageComponent('Randim Photo', 'https://picsum.photos/600/300')
    );
    this.page.addChild(
      new VideoComponent(
        'Wallace & Gromit',
        'https://www.youtube.com/watch?v=4iRLGKOPqXc'
      )
    );
    this.page.addChild(
      new NoteComponent(
        'Good sentence',
        'Better late than never! 늦더라도 안 하는 것보다 낫다.'
      )
    );
    this.page.addChild(
      new TodoComponent('little happiness', 'deciding on dinner menu. 🍽️')
    );
  }

  private bindElementToDialog<T extends (MediaData | TextData) & Component>(
    selector: string,
    InputComponent: InputComponentConstructor<T>,
    makeSection: (input: T) => Component
  ) {
    const element = document.querySelector(selector)! as HTMLElement;
    element.addEventListener('click', () => {
      const dialog = new InputDialog();
      const input = new InputComponent();
      dialog.addChild(input);
      dialog.attachTo(this.dialogRoot);

      dialog.setOnCloseListener(() => dialog.removeFrom(this.dialogRoot));
      dialog.setOnSubmitListener(() => {
        const image = makeSection(input);
        this.page.addChild(image);
        dialog.removeFrom(this.dialogRoot);
      });
    });
  }
}

new App(document.querySelector('.document')! as HTMLElement, document.body);
new ControlPanal(document.querySelector('.control')! as HTMLElement);
