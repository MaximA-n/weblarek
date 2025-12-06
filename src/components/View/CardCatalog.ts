import { ensureElement } from '../../utils/utils';
import { CardMain, ICardMain } from './CardMain';
import { categoryMap, CDN_URL } from '../../utils/constants';

export interface ICardCatalog extends ICardMain {
    id: string;
    category: string;
    image: string;
}

export interface ICardActions { onClick?: () => void; }

export class CardCatalog extends CardMain {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        if (actions?.onClick) this.container.addEventListener('click', actions.onClick);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        const css = categoryMap[value as keyof typeof categoryMap] ?? categoryMap['другое'];
        this.categoryElement.className = `card__category ${css}`;
    }

    set image(value: string) {
        this.setImage(this.imageElement, `${CDN_URL}/${value}`, this.titleElement.textContent ?? '');
    }

    set price(value: number | null) {
        this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }
}