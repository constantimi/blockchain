import * as crypto from 'crypto';
import { IWallet } from '../types/wallet';
import { Chain } from './chain';
import { Transaction } from './transaction';

export class Wallet implements IWallet {
    private amountMoney: number = 0; // The amount of money in the Wallet
    private privateKey: string; // The privateKey is for spending money
    public publicKey: string; // The publicKey is for receiving money

    constructor() {
        const keypair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });

        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;
    }

    public Init(): void {
        this.amountMoney = 100;
    }

    sendMoney(amount: number, payee: IWallet, payeePublicKey: string): void {
        const transaction = new Transaction(
            amount,
            this.publicKey,
            payeePublicKey
        );

        const sign = crypto.createSign('SHA256');
        sign.update(transaction.toString()).end();

        const signature = sign.sign(this.privateKey);
        Chain.getInstance().addBlock(transaction, this.publicKey, signature);
    }

    private addMoney(wallet: IWallet, amount: number): void {
        if (wallet instanceof Wallet) {
            wallet.amountMoney += amount;
        }
    }
}
