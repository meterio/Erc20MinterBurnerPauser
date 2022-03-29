
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

  const maker = await ethers.getContract("ERC20MinterBurnerPauser")
  if (await maker.owner() !== dev) {
    console.log("Setting maker owner")
    await (await maker.transferOwnership(dev, true, false)).wait()
  }
}

module.exports.tags = ["ERC20MinterBurnerPauser"]
