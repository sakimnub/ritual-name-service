const hre = require("hardhat");

async function main() {
  console.log("Deploying RNS to Ritual Chain...");

  const RNS = await hre.ethers.getContractFactory("RNS");
  const rns = await RNS.deploy();

  await rns.waitForDeployment();
  const address = await rns.getAddress();

  console.log(`✅ RNS Smart Contract deployed to: ${address}`);
  console.log(`Explore the transaction on: ${process.env.EXPLORER_URL}/address/${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
