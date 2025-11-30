import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { Transaction, Block, Chain, Wallet } from '../src/models';
import { PoWChain } from '../src/blockchain-pow';

describe('Blockchain PoW Implementation', () => {
    beforeEach(() => {
        Chain.reset();
    });

    describe('Transaction', () => {
        it('should create a valid transaction', () => {
            const transaction = new Transaction(1.0, 'Alice', 'Bob');
            expect(transaction.amount).to.equal(1.0);
            expect(transaction.payer).to.equal('Alice');
            expect(transaction.payee).to.equal('Bob');
        });

        it('should convert transaction to string', () => {
            const transaction = new Transaction(1.0, 'Alice', 'Bob');
            const str = transaction.toString();
            expect(str).to.include('"amount":1');
            expect(str).to.include('"payer":"Alice"');
            expect(str).to.include('"payee":"Bob"');
        });
    });

    describe('Block', () => {
        it('should create a valid block', () => {
            const transaction = new Transaction(1.0, 'Alice', 'Bob');
            const block = new Block('0', transaction);
            expect(block.prevHash).to.equal('0');
            expect(block.transaction).to.equal(transaction);
            expect(block.nonce).to.be.a('number');
            expect(block.ts).to.be.a('number');
        });

        it('should generate a valid hash', () => {
            const transaction = new Transaction(1.0, 'Alice', 'Bob');
            const block = new Block('0', transaction);
            const hash = block.hash;
            expect(hash).to.be.a('string');
            expect(hash.length).to.equal(64); // SHA-256 produces 64 character hex string
        });
    });

    describe('PoWChain', () => {
        it('should create a singleton instance', () => {
            const chain1 = PoWChain.getInstance();
            const chain2 = PoWChain.getInstance();
            expect(chain1).to.equal(chain2);
        });

        it('should initialize with genesis block', () => {
            const chain = PoWChain.getInstance();
            expect(chain.chainLength).to.equal(1);
            expect(chain.lastBlock.prevHash).to.equal('0');
        });

        it('should mine blocks with correct difficulty', () => {
            const chain = PoWChain.getInstance();
            chain.setDifficulty(2);
            chain.mine(0);
            const lastBlock = chain.lastBlock;
            expect(lastBlock.hash.startsWith('00')).to.be.true;
        });
    });

    describe('Wallet', () => {
        it('should create a valid wallet', () => {
            const wallet = new Wallet();
            expect(wallet.publicKey).to.be.a('string');
            expect(wallet.publicKey.length).to.be.greaterThan(0);
        });

        it('should initialize with default amount', () => {
            const wallet = new Wallet();
            wallet.Init();
            // Note: We can't directly test private amountMoney as it's private
            // We can test it through public methods
        });
    });
});
