# Blockchain

A collection of blockchain implementations in TypeScript demonstrating different consensus mechanisms and DeFi concepts.

## Features

- **Proof of Work (PoW) Implementation**

    - Block creation and mining
    - Transaction handling
    - Wallet management
    - Cryptographic security using SHA-256

- **Proof of Stake (PoS) Implementation**

    - Stake-based block validation
    - Validator selection
    - Stake management
    - Energy-efficient consensus

- **Liquidity Pool Implementation**
    - Automated Market Maker (AMM) functionality
    - Token swapping
    - Liquidity provision
    - Price calculation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TypeScript

## Installation

```bash
# Clone the repository
git clone https://github.com/constantimi/blockchain.git

# Install dependencies
npm install
```

## Usage

### Development

```bash
# Compile TypeScript files
npm run build

# Run the application
npm run start

# Run in development mode with watch
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run specific test files
npm test tests/blockchain-pow.test.ts
npm test tests/blockchain-pos.test.ts
npm test tests/blockchain-liquidity-pool.test.ts
```

### Examples

```bash
# Run Proof of Work example
npm run example:pow

# Run Proof of Stake example
npm run example:pos

# Run Liquidity Pool example
npm run example:liquidity
```

## Implementation Details

### Proof of Work (PoW)

- Implements a basic blockchain with PoW consensus
- Features transaction handling and wallet management
- Uses SHA-256 for cryptographic security
- Includes mining mechanism with adjustable difficulty

### Proof of Stake (PoS)

- Demonstrates stake-based consensus mechanism
- Implements validator selection based on stake
- Features stake management and rewards
- More energy-efficient than PoW

### Liquidity Pool

- Implements basic AMM functionality
- Supports token swapping
- Includes liquidity provision mechanism
- Features price calculation based on constant product formula

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Before submitting, please:

1. Run the tests: `npm test`
2. Check code style: `npm run lint`
3. Format code: `npm run format`

## Resources

- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Blockchain Basics](https://www.investopedia.com/terms/b/blockchain.asp)
- [Consensus Mechanisms](https://academy.binance.com/en/articles/proof-of-work-pow-vs-proof-of-stake-pos)

## Repository Activity

![Alt](https://repobeats.axiom.co/api/embed/99f9886a1aa4fbeffd4d0ba91ad125614e45abe1.svg 'Repobeats analytics image')
