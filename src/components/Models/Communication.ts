import { IApi, IOrder, IProduct } from "../../types";

export class Service {
    protected _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    getApi(): Promise<IProduct[]> {
        return this._api.get<IProduct[]>('/product/')
            .then((response) => response)
    }

    postApi(data: IOrder) {
        this._api.post('/order/', data);
    }
}