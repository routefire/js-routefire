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
                // 'content-type': 'application/x-www-form-urlencoded',
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

        const resp = await this.doPostRequest("/api/v1/orders/submit", body);
        return resp
    }

    // Function GetOrderStatus gets the current status of a Routefire (algorithm) order,
    // to include amount filled and order open/closed flag.
    async getOrderStatus(orderId) {
        const body = {
            "user_id":  this.username,
            "order_id": orderId,
        }

        const resp = await this.doPostRequest("/api/v1/orders/status", body)
        return resp
    }

    // Function CancelOrder cancels a Routefire (algorithm) order.
    async cancelOrder(orderId) {
        const body = {
            "user_id":  this.username,
            "order_id": orderId,
        }

        const resp = await this.doPostRequest("/api/v1/orders/cancel", body)
        return resp
    }

    // Function GetBalances gets the balances at each available trading venue for
    // a given uid.
    async getBalances(asset) {
        const body = {
            "uid":   this.username,
            "asset": asset,
        }

        const resp = await this.doPostRequest("/api/v1/data/balances", body);
        return resp
    }

    // Function GetOrderBookStats fetches key statistics from the order book for a
    // prospective trade. The quantity provided is used to compute the "sweep cost,"
    // or best theoretically available price given available liquidity.
    async getOrderBookStats(buyAsset, sellAsset, quantity) {
        const body = {
            "uid":        this.username,
            "buy_asset":  buyAsset,
            "sell_asset": sellAsset,
            "qty":        quantity,
        }

        const resp = await this.doPostRequest("/api/v1/data/inquire", body);
        return resp
    }

    // Function GetConsolidatedOrderBook fetches the order book for a given pair across exchanges.
    async getConsolidatedOrderBook(buyAsset, sellAsset) {
        const body = {
            "uid":        this.username,
            "buy_asset":  buyAsset,
            "sell_asset": sellAsset,
            "quantity":   "",
        }

        const resp = await this.doPostRequest("/api/v1/data/consolidated", body);
        return resp
    }

    // Function SubmitOrderDMA submits a DMA (direct market access) order -- that is, an
    // order submitted directly to a given trading venue.
    async submitOrderDMA(venue, asset, baseAsset, side, quantity, price, orderParams) {
        /*
        venue - GDAX, CBPRO, GEMINI, see routefire api docs for full list https://routefire.io/dev
        baseAsset - BTC, USD, see routefire api docs for full list https://routefire.io/dev
        asset - BTC, USD, see routefire api docs for full list https://routefire.io/dev
        ...
        */

       const body = {
            "user_id": this.username,
            "venue": venue,
            "side": side,
            "traded_asset": asset,
            "base_asset": baseAsset,
            "quantity": quantity,
            "price": price,
            "order_params": orderParams
        };

        const resp = await this.doPostRequest("/api/v1/orders/new", body);
        return resp
    }

    // Function OrderStatusDMA gets order status and fill amount from a given venue and order ID.
    async orderStatusDMA(venue, venueOrdId) {
        const body = {
            "user_id": this.username,
            "venue": venue,
            "venue_order_id": venueOrdId, 
        };


        const resp = await this.doPostRequest("/api/v1/orders/status", body)
        return resp
    }

    async cancelOrderDMA(venue, venueOrdId) {
        const body = {
            "user_id": this.username,
            "venue": venue,
            "venue_order_id": venueOrdId, 
        };

        const resp = await this.doPostRequest("/api/v1/orders/cancel", body)
        return resp
    }
}

module.exports = RoutefireClient
