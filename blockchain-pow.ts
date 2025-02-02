import * as crypto from 'crypto';

class Transaction {
    constructor(
        public amount: number, // amount of the transaction denominated in bitcoin
        public payer: string, // person paying the money
        public payee: string // person receiving the money
    ) {}

    // Converts the objects to a string
    toString() {
        return JSON.stringify(this);
    }
}

// Block can be represented as a linked list
class Block {
    // Proof of Work concept
    public nonce = Math.round(Math.random() * 999999999);

    constructor(
        public prevHash: string, // link to the previous block
        public transaction: Transaction,
        public ts = Date.now()
    ) {}

    get hash() {
        const str = JSON.stringify(this);
        const hash = crypto.createHash('SHA256'); // hash functions which can't return the same value
        hash.update(str).end();
        return hash.digest('hex');
    }
}

class Chain {
    public static instance = new Chain(); // one Chain instance for one blockchain

    chain: Block[];

    constructor() {
        // Create th Genesis Block
        console.log(`Blockchain created the Genesis Block!`);
        this.chain = [
            new Block(null as any, new Transaction(100, 'genesis', 'bitcoin')),
        ];
    }

    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Proof of work system
    mine(nonce: number) {
        let solution = 1;
        console.log('⛏️  mining...');

        // Brute force going digit by digit to find the requested value
        while (true) {
            const hash = crypto.createHash('MD5'); // Similar such as SHA256, faster to compute
            hash.update((nonce + solution).toString()).end();

            const attempt = hash.digest('hex');

            if (attempt.substring(0, 4) === '0000') {
                console.log(`Solved: ${solution}`);
                return nonce + solution;
            }

            solution += 1;
        }
    }

    addBlock(
        transaction: Transaction,
        senderPublicKey: string,
        signature: Buffer
    ) {
        // Verify the transaction
        const verified = crypto.createVerify('SHA256');
        verified.update(transaction.toString());

        const isValid = verified.verify(senderPublicKey, signature);

        if (isValid) {
            // Add the new Block
            const newBlock = new Block(this.lastBlock.hash, transaction);

            newBlock.nonce = this.mine(newBlock.nonce);
            this.chain.push(newBlock);

            return true;
        }

        return false;
    }
}

// Legitamate the transaction
class Wallet {
    private amountMoney: number; // The amount of money in the Wallet
    private privateKey: string; // The privateKey is for spending money
    public publicKey: string; // The publicKey is for receiving money

    constructor() {
        // The `generateKeyPairSync` method accepts two arguments 'type' key and 'options'
        // https://www.geeksforgeeks.org/node-js-crypto-generatekeypairsync-method/
        const keypair = crypto.generateKeyPairSync('rsa', {
            // The standard secure default length for RSA keys is 2048 bits
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });

        this.amountMoney = 0;
        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;
    }

    public Init() {
        this.addMoney(this, 100);
        console.log(`Private key: ${this.privateKey}`);
    }

    sendMoney(amount: number, payee: Wallet, payeePublicKey: string) {
        // Validate the Wallet amount
        if (amount <= 0) {
            console.log(
                "RangeError: The amount money which you are sending is't enough to proceed..."
            );
            return null;
        }

        if (this.amountMoney < amount) {
            console.log(
                "RangeError: The amount money in the wallet is't enough to proceed..."
            );
            return null;
        }

        const transaction = new Transaction(
            amount,
            this.publicKey,
            payeePublicKey
        );

        const sign = crypto.createSign('SHA256');
        sign.update(transaction.toString()).end();

        // It is like one-time password
        const signature = sign.sign(this.privateKey);

        // Add the block to the BlockChain
        var result = Chain.instance.addBlock(
            transaction,
            this.publicKey,
            signature
        );

        // Add money after validation of the sifnature
        if (result == true) {
            this.addMoney(payee, amount);
        }
    }

    private addMoney(wallet: Wallet, amount: number) {
        // Add Money to the account
        wallet.amountMoney += amount;
        console.log(`${amount} added to the wallet`);
    }
}

// Example of usage
var satoshi = new Wallet();
satoshi.Init();

const user1 = new Wallet();
const user2 = new Wallet();

satoshi.sendMoney(80, user1, user1.publicKey);
user1.sendMoney(20, user2, user2.publicKey);
user2.sendMoney(15, user1, user1.publicKey);

console.log(`\n`);
console.log(Chain.instance);
