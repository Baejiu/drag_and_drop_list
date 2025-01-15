import { ControlPanal } from './components/control.js';
import { InputDialog, } from './components/dialog/dialog.js';
import { MediaSectionInput } from './components/dialog/input.ts/media-input.js';
import { TextSectionInput } from './components/dialog/input.ts/text-input.js';
import { ImageComponent } from './components/item/image.js';
import { NoteComponent } from './components/item/note.js';
import { TodoComponent } from './components/item/todo.js';
import { VideoComponent } from './components/item/video.js';
import { PageComponent, PageItemComponent, } from './components/page/page.js';
class App {
    constructor(appRoot, dialogRoot) {
        this.dialogRoot = dialogRoot;
        this.page = new PageComponent(PageItemComponent);
        this.page.attachTo(appRoot);
        this.bindElementToDialog('#new-image', MediaSectionInput, (input) => new ImageComponent(input.title, input.url));
        this.bindElementToDialog('#new-video', MediaSectionInput, (input) => new VideoComponent(input.title, input.url));
        this.bindElementToDialog('#new-note', TextSectionInput, (input) => new NoteComponent(input.title, input.body));
        this.bindElementToDialog('#new-todo', TextSectionInput, (input) => new TodoComponent(input.title, input.body));
        this.page.addChild(new ImageComponent('Randim Image', 'https://picsum.photos/600/300'));
        this.page.addChild(new VideoComponent('PlayList video', 'https://www.youtube.com/watch?v=RRjy2B-bDs0'));
        this.page.addChild(new NoteComponent('Drag and Drop!', 'Note contents.'));
        this.page.addChild(new TodoComponent('read a Book', 'Clean Architecture'));
        this.page.addChild(new ImageComponent('Randim Photo', 'https://picsum.photos/600/300'));
        this.page.addChild(new VideoComponent('Wallace & Gromit', 'https://www.youtube.com/watch?v=4iRLGKOPqXc'));
        this.page.addChild(new NoteComponent('Good sentence', 'Better late than never! 늦더라도 안 하는 것보다 낫다.'));
        this.page.addChild(new TodoComponent('little happiness', 'deciding on dinner menu. 🍽️'));
    }
    bindElementToDialog(selector, InputComponent, makeSection) {
        const element = document.querySelector(selector);
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
new App(document.querySelector('.document'), document.body);
new ControlPanal(document.querySelector('.control'));
