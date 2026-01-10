module one_clash_fighters::simple_battle {
    use aptos_framework::account;
    use aptos_framework::signer;
    use aptos_framework::timestamp;
    use aptos_framework::event;

    /// Battle record structure for individual players
    struct BattleRecord has key {
        battle_count: u64,
        last_battle_time: u64, total_wins: u64,
        total_losses: u64,
    }

    /// Global events container
    struct BattleEvents has key {
        battle_events: event::EventHandle<BattleResult>,
    }

    /// Battle result event
    struct BattleResult has drop, store {
        winner: address,
        loser: address,
        battle_time: u64,
        winner_power: u64,
        loser_power: u64,
    }

    /// Initialize the module and global events
    fun init_module(admin: &signer) {
        if (!exists<BattleEvents>(signer::address_of(admin))) {
            move_to(admin, BattleEvents {
                battle_events: account::new_event_handle<BattleResult>(admin),
            });
        }
    }

    /// Initialize battle record for a player
    public entry fun init_battle_record(account: &signer) {
        let account_addr = signer::address_of(account);
        if (!exists<BattleRecord>(account_addr)) {
            let battle_record = BattleRecord {
                battle_count: 0,
                last_battle_time: 0,
                total_wins: 0,
                total_losses: 0,
            };
            move_to(account, battle_record);
        }
    }

    /// Record a battle result
    public entry fun record_battle(
        account: &signer,
        loser: address,
        winner_power: u64,
        loser_power: u64,
    ) acquires BattleRecord, BattleEvents {
        let winner = signer::address_of(account);
        
        // Auto-init winner's record if needed
        if (!exists<BattleRecord>(winner)) {
            init_battle_record(account);
        };

        let winner_record = borrow_global_mut<BattleRecord>(winner);
        winner_record.battle_count = winner_record.battle_count + 1;
        winner_record.total_wins = winner_record.total_wins + 1;
        winner_record.last_battle_time = timestamp::now_seconds();

        // Emit event to global handle (REST compatible)
        let events = borrow_global_mut<BattleEvents>(@one_clash_fighters);
        event::emit_event(&mut events.battle_events, BattleResult {
            winner,
            loser,
            battle_time: timestamp::now_seconds(),
            winner_power,
            loser_power,
        });

        // Update loser's record if exists
        if (exists<BattleRecord>(loser)) {
            let loser_record = borrow_global_mut<BattleRecord>(loser);
            loser_record.battle_count = loser_record.battle_count + 1;
            loser_record.total_losses = loser_record.total_losses + 1;
            loser_record.last_battle_time = timestamp::now_seconds();
        };
    }

    /// Get battle stats for a player
    #[view]
    public fun get_battle_stats(addr: address): (u64, u64, u64) acquires BattleRecord {
        if (exists<BattleRecord>(addr)) {
            let record = borrow_global<BattleRecord>(addr);
            (record.battle_count, record.total_wins, record.total_losses)
        } else {
            (0, 0, 0)
        }
    }

    /// Check if battle record exists
    #[view]
    public fun battle_record_exists(addr: address): bool {
        exists<BattleRecord>(addr)
    }
}
