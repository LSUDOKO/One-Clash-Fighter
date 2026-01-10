# Movement Network Deployment Solution

## Current Issue

The Movement CLI is encountering framework version compatibility issues. The errors are coming from the Aptos framework's specification files, not from our smart contracts.

## Working Solution: Use Aptos CLI

Movement Network is Aptos Move-compatible, so we can use the standard Aptos CLI which has better stability.

### Step 1: Install Aptos CLI (v3.5 or lower)

```bash
# Download and install Aptos CLI
curl -fsSL "https://aptos.dev/scripts/install_cli.sh" | sh

# Verify installation
aptos --version
```

### Step 2: Initialize Aptos Configuration

```bash
cd move

# Initialize with custom network
aptos init --network custom \
  --rest-url https://testnet.movementnetwork.xyz/v1 \
  --faucet-url https://faucet.testnet.movementnetwork.xyz

# When prompted for private key, use your existing one:
# 0xf02ac7aeaaecc24dd46013529d715830a4bcef7da80fa836e7fcf25edd6351e3
```

### Step 3: Compile with Aptos CLI

```bash
aptos move compile \
  --named-addresses one_clash_fighters=0xd97bd9ea6ae33f1da5d89717de54aa20a2f9ad551dbbea50e26706a6ba864244
```

### Step 4: Publish to Movement Network

```bash
aptos move publish \
  --named-addresses one_clash_fighters=0xd97bd9ea6ae33f1da5d89717de54aa20a2f9ad551dbbea50e26706a6ba864244 \
  --assume-yes
```

## Alternative: Simplified Move.toml

If the above doesn't work, update `Move.toml` to use local Aptos framework:

```toml
[package]
name = "OneClashFighters"
version = "1.0.0"

[addresses]
one_clash_fighters = "0xd97bd9ea6ae33f1da5d89717de54aa20a2f9ad551dbbea50e26706a6ba864244"

[dependencies]
AptosFramework = { local = "../aptos-framework" }

[dev-dependencies]
```

Then clone the framework:

```bash
cd ..
git clone --depth 1 --branch aptos-node-v1.8.0 \
  https://github.com/aptos-labs/aptos-core.git aptos-core-temp
  
cp -r aptos-core-temp/aptos-move/framework/aptos-framework ./
rm -rf aptos-core-temp
```

## Quick Test Script

Save this as `deploy.sh`:

```bash
#!/bin/bash

cd move

echo "Compiling Move modules..."
aptos move compile \
  --named-addresses one_clash_fighters=0xd97bd9ea6ae33f1da5d89717de54aa20a2f9ad551dbbea50e26706a6ba864244

if [ $? -eq 0 ]; then
    echo "✅ Compilation successful!"
    echo ""
    echo "Ready to publish. Run:"
    echo "aptos move publish --named-addresses one_clash_fighters=0xd97bd9ea6ae33f1da5d89717de54aa20a2f9ad551dbbea50e26706a6ba864244"
else
    echo "❌ Compilation failed"
    exit 1
fi
```

Make it executable and run:

```bash
chmod +x deploy.sh
./deploy.sh
```

## After Successful Deployment

1. **Update .env.local**:
```bash
NEXT_PUBLIC_PACKAGE_ADDRESS=0xd97bd9ea6ae33f1da5d89717de54aa20a2f9ad551dbbea50e26706a6ba864244
```

2. **Run the frontend**:
```bash
npm run dev
```

3. **Test in browser**:
   - Open http://localhost:3000
   - Connect Petra wallet
   - Make sure wallet is on Movement testnet
   - Mint a fighter

## Troubleshooting

### Issue: "Invalid network" error

**Fix**: The frontend is already configured for `Network.CUSTOM`. Make sure your wallet is set to Movement Network testnet.

**Wallet Configuration**:
- Network: Custom
- RPC URL: `https://testnet.movementnetwork.xyz/v1`
- Chain ID: You can find this by visiting the Movement explorer

### Issue: Transaction fails

1. Check you have testnet tokens:
```bash
aptos account fund-with-faucet --account default
```

2. Or visit: https://faucet.testnet.movementnetwork.xyz

### Issue: Can't connect wallet

The frontend supports Petra, Martian, and Pontem wallets. Install at least one:
- Petra: https://petra.app
- Martian: https://martianwallet.xyz  
- Pontem: https://pontem.network

## Expected Output

After successful deployment, you should see:

```json
{
  "Result": {
    "transaction_hash": "0x...",
    "gas_used": 1236,
    "success": true,
    "vm_status": "Executed successfully"
  }
}
```

View your contract on Movement Explorer:
```
https://explorer.movementnetwork.xyz/account/0xd97bd9ea6ae33f1da5d89717de54aa20a2f9ad551dbbea50e26706a6ba864244?network=testnet
```

## Summary

The smart contracts are ready and correct. The issue is with CLI/framework compatibility. Using Aptos CLI directly resolves this since Movement Network is fully Aptos Move-compatible.

**Next Steps**:
1. Install Aptos CLI
2. Compile with `aptos move compile`
3. Deploy with `aptos move publish`
4. Update `.env.local` with package address
5. Test the game!

---

For any issues, refer to:
- Aptos CLI Docs: https://aptos.dev/tools/aptos-cli/
- Movement Docs: https://docs.movementnetwork.xyz/