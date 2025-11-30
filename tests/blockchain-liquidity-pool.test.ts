import * as crypto from 'crypto';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { Transaction, Block, Chain, Wallet } from '../src/models';
import { Token, LiquidityPool } from '../src/blockchain-liquidity-pool';

describe('Blockchain Liquidity Pool Implementation', () => {
    beforeEach(() => {
        // Reset the Chain singleton instance
        Chain.getInstance().reset();
    });

    describe('Token', () => {
        it('should create a valid token', () => {
            const token = new Token('Test Token', 'TEST', 1000000);
            expect(token.name).to.equal('Test Token');
            expect(token.symbol).to.equal('TEST');
            expect(token.totalSupply).to.equal(1000000);
            expect(token.balanceOf('creator')).to.equal(1000000);
            expect(token.balanceOf('user1')).to.equal(0);
        });

        it('should transfer tokens correctly', () => {
            const token = new Token('Test Token', 'TEST', 1000000);
            expect(token.transfer('creator', 'user1', 100)).to.be.true;
            expect(token.balanceOf('user1')).to.equal(100);
            expect(token.balanceOf('creator')).to.equal(999900);

            expect(token.transfer('user1', 'user2', 50)).to.be.true;
            expect(token.balanceOf('user1')).to.equal(50);
            expect(token.balanceOf('user2')).to.equal(50);
        });

        it('should fail transfer with insufficient balance', () => {
            const token = new Token('Test Token', 'TEST', 1000000);
            expect(token.transfer('user1', 'user2', 100)).to.be.false;
            expect(token.balanceOf('user1')).to.equal(0);
            expect(token.balanceOf('user2')).to.equal(0);
        });
    });

    describe('LiquidityPool', () => {
        it('should create a valid liquidity pool', () => {
            const tokenA = new Token('Token A', 'TKNA', 1000000);
            const tokenB = new Token('Token B', 'TKNB', 1000000);
            const pool = new LiquidityPool(tokenA, tokenB);
            expect(pool.tokenA).to.equal(tokenA);
            expect(pool.tokenB).to.equal(tokenB);
            expect(pool.reserveA).to.equal(0);
            expect(pool.reserveB).to.equal(0);
        });

        it('should add liquidity to the pool', () => {
            const tokenA = new Token('Token A', 'TKNA', 1000000);
            const tokenB = new Token('Token B', 'TKNB', 1000000);

            // Transfer tokens to pool address
            tokenA.transfer('creator', 'pool', 100);
            tokenB.transfer('creator', 'pool', 200);

            const pool = new LiquidityPool(tokenA, tokenB);
            expect(pool.addLiquidity(100, 200)).to.be.true;
            expect(pool.reserveA).to.equal(100);
            expect(pool.reserveB).to.equal(200);
        });

        it('should calculate exchange rate correctly', () => {
            const tokenA = new Token('Token A', 'TKNA', 1000000);
            const tokenB = new Token('Token B', 'TKNB', 1000000);
            const pool = new LiquidityPool(tokenA, tokenB);

            // Transfer tokens to pool address
            tokenA.transfer('creator', 'pool', 100);
            tokenB.transfer('creator', 'pool', 200);

            pool.addLiquidity(100, 200);
            const rate = pool.getExchangeRate(tokenA, tokenB);
            expect(rate).to.equal(2); // 200/100 = 2
        });

        it('should fail to add liquidity with invalid amounts', () => {
            const tokenA = new Token('Token A', 'TKNA', 1000000);
            const tokenB = new Token('Token B', 'TKNB', 1000000);
            const pool = new LiquidityPool(tokenA, tokenB);

            expect(pool.addLiquidity(0, 100)).to.be.false;
            expect(pool.addLiquidity(100, 0)).to.be.false;
            expect(pool.addLiquidity(-100, 200)).to.be.false;
            expect(pool.addLiquidity(100, -200)).to.be.false;
        });
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

        it('should mine block with specified difficulty', () => {
            const transaction = new Transaction(1.0, 'Alice', 'Bob');
            const block = new Block('0', transaction);
            const difficulty = 2;
            block.mine(difficulty);
            expect(block.hash.substring(0, difficulty)).to.equal('00');
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

        it('should add new blocks', () => {
            const chain = Chain.getInstance();
            const wallet = new Wallet();
            const recipient = new Wallet();
            const transaction = new Transaction(
                50,
                wallet.publicKey,
                recipient.publicKey
            );

            // Create a proper signature
            const sign = crypto.createSign('SHA256');
            sign.update(transaction.toString()).end();
            const signature = sign.sign((wallet as any).privateKey);

            chain.addBlock(transaction, wallet.publicKey, signature);
            expect(chain.chainLength).to.equal(2);
            expect(chain.lastBlock.transaction).to.equal(transaction);
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
            // Test through sending money
            const recipient = new Wallet();
            recipient.Init();
            wallet.sendMoney(50, recipient, recipient.publicKey);
            // Note: We can't directly test private amountMoney as it's private
            // The transaction will be added to the chain
            const chain = Chain.getInstance();
            expect(chain.chainLength).to.be.greaterThan(1);
        });

        it('should send money between wallets', () => {
            const sender = new Wallet();
            const recipient = new Wallet();
            sender.Init();
            recipient.Init();

            sender.sendMoney(50, recipient, recipient.publicKey);
            const chain = Chain.getInstance();
            const lastTransaction = chain.lastBlock.transaction;

            expect(lastTransaction.amount).to.equal(50);
            expect(lastTransaction.payer).to.equal(sender.publicKey);
            expect(lastTransaction.payee).to.equal(recipient.publicKey);
        });
    });
});
