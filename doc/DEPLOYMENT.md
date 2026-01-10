# One Clash Fighters - Movement Network Deployment Guide

This guide covers the complete deployment process for One Clash Fighters on Movement Network.

## Prerequisites

### 1. Install Movement CLI

```bash
# Download and install Movement CLI
curl -fsSL https://raw.githubusercontent.com/movementlabsxyz/aptos-core/main/scripts/dev_setup.sh | sh

# Verify installation
movement --version
# or
aptos --version
```

### 2. Create Movement Account

```bash
# Initialize Movement account
movement init

# Or use Aptos CLI
aptos init --network testnet
```

This will create a `.movement` or `.aptos` directory with your account configuration.

### 3. Fund Your Account

For testnet deployment, get testnet tokens from the faucet:

```bash
# Using Movement CLI
movement account fund-with-faucet --account default

# Or visit the web faucet
# https://faucet.testnet.movementlabs.xyz
```

## Smart Contract Deployment

### Step 1: Navigate to Move Directory

```bash
cd move
```

### Step 2: Compile Smart Contracts

```bash
# Compile the Move modules
movement move compile

# Or with Aptos CLI
aptos move compile --named-addresses one_clash_fighters=default
```

Verify that compilation succeeds without errors.

### Step 3: Run Tests

```bash
# Run Move tests
movement move test

# Or with Aptos CLI
aptos move test --named-addresses one_clash_fighters=default
```

### Step 4: Deploy to Movement Testnet

```bash
# Deploy the package
movement move publish --named-addresses one_clash_fighters=default

# Or with Aptos CLI
aptos move publish --named-addresses one_clash_fighters=default
```

**Important:** Save the deployed package address from the output. You'll need it for frontend configuration.

Example output:
```
Package published successfully at address: 0xabcd1234...
```

### Step 5: Verify Deployment

Visit the Movement Explorer to verify your deployment:
- Testnet: https://explorer.movementlabs.xyz/?network=testnet
- Search for your package address
- Verify all three modules are deployed:
  - `fighter_nft`
  - `battle_system`
  - `staking_pool`

## Frontend Configuration

### Step 1: Update Environment Variables

Create or update `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set:

```bash
NEXT_PUBLIC_MOVEMENT_NETWORK=testnet
NEXT_PUBLIC_MOVEMENT_RPC_URL=https://aptos.testnet.movementlabs.xyz/v1
NEXT_PUBLIC_PACKAGE_ADDRESS=0xYOUR_DEPLOYED_ADDRESS  # From deployment step
NEXT_PUBLIC_EXPLORER_URL=https://explorer.movementlabs.xyz
NEXT_PUBLIC_FAUCET_URL=https://faucet.testnet.movementlabs.xyz
```

### Step 2: Install Dependencies

```bash
# Install frontend dependencies
npm install

# This will install:
# - @aptos-labs/wallet-adapter-react
# - @aptos-labs/ts-sdk
# - petra-plugin-wallet-adapter
# - @martianwallet/aptos-wallet-adapter
# - @pontem/wallet-adapter-plugin
```

### Step 3: Build and Test Locally

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

Test the following features:
1. Wallet connection (Petra, Martian, or Pontem)
2. Fighter NFT minting
3. Battle recording
4. Staking functionality
5. Leaderboard display

## Production Deployment

### For Vercel:

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### For Other Platforms:

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Post-Deployment Checklist

- [ ] Smart contracts compiled successfully
- [ ] All tests passing
- [ ] Contracts deployed to Movement testnet
- [ ] Package address saved and configured
- [ ] Frontend connects to correct RPC endpoint
- [ ] Wallet connections working
- [ ] Fighter minting functional
- [ ] Battle recording working
- [ ] Staking pool accessible
- [ ] Events being emitted correctly
- [ ] Explorer links working
- [ ] Faucet accessible for testing

## Mainnet Deployment (When Available)

When Movement mainnet is live:

1. Update `.env.local`:
```bash
NEXT_PUBLIC_MOVEMENT_NETWORK=mainnet
NEXT_PUBLIC_MOVEMENT_RPC_URL=https://mainnet.movementlabs.xyz/v1
```

2. Redeploy smart contracts to mainnet:
```bash
aptos init --network mainnet
aptos move publish --named-addresses one_clash_fighters=default
```

3. Update `NEXT_PUBLIC_PACKAGE_ADDRESS` with new mainnet address

## Troubleshooting

### Common Issues

**1. Compilation Errors**
- Ensure Movement CLI is up to date
- Check Move.toml has correct dependencies
- Verify network in .movement/config.yaml

**2. Deployment Fails**
- Check account has sufficient funds
- Verify named addresses are correct
- Try with increased gas budget

**3. Frontend Connection Issues**
- Verify RPC_URL is correct and accessible
- Check package address is set correctly
- Ensure wallet extension is installed

**4. Transaction Failures**
- Check wallet has sufficient MOVE tokens
- Verify module addresses in function calls
- Check event types match deployed contracts

## Support Resources

- Movement Documentation: https://docs.movementnetwork.xyz/
- Movement Discord: https://discord.gg/movementlabs
- Aptos Move Book: https://aptos.dev/move/move-on-aptos
- GitHub Issues: https://github.com/YOUR_REPO/issues

## Security Considerations

Before mainnet deployment:

1. **Audit Smart Contracts**: Have contracts professionally audited
2. **Test Extensively**: Run comprehensive tests on testnet
3. **Monitor Events**: Set up event monitoring
4. **Access Controls**: Verify admin functions are protected
5. **Error Handling**: Ensure all error cases are handled
6. **Rate Limiting**: Consider implementing rate limits
7. **Economic Security**: Review tokenomics and prize distribution

## Next Steps

After successful deployment:

1. Create demo video showcasing features
2. Document testnet transaction hashes
3. Prepare submission materials
4. Set up monitoring and analytics
5. Plan marketing strategy
6. Build community on Discord/Twitter
7. Consider additional features (multiplayer, tournaments, etc.)