export interface Community {
  id: string;
  name: string;
  description: string;
  walletAddress: string;
  contractAddress: string; // Community contract address on Base Sepolia
  ensName: string; // ENS name for the community contract
  currentFunding: number; // in wei
  targetFunding: number; // in wei
  region: string;
  hazardType: string;
  beneficiaries: number;
  logo?: string;
}

export const communities: Community[] = [
  {
    id: "1",
    name: "Kathmandu Flood Relief",
    description: "Supporting communities vulnerable to monsoon floods in Kathmandu Valley. This fund provides anticipatory cash assistance to families during flood seasons.",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    contractAddress: "0xd9eEDd9838d6328cF16e20a4C536d57b257eaa85",
    ensName: "kathmandu-flood-relief.eth",
    currentFunding: 50000000000000000000, // 50 ETH in wei
    targetFunding: 500000000000000000000, // 500 ETH in wei
    region: "Kathmandu, Nepal",
    hazardType: "Flood",
    beneficiaries: 250,
    logo: "🌊"
  },
  {
    id: "2",
    name: "Terai Heatwave Protection",
    description: "Emergency cash transfers during extreme heat events in the Terai plains. Provides cooling support and emergency supplies for vulnerable populations.",
    walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    contractAddress: "0x3DE282515AC8148184077a062c84995d9Af4A43D",
    ensName: "terai-heatwave-protection.eth",
    currentFunding: 25000000000000000000, // 25 ETH in wei
    targetFunding: 300000000000000000000, // 300 ETH in wei
    region: "Terai, Nepal",
    hazardType: "Heatwave",
    beneficiaries: 180,
    logo: "🔥"
  },
  {
    id: "3",
    name: "Urban Poverty Safety Net",
    description: "Basic income streaming for urban low-income households to build financial resilience and enable income-generating opportunities.",
    walletAddress: "0x1234567890abcdef12345678901abcdef1234567",
    contractAddress: "0xEb89746EE177E04251d7CDf8917E4C71aD6f361E",
    ensName: "urban-poverty-safety-net.eth",
    currentFunding: 40000000000000000000, // 40 ETH in wei
    targetFunding: 350000000000000000000, // 350 ETH in wei
    region: "Lalitpur, Nepal",
    hazardType: "Poverty",
    beneficiaries: 320,
    logo: "🏙️"
  },
  {
    id: "4",
    name: "Agricultural Drought Relief",
    description: "Anticipatory support for farming communities during drought seasons. Helps farmers manage crop failures and maintain livelihoods.",
    walletAddress: "0x567890abcdef1234567890abcdef1234567890ab",
    contractAddress: "0x332db07dE59c532e76C86be94943710B63C96EA3",
    ensName: "agricultural-drought-relief.eth",
    currentFunding: 20000000000000000000, // 20 ETH in wei
    targetFunding: 280000000000000000000, // 280 ETH in wei
    region: "Sindhuli, Janakpur",
    hazardType: "Drought",
    beneficiaries: 200,
    logo: "🌾"
  },
];
