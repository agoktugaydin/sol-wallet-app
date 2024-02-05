import * as fs from 'fs';
import * as web3 from '@solana/web3.js';

const connection = new web3.Connection(web3.clusterApiUrl('testnet'));

interface Wallet {
    publicKey: web3.PublicKey;
    balance: number;
}

let wallets: Wallet[] = [];
let currentWalletIndex: number = -1;

function loadWallets(): void {
    try {
        const data = fs.readFileSync('wallets.json', 'utf-8');
        wallets = JSON.parse(data);
        // publicKey özelliklerini PublicKey nesnelerine dönüştür
        wallets.forEach(wallet => {
            wallet.publicKey = new web3.PublicKey(wallet.publicKey);
        });
    } catch (err) {
        console.error("Error loading wallets:", err);
    }
}

function saveWallets(): void {
    try {
        fs.writeFileSync('wallets.json', JSON.stringify(wallets, null, 2));
    } catch (err) {
        console.error("Error saving wallets:", err);
    }
}

function switchWallet(index: number): void {
    if (index >= 0 && index < wallets.length) {
        currentWalletIndex = index;
        console.log(`Switched to wallet ${currentWalletIndex}`);
    } else {
        console.error("Invalid wallet index.");
    }
}

async function createWallet(): Promise<void> {
    try {
        const newKeypair = web3.Keypair.generate();
        const balance = await connection.getBalance(newKeypair.publicKey);

        wallets.push({
            publicKey: newKeypair.publicKey,
            balance: balance / web3.LAMPORTS_PER_SOL,
        });

        saveWallets();
        console.log(`Wallet created. Public Key: ${newKeypair.publicKey.toBase58()}, Balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.error("Error creating wallet:", err);
    }
}

async function airdrop(amount: number = 1): Promise<void> {
    try {
        if (currentWalletIndex === -1) {
            console.error("No wallet selected.");
            return;
        }

        const wallet = wallets[currentWalletIndex];
        const signature = await connection.requestAirdrop(wallet.publicKey, amount * web3.LAMPORTS_PER_SOL);
        await connection.confirmTransaction(signature);
        console.log(`Airdrop of ${amount} SOL completed to wallet ${currentWalletIndex}.`);
    } catch (err) {
        console.error("Error during airdrop:", err);
    }
}

async function checkBalance(): Promise<void> {
    try {
        if (currentWalletIndex === -1) {
            console.error("No wallet selected.");
            return;
        }

        const wallet = wallets[currentWalletIndex];
        const balance = await connection.getBalance(wallet.publicKey);
        console.log(`Balance for wallet ${currentWalletIndex}: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.error("Error checking balance:", err);
    }
}

async function menu(): Promise<void> {
    console.log("=== Wallet Management Menu ===");
    console.log("1. Create Wallet");
    console.log("2. Switch Wallet");
    console.log("3. Airdrop");
    console.log("4. Check Balance");
    console.log("5. Exit");

    const choice = await getInput("Enter your choice: ");

    switch (choice) {
        case '1':
            await createWallet();
            break;
        case '2':
            await switchWallet(parseInt(await getInput("Enter wallet index: ")));
            break;
        case '3':
            await airdrop(parseFloat(await getInput("Enter airdrop amount (default 1): ") || '1'));
            break;
        case '4':
            await checkBalance();
            break;
        case '5':
            process.exit(0);
        default:
            console.log("Invalid choice. Please try again.");
    }

    await menu();
}

async function getInput(prompt: string): Promise<string> {
    process.stdout.write(prompt);
    return new Promise((resolve) => {
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
}

async function main(): Promise<void> {
    loadWallets();
    await menu();
}

main().catch((err) => console.error(err));
