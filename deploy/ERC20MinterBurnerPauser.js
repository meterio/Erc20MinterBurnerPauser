
module.exports = async function ({ ethers: { getNamedSigner }, getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const chainId = await getChainId()

  let name = '';
  let symbol = '';
  let decimal = 0;

  console.log("CHAIN ID: ", chainId)
  if (chainId === '82') {
    // metermain
    name = 'ERC20 MTRG Implementation';
    symbol = 'ERC20MTRG';
    decimal = 18;

  } else if (chainId === '83') {
    // metertest
    name = 'ERC20 MTRG Test Implementation';
    symbol = 'ERC20MTRGTEST';
    decimal = 18;

  } else {
    throw Error("No Info for MeterMaker!")
  }

  await deploy("ERC20MinterBurnerPauser", {
    from: deployer,
    args: [name, symbol, decimal],
    log: true,
    deterministicDeployment: false
  })

  const erc20 = await ethers.getContract("ERC20MinterBurnerPauser")
  console.log(erc20)
}

module.exports.tags = ["ERC20MinterBurnerPauser"]
