import {
  Shield,
  Users,
  Zap,
  User,
  LayoutDashboard,
  Clock,
  MessageSquare,
  Send,
  Banknote
} from 'lucide-react'

export const why = [
  {
    title: 'No KYC Required',
    text: 'Start receiving tips immediately without verification. Your privacy, your choice.',
    logo: Shield
  },
  {
    title: 'Instant Transfers',
    text: 'Lightning-fast transactions powered by Solana. Support reaches creators in seconds.',
    logo: Zap
  },
  {
    title: 'No Middleman',
    text: 'Direct peer-to-peer tipping. 100% of the support goes to creators.',
    logo: Users
  },
]

export const howitwork = [
  {
    title: 'Connect Wallet',
    text: 'Link your Solana wallet to get started instantly'
  },
  {
    title: 'Send SOL',
    text: 'Support your favorite creators with any amount'
  },
  {
    title: 'Instant Delivery',
    text: 'Creators receive funds directly in seconds'
  }
]

export const feature = [
  {
    title: 'On-Chain Messages',
    text: 'Send messages with every tip. Each message is permanently stored on-chain, ensuring transparency.'
  },
  {
    title: 'On-Chain Profiles',
    text: 'Create and own your profile directly on the Solana blockchain — fully decentralized and secure.'
  },
  {
    title: 'Instant Withdrawals',
    text: 'Withdraw your funds anytime, instantly. No delays, full freedom.'
  },

  {
    title: 'Zero Fees',
    text: 'Keep 100% of your earnings. No platform charges, ever.'
  },
  {
    title: 'Full Ownership',
    text: 'You control your identity, data, and funds — completely trustless.'
  },
  {
    title: 'Fully Decentralized',
    text: 'Built on Solana, ensuring trustless interactions and seamless blockchain performance.'
  },
]

export const navbarLink = [
  {
    title: 'Profile',
    to: '/profile',
    icon: User
  },
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'History',
    to: '',
    icon: Clock
  },
  {
    title: 'Messages',
    to: '/messages',
    icon: MessageSquare
  },
  {
    title: 'Send Assets',
    to: '',
    icon: Send
  },
  {
    title: 'Withdraw',
    to: '/withdraw',
    icon: Banknote
  }
];

export const mint = [
  {
    symbol: 'SOL',
    address: ''
  },
  {
    symbol: 'USDC',
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
  },
  {
    symbol: 'USDT',
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'
  },
  {
    symbol: 'ORCA',
    address: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE'
  },
  {
    symbol: 'JPL',
    address: '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4'
  },
  {
    symbol: 'TRUMP',
    address: '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN'
  },
  {
    symbol: 'RAY',
    address: ''
  },
  {
    symbol: 'USDT',
    address: ''
  },
  {
    symbol: 'USDT',
    address: ''
  },
  {
    symbol: 'BONK',
    address: ''
  },
]
