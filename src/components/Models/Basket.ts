import { IProduct } from "../../types";

export class Basket {
    protected _items: IProduct[] = [];

    getItems(): IProduct[] {
        return this._items;
    }

    addProduct(item: IProduct) {
        if (!this.checkProduct(item.id)) {
            this._items.push(item);
        }
    }

    deleteProduct(id: string) {
        this._items = this._items.filter(item => item.id !== id);
    }

    emptyTrash(): void {
        this._items = [];
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