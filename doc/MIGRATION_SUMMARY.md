# One Clash Fighters - OneChain to Movement Network Migration Summary

## Overview

Successfully migrated One Clash Fighters from OneChain (Sui-based) to Movement Network (Aptos Move-based). This document summarizes all changes made during the migration.

## 🔄 Key Changes

### 1. Smart Contracts (Move Language)

#### Migrated from Sui Move to Aptos Move

**Fighter NFT Module (`move/sources/fighter_nft.move`)**
- ✅ Changed from Sui object model to Aptos Token Objects (AIP-22)
- ✅ Replaced `sui::object::UID` with Aptos resource model
- ✅ Updated imports from `one::` to `aptos_framework::` and `aptos_token_objects::`
- ✅ Changed `TxContext` to `&signer`
- ✅ Converted `event::emit` to Aptos `#[event]` attribute
- ✅ Added `#[view]` functions for querying fighter stats
- ✅ Used `acquires` for resource access

**Battle System Module (`move/sources/battle_system.move`)**
- ✅ Replaced Sui events with Aptos event handles
- ✅ Changed from `Coin<OCT>` to `AptosCoin` (MOVE token)
- ✅ Added `BattleCounter` resource for tracking battles
- ✅ Updated timestamp from `tx_context::epoch_timestamp_ms` to `timestamp::now_seconds`
- ✅ Implemented `init_module` for initialization
- ✅ Added view functions for querying battle data

**Staking Pool Module (`move/sources/staking_pool.move`)**
- ✅ Converted from shared objects to global resources
- ✅ Replaced Sui `Balance<OCT>` with AptosCoin management
- ✅ Updated `Table` to use `aptos_std::table`
- ✅ Changed entry fee from 0.01 OCT to 0.1 MOVE
- ✅ Added comprehensive view functions
- ✅ Implemented module initialization

**Move.toml Configuration**
- ✅ Updated package name to "OneClashFighters"
- ✅ Changed dependencies from OneChain to AptosFramework and AptosToken
- ✅ Updated named addresses to `one_clash_fighters`

### 2. Frontend Migration

#### New Configuration

**Created `lib/movement-config.ts`**
- ✅ Movement Network RPC endpoints
- ✅ Testnet/Mainnet configuration
- ✅ Module names and package address
- ✅ Helper functions for explorer URLs
- ✅ Game settings (entry fees, fighter types)

**Environment Variables (`.env.local.example`)**
```bash
NEXT_PUBLIC_MOVEMENT_NETWORK=testnet
NEXT_PUBLIC_MOVEMENT_RPC_URL=https://aptos.testnet.movementlabs.xyz/v1
NEXT_PUBLIC_PACKAGE_ADDRESS=0x1
NEXT_PUBLIC_EXPLORER_URL=https://explorer.movementlabs.xyz
NEXT_PUBLIC_FAUCET_URL=https://faucet.testnet.movementlabs.xyz
```

#### Wallet Integration

**Created `providers/MovementProvider.tsx`**
- ✅ Replaced `@mysten/dapp-kit` with `@aptos-labs/wallet-adapter-react`
- ✅ Added support for Petra, Martian, and Pontem wallets
- ✅ Configured for Movement Network testnet/mainnet

**Updated `components/wallet-connect.tsx`**
- ✅ Custom wallet selector UI
- ✅ Wallet connection/disconnection
- ✅ Address display with truncation

**Updated `app/layout.tsx`**
- ✅ Replaced `OneChainProvider` with `MovementProvider`
- ✅ Removed Sui CSS imports
- ✅ Updated metadata for Movement Network

#### Custom Hooks Migration

**`hooks/use-fighter-nft.ts`**
- ✅ Replaced `@mysten/sui` with `@aptos-labs/ts-sdk`
- ✅ Changed from Sui PTB to Aptos entry functions
- ✅ Updated transaction building with `signAndSubmitTransaction`
- ✅ Added `getFighterStats` using view functions
- ✅ Changed object queries to resource queries

**`hooks/use-battle-recording.ts`**
- ✅ Updated battle recording to use Aptos entry functions
- ✅ Changed event queries to use Movement event streams
- ✅ Added `getTotalBattles` view function
- ✅ Updated leaderboard fetching for Movement indexer

**`hooks/use-staking.ts`**
- ✅ Converted staking to use AptosCoin
- ✅ Updated pool stats to use view functions
- ✅ Added `hasPlayerStaked` and `getPlayerStake` functions
- ✅ Changed transaction format for Movement Network

### 3. Dependencies Updated

**Removed (OneChain/Sui)**
```json
"@mysten/dapp-kit": "^0.14.0"
"@mysten/sui": "^1.0.0"
```

**Added (Movement/Aptos)**
```json
"@aptos-labs/wallet-adapter-react": "^3.7.3"
"@aptos-labs/ts-sdk": "^1.32.0"
"petra-plugin-wallet-adapter": "^0.4.5"
"@martianwallet/aptos-wallet-adapter": "^0.0.5"
"@pontem/wallet-adapter-plugin": "^0.2.1"
```

### 4. Documentation Updates

**README.md**
- ✅ Updated all references from OneChain to Movement Network
- ✅ Changed OCT to MOVE token
- ✅ Updated blockchain architecture diagrams
- ✅ Modified installation instructions
- ✅ Added Movement Network benefits section
- ✅ Updated tech stack section
- ✅ Changed wallet setup instructions
- ✅ Updated all links to Movement resources

**Created DEPLOYMENT.md**
- ✅ Complete deployment guide for Movement Network
- ✅ Smart contract compilation and testing steps
- ✅ Frontend configuration instructions
- ✅ Testnet deployment workflow
- ✅ Mainnet preparation checklist
- ✅ Troubleshooting section
- ✅ Security considerations

## 📋 Migration Checklist

### Smart Contracts ✅
- [x] Fighter NFT module migrated to Aptos Move
- [x] Battle System module migrated to Aptos Move
- [x] Staking Pool module migrated to Aptos Move
- [x] Move.toml updated for Movement Network
- [x] Event systems converted to Aptos format
- [x] View functions added for queries

### Frontend ✅
- [x] Movement config file created
- [x] Wallet provider updated
- [x] Fighter NFT hooks migrated
- [x] Battle recording hooks migrated
- [x] Staking hooks migrated
- [x] Wallet connect component updated
- [x] Layout provider updated
- [x] Dependencies installed

### Configuration ✅
- [x] Environment variables configured
- [x] Package.json dependencies updated
- [x] RPC endpoints configured
- [x] Explorer links updated

### Documentation ✅
- [x] README.md updated
- [x] DEPLOYMENT.md created
- [x] MIGRATION_SUMMARY.md created
- [x] Code examples updated
- [x] Links to Movement resources added

## 🚀 Next Steps

### 1. Deploy Smart Contracts

```bash
cd move
movement move compile
movement move test
movement move publish --named-addresses one_clash_fighters=default
```

### 2. Update Frontend Configuration

After deployment, update `.env.local`:
```bash
NEXT_PUBLIC_PACKAGE_ADDRESS=<your_deployed_package_address>
```

### 3. Test the Application

```bash
npm run dev
# Test all features:
# - Wallet connection
# - Fighter minting
# - Battle recording
# - Staking
# - Leaderboard
```

### 4. Prepare for Submission

- [ ] Create demo video
- [ ] Test all features on Movement testnet
- [ ] Document testnet transaction hashes
- [ ] Prepare pitch deck highlighting Movement benefits
- [ ] Set up project GitHub repository
- [ ] Create submission materials

## 🔧 Technical Improvements

### Advantages of Movement Network

1. **Performance**
   - Parallel execution for higher throughput
   - Sub-second finality for instant feedback
   - Optimized for gaming applications

2. **Security**
   - Move language's resource safety
   - Formal verification capabilities
   - No reentrancy vulnerabilities

3. **Developer Experience**
   - Rich Aptos ecosystem
   - Comprehensive SDK and tools
   - Active community support

4. **Cost Efficiency**
   - Lower transaction fees
   - Predictable gas costs
   - Efficient resource management

## 🐛 Known Issues & Considerations

### Pending Tasks
- Package address needs to be set after deployment
- Testing required on Movement testnet
- Wallet extensions need to be installed by users

### Compatibility Notes
- Existing OneChain data cannot be migrated (different blockchain)
- Users need to mint new fighters on Movement Network
- New wallets required (Petra/Martian/Pontem instead of OneWallet)

## 📚 Resources

### Movement Network
- Docs: https://docs.movementnetwork.xyz
- Explorer: https://explorer.movementlabs.xyz
- Faucet: https://faucet.testnet.movementlabs.xyz
- Discord: https://discord.gg/movementlabs

### Aptos Move
- Move Book: https://aptos.dev/move/move-on-aptos
- Token Objects: https://aptos.dev/standards/aptos-token-v2
- SDK Docs: https://aptos.dev/sdks/ts-sdk

### Wallets
- Petra: https://petra.app
- Martian: https://martianwallet.xyz
- Pontem: https://pontem.network

## 💡 Tips for Success

1. **Smart Contract Development**
   - Always test locally before deploying
   - Use view functions for gas-free queries
   - Implement proper error handling
   - Document all public functions

2. **Frontend Integration**
   - Handle wallet connection errors gracefully
   - Show transaction status to users
   - Cache view function results when possible
   - Provide clear error messages

3. **Testing Strategy**
   - Test all transaction flows on testnet
   - Verify event emission
   - Check view functions return correct data
   - Test with different wallet providers

4. **Deployment**
   - Double-check named addresses
   - Save package address immediately
   - Verify deployment on explorer
   - Test basic functions before announcing

## 🎯 Summary

Successfully migrated One Clash Fighters from OneChain (Sui-based) to Movement Network (Aptos Move-based). All smart contracts, frontend code, and documentation have been updated. The application is ready for deployment to Movement testnet.

**Migration Scope:**
- 3 smart contract modules fully migrated
- 3 custom hooks updated
- 1 wallet provider replaced
- Complete documentation overhaul
- Dependencies updated

**Time to Deploy:** ~15-30 minutes
**Time to Test:** ~1-2 hours
**Ready for:** Movement Network Hackathon Submission

---

*Migration completed on 2026-01-08*