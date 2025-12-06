import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
    protected _items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getItems(): IProduct[] {
        return this._items;
    }

    addProduct(item: IProduct) {
        if (!this.checkProduct(item.id)) {
            this._items.push(item);
            this.events.emit('basket:change', this._items);
        }
    }

    deleteProduct(id: string) {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit('basket:change', this._items);        
    }

    emptyTrash(): void {
        this._items = [];
        this.events.emit('basket:change', this._items); 
    }

    getPriceItems(): number {
        return this._items.reduce((previousValue, item) => previousValue + (item.price ?? 0), 0);
    }

    getCountItems(): number {
        return this._items.length;
    }

    checkProduct(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}