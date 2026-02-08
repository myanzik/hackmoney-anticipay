const hre = require("hardhat");
const { registerENSReverseRecord, formatENSName } = require("./ens-utils");

/**
 * Optional script to manually register ENS names for community contracts
 * Use this if automatic ENS registration failed during deployment
 *
 * Usage:
 *   npx hardhat run scripts/setupENS.js --network baseSepolia
 */

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔤 Manual ENS Registration Script");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Community contracts to register ENS for
  // UPDATE THESE WITH YOUR DEPLOYED ADDRESSES
  const communityContracts = [
    {
      name: "Kathmandu Flood Relief",
      address: "0x0000000000000000000000000000000000000000", // TODO: Update
    },
    {
      name: "Terai Heatwave Protection",
      address: "0x0000000000000000000000000000000000000000", // TODO: Update
    },
    {
      name: "Urban Poverty Safety Net",
      address: "0x0000000000000000000000000000000000000000", // TODO: Update
    },
    {
      name: "Agricultural Drought Relief",
      address: "0x0000000000000000000000000000000000000000", // TODO: Update
    },
  ];

  console.log(`\n👤 Registrar: ${deployer.address}`);

  // Validate all addresses are not placeholders
  const hasPlaceholders = communityContracts.some(
    (c) => c.address === "0x0000000000000000000000000000000000000000"
  );

  if (hasPlaceholders) {
    console.error(
      "\n❌ ERROR: Please update community contract addresses in this script!"
    );
    console.error("   Replace all 0x0000000000000000000000000000000000000000 with actual addresses");
    process.exit(1);
  }

  console.log("\n🔤 Registering ENS names...\n");

  for (const community of communityContracts) {
    const ensName = formatENSName(community.name);
    console.log(`   ${community.name}`);
    console.log(`   → ${community.address}`);
    console.log(`   → ${ensName}`);

    const result = await registerENSReverseRecord(
      deployer,
      community.address,
      ensName,
      "baseSepolia"
    );

    if (result.success) {
      console.log(`   ✅ Registered!\n`);
    } else {
      console.log(`   ❌ Failed: ${result.error}\n`);
    }
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✨ ENS registration complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
