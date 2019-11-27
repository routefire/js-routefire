const axios = require("axios");
const _ = require("lodash");

class RoutefireClient {
    constructor(username, password, apiUrl = "https://routefire.io", apiVersion = "v1") {
        const instance = axios.create({
            baseURL: apiUrl,
            timeout: 1000,
            headers: {'Content-Type': 'application/json'}
        });

        this.username = username;
        this.password = password;
        this.apiUrl = apiUrl;
        this.apiVersion = apiVersion;
        this.token = "";
        this.client = instance
    }

    getUsername() {
        return this.username
    }

    async refreshToken() {
        const body = {
            "uid": this.username,
            "password": this.password
        };

        const res = await this.client.post("/authenticate", body).then((res) => {
            return res.data
        }).catch((err) => {
            return err
        });

        this.token = _.get(res, ["token"]);

        return this.token
    }

    async doPostRequest(url, body) {
        await this.refreshToken();

        const res = await this.client.post(url, body, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.token}`
            }
        }).then((res) => {
            return res.data
        }).catch((err) => {
            return err
        });

        return res
    }

    // Function SubmitOrder submits a Routefire (algorithm) order.
    async submitOrder(buyAsset, sellAsset, quantity, price, algo, algoParams) {
        /*
        venue - GDAX, CBPRO, GEMINI, see routefire api docs for full list https://routefire.io/dev
        baseAsset - BTC, USD, see routefire api docs for full list https://routefire.io/dev
        asset - BTC, USD, see routefire api docs for full list https://routefire.io/dev
        ...
        */

        const body = {
            "user_id":     this.username,
            "buy_asset":   buyAsset,
            "sell_asset":  sellAsset,
            "quantity":    quantity,
            "price":       price,
            "algo":        algo,
            "algo_params": algoParams,
        };

        const resp = await this.doPostRequest("/orders/submit", body);
        return resp
    }

    // Function GetOrderStatus gets the current status of a Routefire (algorithm) order,
    // to include amount filled and order open/closed flag.
    async getOrderStatus(orderId) {
        const body = {
            "user_id":  this.username,
            "order_id": orderId,
        }

        const resp = await this.doPostRequest("/orders/status", body)
        return resp
    }

    // Function CancelOrder cancels a Routefire (algorithm) order.
    async cancelOrder(orderId) {
        const body = {
            "user_id":  this.username,
            "order_id": orderId,
        }

        const resp = await this.doPostRequest("/orders/cancel", body)
        return resp
    }

    // Function GetBalances gets the balances at each available trading venue for
    // a given uid.
    async getBalances(asset) {
        const body = {
            "uid":   this.username,
            "asset": asset,
        }

        const resp = await this.doPostRequest("/data/balances", body);
        return resp
    }


    // Function SubmitOrderDMA submits a DMA (direct market access) order -- that is, an
    // order submitted directly to a given trading venue.
    submitOrderDMA(asset, baseAsset, side, quantity, price, orderParams) {
        /*
        venue - GDAX, CBPRO, GEMINI, see routefire api docs for full list https://routefire.io/dev
        baseAsset - BTC, USD, see routefire api docs for full list https://routefire.io/dev
        asset - BTC, USD, see routefire api docs for full list https://routefire.io/dev
        ...
        */
    }
}

module.exports = RoutefireClient
