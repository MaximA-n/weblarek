import { ensureElement } from "../../utils/utils";
import { CardMain, ICardMain } from "./CardMain";

export interface ICardBasket extends ICardMain{
    index: number;
    id: string;
}

export interface ICardBasketActions {
    onDelete?: (data: { id: string }) => void;
}

export class CardBasket extends CardMain {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;
    id: string = '';
    index: number = 0;

    constructor(container: HTMLElement, private actions?: ICardBasketActions) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButton.addEventListener('click', (ev) => {
            ev.stopPropagation();
            if (this.actions?.onDelete) {
                this.actions.onDelete({ id: this.id });
            }
        });
    }
}