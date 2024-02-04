import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';

const walletFile = 'wallet.json';

interface Wallet {
  keypair: string;
  publicKey: string;
  balance: number;
}

let currentWallet: Wallet | undefined;

async function newWallet(): Promise<void> {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toString();
  const balance = 0;

  currentWallet = { keypair: keypair.secretKey.toString(), publicKey, balance };

  try {
    fs.writeFileSync(walletFile, JSON.stringify(currentWallet), 'utf8');
    console.log('Wallet created and saved to wallet.json');
  } catch (err) {
    console.error('Error saving wallet:', err);
  }
}

// Test
newWallet().catch(err => console.error(err));
