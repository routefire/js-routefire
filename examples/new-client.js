const Routefire = require("../index")

// const rfClient = new Routefire("<your-routefire-user>", "<your-routefire-password>")

const username = rfClient.getUsername()

console.log("username ", username)

const testRun = async () => {
  const res = await rfClient.refreshToken()

  console.log("res ", res);
};

testRun()


