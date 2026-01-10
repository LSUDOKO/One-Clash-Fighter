# Deployment Fix for Movement Network

## Issue

The compilation is failing due to framework version incompatibility. The error indicates Move 2.2 language constructs are not enabled.

## Solution

### Option 1: Use Compatible Framework Version (Recommended)

Update `move/Move.toml` to use `devnet` branch which is more compatible:

```toml
[package]
name = "OneClashFighters"
version = "1.0.0"

[addresses]
one_clash_fighters = "0xd97bd9ea6ae33f1da5d89717de54aa20a2f9ad551dbbea50e26706a6ba864244"

[dependencies]
AptosFramework = { git = "https://github.com/aptos-labs/aptos-core.git", subdir = "aptos-move/framework/aptos-framework", rev = "devnet" }
AptosToken = { git = "https://github.com/aptos-labs/aptos-core.git", subdir = "aptos-move/framework/aptos-token", rev = "devnet" }

[dev-dependencies]
```

Then compile:

```bash
cd move
movement move compile
```

### Option 2: Simplify Smart Contracts

If Option 1 doesn't work, we can simplify the contracts to not use Aptos Token Objects and instead use basic resources:

**Simplified Fighter NFT (without token objects):**

```move
module one_clash_fighters::fighter_nft {
    use std::string::String;
    use std::signer;
    use aptos_framework::event;

    struct Fighter has key {
        name: String,
        fighter_type: u8,
        power: u8,
        speed: u8,
        defense: u8,
        wins: u64,
        losses: u64,
        total_damage_dealt: u64,
        total_damage_taken: u64,
        level: u8,
    }

    #[event]
    struct FighterMinted has drop, store {
        owner: address,
        name: String,
        fighter_type: u8,
    }

    public entry fun create_fighter(
        account: &signer,
        name: String,
        fighter_type: u8,
        power: u8,
        speed: u8,
        defense: u8,
    ) {
        let fighter = Fighter {
            name,
            fighter_type,
            power,
            speed,
            defense,
            wins: 0,
            losses: 0,
            total_damage_dealt: 0,
            total_damage_taken: 0,
            level: 1,
        };

        move_to(account, fighter);

        event::emit(FighterMinted {
            owner: signer::address_of(account),
            name,
            fighter_type,
        });
    }

    // ... rest of the functions
}
```

### Option 3: Use Aptos CLI Instead

If Movement CLI has issues, try using Aptos CLI (version 3.5 or lower):

```bash
# Install Aptos CLI v3.5
curl -fsSL https://aptos.dev/scripts/install_cli.sh | sh

# Initialize
aptos init --network custom --rest-url https://testnet.movementnetwork.xyz/v1

# Compile
aptos move compile --named-addresses one_clash_fighters=0xd97bd9ea6ae33f1da5d89717de54aa20a2f9ad551dbbea50e26706a6ba864244

# Publish
aptos move publish --named-addresses one_clash_fighters=0xd97bd9ea6ae33f1da5d89717de54aa20a2f9ad551dbbea50e26706a6ba864244
```

### Option 4: Use Local Framework

Clone the Aptos framework locally to ensure compatibility:

```bash
# In your move directory
git clone https://github.com/aptos-labs/aptos-core.git --branch devnet --single-branch

# Update Move.toml
[dependencies]
AptosFramework = { local = "./aptos-core/aptos-move/framework/aptos-framework" }
AptosToken = { local = "./aptos-core/aptos-move/framework/aptos-token" }
```

## Current Status

I've updated the `Move.toml` to use the `devnet` branch. Please try:

```bash
cd move
movement move compile
```

If this works, then:

```bash
movement move publish
```

## Alternative: Direct Deployment

If all else fails, you can deploy without token objects and use a simpler NFT implementation that just stores Fighter resources directly under user accounts. This is actually a valid approach for Movement Network and will work reliably.

Let me know which approach works and I can help implement it!