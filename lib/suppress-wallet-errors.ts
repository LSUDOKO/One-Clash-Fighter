// Suppress wallet extension conflict errors
// This prevents the console from being flooded with errors from multiple wallet extensions
// fighting over window.ethereum and other global properties

if (typeof window !== 'undefined') {
    // Store original console.error
    const originalError = console.error;

    // List of error messages to suppress (wallet extension conflicts)
    const suppressedErrors = [
        'Cannot set property ethereum',
        'Cannot redefine property: ethereum',
        'Invalid property descriptor',
        'which has only a getter',
        'MetaMask encountered an error',
        'Failed to assign ethereum proxy',
        "Backpack couldn't override"
    ];

    // Override console.error to filter out wallet conflicts
    console.error = (...args: any[]) => {
        const errorMessage = args.join(' ');

        // Check if this is a wallet extension conflict error
        const isWalletConflict = suppressedErrors.some(msg =>
            errorMessage.includes(msg)
        );

        // Only suppress if it's a wallet conflict, otherwise log normally
        if (!isWalletConflict) {
            originalError.apply(console, args);
        }
    };

    // Also suppress unhandledrejection events from wallet conflicts
    window.addEventListener('unhandledrejection', (event) => {
        const errorMessage = event.reason?.message || '';
        const isWalletConflict = suppressedErrors.some(msg =>
            errorMessage.includes(msg)
        );

        if (isWalletConflict) {
            event.preventDefault();
        }
    });
}

export { };
