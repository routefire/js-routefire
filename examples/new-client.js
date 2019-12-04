const Routefire = require("../index")

// @dev update this line before running tests
const rfClient = new Routefire("<your-routefire-username>", "<your-routefire-password>")

// ensuring you entered your username
const username = rfClient.getUsername()
console.log("Your username ", username)

const testRun = async () => {

  // getting balances
  bals = await rfClient.getBalances("BTC")
  console.log("BTC BALANCE: ", bals)

  // submitting an order
  algoParams = {
    "target_seconds": "100",
    "backfill":       "1.0",
    "aggression":     "0.0",
  }
  
  order = await rfClient.submitOrder("btc", "usd", "0.003", "", "rfxw", algoParams)
  console.log("ORDER: ", order)

  // get order status
  status = await rfClient.getOrderStatus(order['order_id'])
  console.log("ORDER STATUS: ", status)

  // cancel order
  orderCancellatiton = await rfClient.cancelOrder(order['order_id'])
  console.log("ORDER CANCELLATION: ", orderCancellatiton)
};

testRun()


