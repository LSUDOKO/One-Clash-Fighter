
import { Account } from "@aptos-labs/ts-sdk";

async function main() {
    const account = Account.generate();
    console.log("PRIVATE_KEY=" + account.privateKey.toString());
    console.log("ADDRESS=" + account.accountAddress.toString());
}

main();
