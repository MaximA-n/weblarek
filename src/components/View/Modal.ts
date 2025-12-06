import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
    content: HTMLElement | null;
}

export class Modal extends Component<IModal> {
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        this.container.addEventListener('click', (evt) => {
            if (evt.target === this.container) {
                this.events.emit('modal:close');
            }
        });
    }

    set content(value: HTMLElement | null) {
        this.contentElement.replaceChildren(value ?? '');
    }

    open() {
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = '';
    }
}