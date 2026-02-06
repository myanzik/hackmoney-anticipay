export interface Community {
  id: string;
  name: string;
  description: string;
  walletAddress: string;
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
    currentFunding: 25000000000000000000, // 25 ETH in wei
    targetFunding: 300000000000000000000, // 300 ETH in wei
    region: "Terai, Nepal",
    hazardType: "Heatwave",
    beneficiaries: 180,
    logo: "🔥"
  },
  {
    id: "3",
    name: "Mountain Landslide Response",
    description: "Disaster relief streaming for mountain communities at risk of landslides during monsoon season. Supports evacuation and recovery assistance.",
    walletAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
    currentFunding: 15000000000000000000, // 15 ETH in wei
    targetFunding: 250000000000000000000, // 250 ETH in wei
    region: "Ilam, Panchthar, Nepal",
    hazardType: "Landslide",
    beneficiaries: 150,
    logo: "⛰️"
  },
  {
    id: "4",
    name: "Refugee Camp Assistance",
    description: "Continuous UBI streaming for refugee populations providing dignified, predictable financial support for essential needs.",
    walletAddress: "0xdef1234567890abcdef1234567890abcdef12345",
    currentFunding: 35000000000000000000, // 35 ETH in wei
    targetFunding: 400000000000000000000, // 400 ETH in wei
    region: "Multiple camps across Nepal",
    hazardType: "Displacement",
    beneficiaries: 500,
    logo: "🏕️"
  },
  {
    id: "5",
    name: "Urban Poverty Safety Net",
    description: "Basic income streaming for urban low-income households to build financial resilience and enable income-generating opportunities.",
    walletAddress: "0x1234567890abcdef12345678901abcdef1234567",
    currentFunding: 40000000000000000000, // 40 ETH in wei
    targetFunding: 350000000000000000000, // 350 ETH in wei
    region: "Lalitpur, Nepal",
    hazardType: "Poverty",
    beneficiaries: 320,
    logo: "🏙️"
  },
  {
    id: "6",
    name: "Agricultural Drought Relief",
    description: "Anticipatory support for farming communities during drought seasons. Helps farmers manage crop failures and maintain livelihoods.",
    walletAddress: "0x567890abcdef1234567890abcdef1234567890ab",
    currentFunding: 20000000000000000000, // 20 ETH in wei
    targetFunding: 280000000000000000000, // 280 ETH in wei
    region: "Sindhuli, Janakpur",
    hazardType: "Drought",
    beneficiaries: 200,
    logo: "🌾"
  },
];
