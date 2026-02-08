const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { registerMultipleENS, formatENSName } = require("./ens-utils");

/**
 * Deployment script for Community and CommunityTreasury contracts
 * Creates the main treasury and individual community contracts
 * Then registers ENS names for each community
 */
async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 Starting Contract Deployment...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Get the deployer signer
  const [deployer] = await hre.ethers.getSigners();
  console.log(`\n👤 Deployer Address: ${deployer.address}`);

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log(`🌐 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // The communities to deploy (from frontend/lib/communities.ts)
  const communitiesToDeploy = [
    { name: "Kathmandu Flood Relief", id: "kathmandu-flood" },
    { name: "Terai Heatwave Protection", id: "terai-heatwave" },
    { name: "Urban Poverty Safety Net", id: "urban-poverty" },
    { name: "Agricultural Drought Relief", id: "agriculture-drought" },
  ];

  // ===========================
  // Step 1: Deploy CommunityTreasury
  // ===========================
  console.log("\n" + "━".repeat(70));
  console.log("📦 Step 1: Deploying CommunityTreasury Contract");
  console.log("━".repeat(70));

  const CommunityTreasury = await hre.ethers.getContractFactory(
    "CommunityTreasury"
  );
  const treasury = await CommunityTreasury.deploy();
  await treasury.waitForDeployment();

  const treasuryAddress = await treasury.getAddress();
  console.log(`✅ CommunityTreasury deployed at: ${treasuryAddress}`);

  // ===========================
  // Step 2: Deploy Communities
  // ===========================
  console.log("\n" + "━".repeat(70));
  console.log("🏘️  Step 2: Creating Community Contracts");
  console.log("━".repeat(70));

  const deployedCommunities = [];

  for (const community of communitiesToDeploy) {
    console.log(`\n  Creating "${community.name}"...`);
    const tx = await treasury.createCommunity(community.name);
    const receipt = await tx.wait();

    const communityAddress = await treasury.getCommunityContract(
      community.name
    );
    console.log(`  ✅ Community created at: ${communityAddress}`);

    const ensName = formatENSName(community.name);

    deployedCommunities.push({
      id: community.id,
      name: community.name,
      contractAddress: communityAddress,
      ensName: ensName,
      createdAt: new Date().toISOString(),
    });
  }

  // ===========================
  // Step 3: Register ENS Names (Optional)
  // ===========================
  console.log("\n" + "━".repeat(70));
  console.log("🔤 Step 3: Registering ENS Names");
  console.log("━".repeat(70));

  try {
    const ensResults = await registerMultipleENS(
      deployer,
      deployedCommunities.map((c) => ({
        name: c.name,
        address: c.contractAddress,
      })),
      "baseSepolia"
    );

    // Update deployment results with ENS registration status
    deployedCommunities.forEach((community, index) => {
      community.ensRegistration = ensResults[index];
    });
  } catch (error) {
    console.warn(`⚠️  ENS registration skipped: ${error.message}`);
    console.log(
      "   Note: You can register ENS names manually later using setupENS.js"
    );
  }

  // ===========================
  // Step 4: Save Deployment Results
  // ===========================
  console.log("\n" + "━".repeat(70));
  console.log("💾 Step 4: Saving Deployment Results");
  console.log("━".repeat(70));

  const deploymentData = {
    network: {
      name: network.name,
      chainId: network.chainId,
      deployer: deployer.address,
      deploymentDate: new Date().toISOString(),
    },
    treasury: {
      address: treasuryAddress,
      deploymentTx: treasury.deploymentTransaction()?.hash || "N/A",
    },
    communities: deployedCommunities,
  };

  // Save to deployments directory
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const timestampedFilename = `deployment-${Date.now()}.json`;
  const deploymentFile = path.join(deploymentsDir, timestampedFilename);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));

  // Also save as latest.json for easy reference
  const latestFile = path.join(deploymentsDir, "latest.json");
  fs.writeFileSync(latestFile, JSON.stringify(deploymentData, null, 2));

  console.log(`✅ Deployment data saved to: ${timestampedFilename}`);
  console.log(`✅ Latest deployment saved to: latest.json`);

  // ===========================
  // Step 5: Display Summary
  // ===========================
  console.log("\n" + "━".repeat(70));
  console.log("📊 DEPLOYMENT SUMMARY");
  console.log("━".repeat(70));

  console.log(`\n🏛️  CommunityTreasury Address:`);
  console.log(`   ${treasuryAddress}`);

  console.log(`\n🏘️  Community Contracts:`);
  deployedCommunities.forEach((community, index) => {
    console.log(`\n   ${index + 1}. ${community.name}`);
    console.log(`      Contract:    ${community.contractAddress}`);
    console.log(`      ENS Name:    ${community.ensName}`);
  });

  // ===========================
  // Step 6: Frontend Update Instructions
  // ===========================
  console.log("\n" + "━".repeat(70));
  console.log("🔄 NEXT STEPS: Update Frontend");
  console.log("━".repeat(70));

  console.log(
    `\n📋 Update frontend/lib/communities.ts with the following data:\n`
  );
  console.log("```typescript");
  console.log('interface Community {');
  console.log('  id: string;');
  console.log('  name: string;');
  console.log('  description: string;');
  console.log('  walletAddress: string;');
  console.log('  contractAddress: string;  // ADD THIS');
  console.log('  ensName: string;          // ADD THIS');
  console.log('  currentFunding: number;');
  console.log('  targetFunding: number;');
  console.log('  region: string;');
  console.log('  hazardType: string;');
  console.log('  beneficiaries: number;');
  console.log('  logo?: string;');
  console.log("}");
  console.log("```");

  console.log(
    `\nUpdate each community object in the communities array with:\n`
  );

  deployedCommunities.forEach((community) => {
    console.log(`// ${community.name}`);
    console.log(`  contractAddress: "${community.contractAddress}",`);
    console.log(`  ensName: "${community.ensName}",`);
  });

  console.log("\n" + "━".repeat(70));
  console.log("✨ Deployment Complete!");
  console.log("━".repeat(70) + "\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
