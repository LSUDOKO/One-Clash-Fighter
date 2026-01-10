// Type declarations for wallet extensions
interface AptosWalletExtension {
    connect: () => Promise<any>
    disconnect: () => Promise<void>
    account: () => Promise<any>
    signAndSubmitTransaction: (transaction: any) => Promise<any>
    network: () => Promise<any>
    isConnected: () => Promise<boolean>
}

declare global {
    interface Window {
        petra?: AptosWalletExtension
        martian?: AptosWalletExtension
        pontem?: AptosWalletExtension
        nightly?: { aptos: AptosWalletExtension }
        aptos?: AptosWalletExtension
    }
}

export { }
