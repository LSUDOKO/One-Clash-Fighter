/// One Clash Fighters - Simple Staking Pool Module
/// Basic tournament staking using Movement's Aptos framework
module one_clash_fighters::simple_staking {
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    /// Tournament pool structure
    struct TournamentPool has key {
        total_staked: u64,
        prize_pool: u64,
        entry_fee: u64,
        active: bool,
        admin: address,
        participant_count: u64,
    }

    /// Participant stake record
    struct ParticipantStake has key {
        amount: u64,
        tournament_active: bool,
    }

    /// Initialize tournament pool (admin only)
    public entry fun init_tournament_pool(account: &signer, entry_fee: u64) {
        let admin_addr = signer::address_of(account);
        assert!(!exists<TournamentPool>(admin_addr), 1); // Already initialized
        
        let pool = TournamentPool {
            total_staked: 0,
            prize_pool: 0,
            entry_fee,
            active: true,
            admin: admin_addr,
            participant_count: 0,
        };
        
        move_to(account, pool);
    }

    /// Stake entry fee for tournament
    public entry fun stake_entry(account: &signer) acquires TournamentPool {
        let participant = signer::address_of(account);
        let pool_addr = @one_clash_fighters;
        
        assert!(exists<TournamentPool>(pool_addr), 2); // Pool not initialized
        assert!(!exists<ParticipantStake>(participant), 3); // Already staked
        
        let pool = borrow_global_mut<TournamentPool>(pool_addr);
        assert!(pool.active, 4); // Pool must be active
        
        let stake_amount = pool.entry_fee;
        
        // Transfer coins from participant to pool (admin address)
        coin::transfer<AptosCoin>(account, pool.admin, stake_amount);
        
        // Update pool
        pool.total_staked = pool.total_staked + stake_amount;
        pool.prize_pool = pool.prize_pool + stake_amount;
        pool.participant_count = pool.participant_count + 1;
        
        // Create stake record
        let stake_record = ParticipantStake {
            amount: stake_amount,
            tournament_active: true,
        };
        
        move_to(account, stake_record);
    }

    /// Distribute prize to winner (admin only)
    public entry fun distribute_prize(account: &signer, winner: address) acquires TournamentPool {
        let admin_addr = signer::address_of(account);
        let pool_addr = @one_clash_fighters;
        
        assert!(exists<TournamentPool>(pool_addr), 5); // Pool not initialized
        let pool = borrow_global_mut<TournamentPool>(pool_addr);
        assert!(pool.admin == admin_addr, 6); // Admin only
        assert!(pool.active, 7); // Pool must be active
        
        assert!(exists<ParticipantStake>(winner), 8); // Winner must have staked
        
        let prize_amount = pool.prize_pool;
        
        // Transfer prize from admin to winner
        coin::transfer<AptosCoin>(account, winner, prize_amount);
        
        // Update pool
        pool.prize_pool = 0;
        pool.active = false;
    }

    /// Get pool info
    #[view]
    public fun get_pool_info(): (u64, u64, u64, bool, u64) acquires TournamentPool {
        let pool_addr = @one_clash_fighters;
        assert!(exists<TournamentPool>(pool_addr), 9); // Pool not initialized
        
        let pool = borrow_global<TournamentPool>(pool_addr);
        (
            pool.total_staked,
            pool.prize_pool,
            pool.entry_fee,
            pool.active,
            pool.participant_count
        )
    }

    /// Check if participant has staked
    #[view]
    public fun has_staked(addr: address): bool {
        exists<ParticipantStake>(addr)
    }

    /// Reset tournament (admin only)
    public entry fun reset_tournament(account: &signer, new_entry_fee: u64) acquires TournamentPool {
        let admin_addr = signer::address_of(account);
        let pool_addr = @one_clash_fighters;
        
        assert!(exists<TournamentPool>(pool_addr), 10); // Pool not initialized
        let pool = borrow_global_mut<TournamentPool>(pool_addr);
        assert!(pool.admin == admin_addr, 11); // Admin only
        
        pool.total_staked = 0;
        pool.prize_pool = 0;
        pool.entry_fee = new_entry_fee;
        pool.active = true;
        pool.participant_count = 0;
    }
}
