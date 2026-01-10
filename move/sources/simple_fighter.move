/// One Clash Fighters - Simple Fighter Module
/// Basic fighter management using Movement's Aptos framework
module one_clash_fighters::simple_fighter {
    use aptos_framework::signer;

    /// Simple Fighter structure
    struct Fighter has key {
        name: vector<u8>,
        power: u64,
        speed: u64,
        defense: u64,
        owner: address,
    }

    /// Create a new fighter
    public entry fun create_fighter(
        account: &signer,
        name: vector<u8>,
        power: u64,
        speed: u64,
        defense: u64,
    ) {
        let owner_addr = signer::address_of(account);
        
        let fighter = Fighter {
            name,
            power,
            speed,
            defense,
            owner: owner_addr,
        };
        
        move_to(account, fighter);
    }

    /// Get fighter power
    public fun get_fighter_power(fighter: &Fighter): u64 {
        fighter.power
    }

    /// Get fighter speed
    public fun get_fighter_speed(fighter: &Fighter): u64 {
        fighter.speed
    }

    /// Get fighter defense
    public fun get_fighter_defense(fighter: &Fighter): u64 {
        fighter.defense
    }

    /// Check if fighter exists
    public fun fighter_exists(addr: address): bool {
        exists<Fighter>(addr)
    }

    /// Get fighter owner
    public fun get_fighter_owner(fighter: &Fighter): address {
        fighter.owner
    }

    /// Get fighter name
    public fun get_fighter_name(fighter: &Fighter): vector<u8> {
        fighter.name
    }
}
