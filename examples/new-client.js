const Routefire = require("../index")

// @dev update this line before running tests
const rfClient = new Routefire("<your-routefire-user>", "<your-routefire-password>")

// ensuring you entered your username
const username = rfClient.getUsername()
console.log("Your username ", username)

const testRun = async () => {
  const res = await rfClient.refreshToken()

  console.log("res ", res);
};

testRun()


