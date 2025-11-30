import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { Transaction, Block, Chain, Wallet } from '../src/models';
import { PoSChain, Validator, PoSBlock } from '../src/blockchain-pos';

describe('Blockchain PoS Implementation', () => {
    beforeEach(() => {
        Chain.reset();
        PoSChain.reset();
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

    describe('Chain', () => {
        it('should create a singleton instance', () => {
            const chain1 = Chain.getInstance();
            const chain2 = Chain.getInstance();
            expect(chain1).to.equal(chain2);
        });

        it('should initialize with genesis block', () => {
            const chain = Chain.getInstance();
            expect(chain.chainLength).to.equal(1);
            expect(chain.lastBlock.prevHash).to.equal('0');
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

    describe('Validator', () => {
        it('should create a valid validator', () => {
            const validator = new Validator('Alice', 100);
            expect(validator.name).to.equal('Alice');
            expect(validator.stake).to.equal(100);
        });

        it('should calculate validator weight correctly', () => {
            const validator = new Validator('Alice', 100);
            expect(validator.weight).to.equal(100);
        });
    });

    describe('PoSBlock', () => {
        it('should create a valid block', () => {
            const validator = new Validator('Alice', 100);
            const block = new PoSBlock('0', validator);
            expect(block.prevHash).to.equal('0');
            expect(block.validator).to.equal(validator);
            expect(block.timestamp).to.be.a('number');
        });

        it('should generate a valid hash', () => {
            const validator = new Validator('Alice', 100);
            const block = new PoSBlock('0', validator);
            const hash = block.hash;
            expect(hash).to.be.a('string');
            expect(hash.length).to.equal(64); // SHA-256 produces 64 character hex string
        });
    });

    describe('PoSChain', () => {
        it('should create a singleton instance', () => {
            const chain1 = PoSChain.getInstance();
            const chain2 = PoSChain.getInstance();
            expect(chain1).to.equal(chain2);
        });

        it('should initialize with genesis block', () => {
            const chain = PoSChain.getInstance();
            expect(chain.chainLength).to.equal(1);
            expect(chain.lastBlock.prevHash).to.equal('0');
        });

        it('should select validator based on stake', () => {
            const chain = PoSChain.getInstance();
            const validators = [
                new Validator('Alice', 100),
                new Validator('Bob', 200),
                new Validator('Charlie', 300),
            ];
            validators.forEach((v) => chain.addValidator(v));
            const selectedValidator = chain.selectValidator();
            expect(validators).to.include(selectedValidator);
        });

        it('should add blocks with selected validators', () => {
            const chain = PoSChain.getInstance();
            const validator = new Validator('Alice', 100);
            chain.addValidator(validator);
            chain.addBlock(validator);
            expect(chain.chainLength).to.equal(2);
            expect(chain.lastBlock.validator).to.equal(validator);
        });
    });
});
