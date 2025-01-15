import {
  EnableDragging,
  EnableDrop,
  EnableHover,
} from '../../decorators/draggable.js';
import { Draggable, Droppable, Hoverable } from '../common/type.js';
import { BaseComponent, Component } from '../component.js';

export interface Composable {
  addChild(child: Component): void;
}
type OnCloseListener = () => void;
type DragState = 'start' | 'stop' | 'enter' | 'leave';
type OnDragStateListener<T extends Component> = (
  target: T,
  state: DragState
) => void;
interface SectionContainer extends Component, Composable, Draggable, Hoverable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteChildren(state: 'mute' | 'unmute'): void;
  getBoundingRect(): DOMRect;
  onDropped(): void;
}
type SectionContainerConstructor = {
  new (): SectionContainer;
};

@EnableDragging
@EnableHover
export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer
{
  private closeListener?: OnCloseListener;
  private dragStateListner?: OnDragStateListener<PageItemComponent>;
  constructor() {
    super(`<li class="page-item" draggable="true">
  <section class="page-item__body"></section>
  <div class="page-item__controls">
    <button class="close"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg></button>
  </div>
</li>`);

    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };
  }

  onDragStart(_: DragEvent) {
    this.notifyDragObservers('start');
    this.element.classList.add('lifted');
  }
  onDragEnd(_: DragEvent) {
    this.notifyDragObservers('stop');
    this.element.classList.remove('lifted');
  }
  onDragEnter(_: DragEvent) {
    this.notifyDragObservers('enter');
    this.element.classList.add('drop-area');
  }
  onDragLeave(_: DragEvent) {
    this.notifyDragObservers('leave');
    this.element.classList.remove('drop-area');
  }
  notifyDragObservers(state: DragState) {
    this.dragStateListner && this.dragStateListner(this, state);
  }
  addChild(child: Component) {
    const container = this.element.querySelector(
      '.page-item__body'
    )! as HTMLElement;
    child.attachTo(container);
  }
  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListner = listener;
  }
  muteChildren(state: 'mute' | 'unmute') {
    if (state == 'mute') {
      this.element.classList.add('mute-children');
    }
    if (state == 'unmute') {
      this.element.classList.remove('mute-children');
    }
  }
  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
  onDropped() {
    this.element.classList.remove('drop-area');
  }
}

@EnableDrop
export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable, Droppable
{
  private children = new Set<SectionContainer>();
  private dragTarget?: SectionContainer;
  private dropTarget?: SectionContainer;
  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>');
  }
  onDragOver(_: DragEvent) {}
  onDrop(event: DragEvent) {
    if (!this.dropTarget) {
      return;
    }
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();
      this.dragTarget?.removeFrom(this.element);

      this.dropTarget.attach(
        this.dragTarget,
        dropY < srcElement.y ? 'beforebegin' : 'afterend'
      );
      this.dropTarget.onDropped();
    }
  }
  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOnDragStateListener(
      (target: SectionContainer, state: DragState) => {
        switch (state) {
          case 'start':
            this.dragTarget = target;
            this.updateSections('mute');
            break;
          case 'stop':
            this.dragTarget = undefined;
            this.updateSections('unmute');
            break;
          case 'enter':
            this.dropTarget = target;
            break;
          case 'leave':
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`UNSUPPORTED STATE: ${state}`);
        }
      }
    );
  }
  private updateSections(state: 'mute' | 'unmute') {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}
