import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
    protected _items: IProduct[] = [];
    protected _currentProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]) {
        this._items = items;
        this.events.emit('products:loaded', this._items);
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getProductId(id: string) {
        return this._items.find(item => item.id === id);
    }

    setProduct(item: IProduct) {
        this._currentProduct = item;
        this.events.emit('products:select', item);
    }

    getProduct() {
        return this._currentProduct;
    }
}