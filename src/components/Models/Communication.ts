import { IApi, IOrder, IOrderResponse, IResponseItems } from "../../types";

export class Service {
    protected _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    getApi(): Promise<IResponseItems> {
        return this._api.get<IResponseItems>('/product/');
    }

    postApi(data: IOrder): Promise<IOrderResponse> {
        return this._api.post<IOrderResponse>('/order/', data);
    }
}