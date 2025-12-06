import { Component } from "../base/Component";

interface IGallery {
    items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected item: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.item = container;        
    }

    set items(items: HTMLElement[]) {
        this.item.replaceChildren(...items);
    }
}