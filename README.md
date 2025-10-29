# Wing - Decentralized Tipping Platform on Solana

<p align="center">
  <img src="./wing/public/logo.svg" alt="Wing Logo" width="200"/>
</p>

<p align="center">
  <strong>A decentralized tipping platform built on Solana blockchain</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 🌟 Features

- **Decentralized Tipping**: Send tips to creators using their unique Wing address
- **Multi-Token Support**: Support for various SPL tokens
- **User Profiles**: Create and manage your creator profile
- **Transaction History**: Track all your sent and received tips
- **Withdrawal System**: Easy withdrawal of received tips to your wallet
- **Dashboard Analytics**: Visualize your tipping activity with charts
- **Secure & Trustless**: Built on Solana blockchain with Anchor framework

## 🚀 Tech Stack

### Smart Contract
- **Anchor Framework** - Solana smart contract development
- **Rust** - Smart contract language
- **Solana** - Layer 1 blockchain

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Styling
- **Solana Wallet Adapter** - Wallet integration
- **Bun** - Fast JavaScript runtime and package manager

## 📦 Project Structure

```
wing/
├── contract/          # Anchor smart contract
│   ├── programs/     # Rust smart contract code
│   ├── tests/        # Contract tests
│   └── migrations/   # Deployment scripts
└── wing/             # Next.js frontend
    ├── app/          # Next.js app directory
    ├── components/   # React components
    ├── hook/         # Custom React hooks
    ├── lib/          # Utility functions
    └── utils/        # Helper utilities
```

## 🔗 Deployed Contracts

### Testnet

**v1 Program ID:** 
```
AwYxen6oaiLQk2VjPkw7CGUupKWCFkAFALGgw1LdxmA5
```

**v2 Program ID:** 
```
HKvDpbKfjDmyAwKayc4hewRZdMBgdLKVXgNpLFzfjEn9
```

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ or Bun
- Rust & Cargo
- Solana CLI
- Anchor CLI
- Git

### Environment Setup

#### macOS

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Add Solana to PATH (add to ~/.zshrc or ~/.bash_profile)
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Install Bun (optional, faster than npm)
curl -fsSL https://bun.sh/install | bash

# Verify installations
solana --version
anchor --version
rustc --version
```

#### Ubuntu/Debian Linux

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y build-essential libssl-dev libudev-dev pkg-config

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Add Solana to PATH (add to ~/.bashrc)
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Install Bun (optional)
curl -fsSL https://bun.sh/install | bash

# Verify installations
solana --version
anchor --version
rustc --version
```

#### Windows (WSL - Windows Subsystem for Linux)

```bash
# Install WSL2 (PowerShell as Administrator)
wsl --install

# After restart, open Ubuntu from Start Menu
# Then follow Ubuntu instructions above

# Or manually:
# 1. Enable WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 2. Enable Virtual Machine Platform
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 3. Download and install WSL2 kernel update
# https://aka.ms/wsl2kernel

# 4. Set WSL2 as default
wsl --set-default-version 2

# 5. Install Ubuntu from Microsoft Store

# 6. Open Ubuntu terminal and follow Ubuntu setup instructions above
```

---

## 📥 Clone & Install

### 1. Clone the Repository

```bash
git clone https://github.com/Nikuunj/Wing.git
cd Wing
```

### 2. Setup Smart Contract

```bash
cd contract

# Install dependencies
yarn install
# or
npm install

# Build the contract
anchor build

# Generate TypeScript types
anchor build --idl anchor-idl

# Run tests (optional)
anchor test
```

### 3. Setup Frontend

```bash
cd ../wing

# Install dependencies (choose one)
bun install
# or
npm install
# or
yarn install

```

---

## 🚀 Running Locally

### Start Local Solana Validator (Optional for Local Testing)

```bash
# In contract directory
cd contract

# Start local validator
solana-test-validator

# In a new terminal, deploy locally
anchor deploy
```

### Run Frontend Development Server

```bash
cd wing

# Using Bun (recommended)
bun dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

Visit `http://localhost:3000` in your browser.

---

## 🏗️ Building for Production

### Build Smart Contract

```bash
cd contract
anchor build
```

### Build Frontend

```bash
cd wing

# Using Bun
bun run build

# Using npm
npm run build

# Start production server
bun start
# or
npm start
```

---

## 🌐 Deployment

### Deploy Smart Contract

```bash
cd contract

# Configure Solana CLI for desired network
solana config set --url devnet  # or testnet/mainnet-beta

# Create/set your wallet
solana-keygen new -o ~/.config/solana/id.json
solana config set --keypair ~/.config/solana/id.json

# Airdrop SOL for testing (devnet only)
solana airdrop 2

# Deploy
anchor deploy

# Note your Program ID from output
```

---

## 📖 Usage

### For Creators

1. **Connect Wallet** - Connect your Solana wallet
2. **Create Profile** - Set up your creator profile with username and bio
3. **Share Your Link** - Share your Wing address (`wing.app/w/[your-address]`)
4. **Receive Tips** - Accept tips in various tokens
5. **Withdraw** - Withdraw your earnings anytime

### For Supporters

1. **Connect Wallet** - Connect your Solana wallet
2. **Find Creator** - Navigate to a creator's Wing page
3. **Select Token & Amount** - Choose token and tip amount
4. **Send Tip** - Confirm transaction in your wallet
5. **View History** - Check your tipping history in dashboard

---

## 🧪 Testing

### Smart Contract Tests

```bash
cd contract
anchor test
```

### Frontend Tests (if configured)

```bash
cd wing
bun test
# or
npm test
```

---

## 📁 Key Files

- `contract/programs/contract/src/lib.rs` - Main smart contract logic
- `wing/app/page.tsx` - Homepage
- `wing/components/send/SendForm.tsx` - Tipping interface
- `wing/hook/useProgram.ts` - Anchor program integration
- `wing/anchor-idl/contract.ts` - Generated TypeScript types

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔒 Security

See [SECURITY.md](SECURITY.md) for security policies and reporting vulnerabilities.

---

## 📧 Contact & Support

- **GitHub**: [@Nikuunj](https://github.com/Nikuunj)
- **Issues**: [GitHub Issues](https://github.com/Nikuunj/Wing/issues)

---

## 🙏 Acknowledgments

- Solana Foundation
- Anchor Framework Team
- Next.js Team
- Open Source Community

---

<p align="center">Made with ❤️ by the Wing Team</p>
