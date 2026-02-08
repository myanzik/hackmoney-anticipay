const ethers = require("ethers");

/**
 * ENS Registry interface for Base Sepolia
 */
const ENS_REGISTRY_ABI = [
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
    name: "resolver",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "node", type: "bytes32" },
      { internalType: "address", name: "resolver", type: "address" },
    ],
    name: "setResolver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

/**
 * Reverse Registrar interface (for setting reverse record)
 */
const REVERSE_REGISTRAR_ABI = [
  {
    inputs: [{ internalType: "string", name: "name", type: "string" }],
    name: "setName",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

/**
 * Resolver interface (basic minimal interface for public resolver)
 */
const RESOLVER_ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "node", type: "bytes32" },
      { internalType: "address", name: "a", type: "address" },
    ],
    name: "setAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

/**
 * Base Sepolia ENS configuration
 * Note: Base Sepolia has limited ENS infrastructure. This script demonstrates
 * the approach, but you may need to use a sidecar service or custom ENS setup.
 */
const ENS_CONFIG = {
  baseSepolia: {
    ensRegistry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", // Standard ENS registry
    publicResolver: "0x8FADE5041B8357cd85B472921CdAF38B7e68600e", // Public resolver on Base Sepolia
    reverseRegistrar: "0x084b1c3C81545d370f3634392De611CaeBF02924", // Reverse registrar
    tld: "eth",
  },
};

/**
 * Generate a namehash for ENS domain
 * @param {string} name - The ENS name (e.g., "community-name.eth")
 * @returns {string} The namehash as a bytes32 hex string
 */
function namehash(name) {
  let node = ethers.ZeroHash;
  if (name !== "") {
    const labels = name.split(".");
    for (let i = labels.length - 1; i >= 0; i--) {
      const labelHash = ethers.id(labels[i]);
      node = ethers.solidityPacked(
        ["bytes32", "bytes32"],
        [node, labelHash]
      );
      node = ethers.keccak256(node);
    }
  }
  return node;
}

/**
 * Register an ENS name for a contract address (reverse record)
 * This function sets up a reverse record so that an address resolves to a name
 *
 * @param {ethers.Signer} signer - The signer to use for the transaction
 * @param {string} contractAddress - The address to register
 * @param {string} ensName - The ENS name (e.g., "kathmandu-flood-relief.eth")
 * @param {string} networkName - The network name (e.g., "baseSepolia")
 * @returns {Promise<object>} Transaction receipt and ENS details
 */
async function registerENSReverseRecord(
  signer,
  contractAddress,
  ensName,
  networkName = "baseSepolia"
) {
  try {
    const config = ENS_CONFIG[networkName];
    if (!config) {
      throw new Error(`Unsupported network: ${networkName}`);
    }

    console.log(`\n📝 Registering ENS reverse record for ${contractAddress}`);
    console.log(`   ENS Name: ${ensName}`);

    // Connect to reverse registrar
    const reverseRegistrar = new ethers.Contract(
      config.reverseRegistrar,
      REVERSE_REGISTRAR_ABI,
      signer
    );

    // Set the reverse record
    console.log(`   Setting reverse record...`);
    const tx = await reverseRegistrar.setName(ensName);
    const receipt = await tx.wait();

    console.log(`   ✅ ENS reverse record set! (tx: ${receipt.transactionHash})`);

    return {
      success: true,
      ensName,
      contractAddress,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error(`❌ Failed to register ENS: ${error.message}`);
    return {
      success: false,
      ensName,
      contractAddress,
      error: error.message,
    };
  }
}

/**
 * Setup ENS configurations for multiple contracts
 * This is a convenience function for batch registration
 *
 * @param {ethers.Signer} signer - The signer to use for transactions
 * @param {array} communities - Array of {name, address} objects
 * @param {string} networkName - The network name
 * @returns {Promise<array>} Array of registration results
 */
async function registerMultipleENS(signer, communities, networkName = "baseSepolia") {
  const results = [];

  for (const community of communities) {
    // Convert community name to ENS format: "Kathmandu Flood Relief" -> "kathmandu-flood-relief"
    const ensLabel = community.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const ensName = `${ensLabel}.eth`;

    const result = await registerENSReverseRecord(
      signer,
      community.address,
      ensName,
      networkName
    );
    results.push(result);

    // Small delay between registrations to avoid issues
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
}

/**
 * Format ENS name from community name
 * @param {string} communityName - The community name
 * @returns {string} The formatted ENS name
 */
function formatENSName(communityName) {
  return (
    communityName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") + ".eth"
  );
}

module.exports = {
  namehash,
  registerENSReverseRecord,
  registerMultipleENS,
  formatENSName,
  ENS_CONFIG,
};
