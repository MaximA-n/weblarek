import { IProduct } from "../../types";

export class Products {
    protected _items: IProduct[] = [];
    protected _currentProduct: IProduct | null = null;
    
    public setItems(items: IProduct[]) {
        this._items = items;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getProductId(id: string) {
        return this._items.find(item => item.id === id);
    }

    setProduct(item: IProduct) {
        this._currentProduct = item;
    }

    getProduct() {
        return this._currentProduct;
    }
}