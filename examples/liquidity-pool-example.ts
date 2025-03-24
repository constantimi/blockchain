/**
 * Liquidity Pool Example
 *
 * This example demonstrates various use cases of the Liquidity Pool implementation,
 * including token management, liquidity provision, and exchange rate calculations.
 */

import { Token, LiquidityPool } from '../src/blockchain-liquidity-pool.js';

// Example 1: Basic Token and Pool Setup
function basicLiquidityPoolExample() {
    console.log('\n=== Basic Liquidity Pool Example ===');

    // Create two tokens
    const tokenA = new Token('Ethereum', 'ETH', 1000000);
    const tokenB = new Token('USD Coin', 'USDC', 1000000);

    // Create a liquidity pool
    const pool = new LiquidityPool(tokenA, tokenB);

    // Add initial liquidity
    pool.addLiquidity(10, 20000); // 10 ETH and 20,000 USDC
    console.log('Initial pool state:');
    console.log(`ETH reserve: ${pool.reserveA}`);
    console.log(`USDC reserve: ${pool.reserveB}`);
    console.log(
        `Exchange rate (ETH/USDC): ${pool.getExchangeRate(tokenA, tokenB)}`
    );
    console.log(
        `Exchange rate (USDC/ETH): ${pool.getExchangeRate(tokenB, tokenA)}`
    );
}

// Example 2: Token Transfers and Balance Tracking
function tokenTransferExample() {
    console.log('\n=== Token Transfer Example ===');

    // Create tokens
    const token = new Token('Test Token', 'TEST', 1000000);

    // Initial state
    console.log('Initial balances:');
    console.log(`Creator: ${token.balanceOf('creator')}`);
    console.log(`User1: ${token.balanceOf('user1')}`);
    console.log(`User2: ${token.balanceOf('user2')}`);

    // Transfer tokens
    console.log('\nTransferring tokens...');
    token.transfer('creator', 'user1', 1000);
    token.transfer('user1', 'user2', 500);

    // Final state
    console.log('\nFinal balances:');
    console.log(`Creator: ${token.balanceOf('creator')}`);
    console.log(`User1: ${token.balanceOf('user1')}`);
    console.log(`User2: ${token.balanceOf('user2')}`);
}

// Example 3: Multiple Liquidity Pools and Exchange Rates
function multiplePoolsExample() {
    console.log('\n=== Multiple Liquidity Pools Example ===');

    // Create three tokens
    const eth = new Token('Ethereum', 'ETH', 1000000);
    const btc = new Token('Bitcoin', 'BTC', 1000000);
    const usdc = new Token('USD Coin', 'USDC', 1000000);

    // Create two pools
    const ethUsdcPool = new LiquidityPool(eth, usdc);
    const btcUsdcPool = new LiquidityPool(btc, usdc);

    // Add liquidity to pools
    ethUsdcPool.addLiquidity(10, 20000); // 10 ETH and 20,000 USDC
    btcUsdcPool.addLiquidity(1, 40000); // 1 BTC and 40,000 USDC

    // Display pool information
    console.log('ETH/USDC Pool:');
    console.log(`ETH reserve: ${ethUsdcPool.reserveA}`);
    console.log(`USDC reserve: ${ethUsdcPool.reserveB}`);
    console.log(
        `Exchange rate (ETH/USDC): ${ethUsdcPool.getExchangeRate(eth, usdc)}`
    );

    console.log('\nBTC/USDC Pool:');
    console.log(`BTC reserve: ${btcUsdcPool.reserveA}`);
    console.log(`USDC reserve: ${btcUsdcPool.reserveB}`);
    console.log(
        `Exchange rate (BTC/USDC): ${btcUsdcPool.getExchangeRate(btc, usdc)}`
    );

    // Calculate cross-pool rate (ETH/BTC)
    const ethUsdcRate = ethUsdcPool.getExchangeRate(eth, usdc);
    const btcUsdcRate = btcUsdcPool.getExchangeRate(btc, usdc);
    const ethBtcRate = ethUsdcRate / btcUsdcRate;
    console.log(`\nCross-pool rate (ETH/BTC): ${ethBtcRate}`);
}

// Example 4: Liquidity Pool Simulation
function poolSimulationExample() {
    console.log('\n=== Liquidity Pool Simulation ===');

    // Create tokens and pool
    const tokenA = new Token('Token A', 'TKNA', 1000000);
    const tokenB = new Token('Token B', 'TKNB', 1000000);
    const pool = new LiquidityPool(tokenA, tokenB);

    // Initial liquidity
    pool.addLiquidity(1000, 1000);
    console.log('Initial pool state:');
    console.log(`Token A reserve: ${pool.reserveA}`);
    console.log(`Token B reserve: ${pool.reserveB}`);
    console.log(
        `Initial exchange rate: ${pool.getExchangeRate(tokenA, tokenB)}`
    );

    // Simulate multiple liquidity additions
    const additions = [
        { amountA: 100, amountB: 100 },
        { amountA: 200, amountB: 200 },
        { amountA: 500, amountB: 500 },
    ];

    console.log('\nSimulating liquidity additions:');
    additions.forEach((addition, index) => {
        pool.addLiquidity(addition.amountA, addition.amountB);
        console.log(`\nAfter addition ${index + 1}:`);
        console.log(`Token A reserve: ${pool.reserveA}`);
        console.log(`Token B reserve: ${pool.reserveB}`);
        console.log(`Exchange rate: ${pool.getExchangeRate(tokenA, tokenB)}`);
    });
}

// Run all examples
console.log('Starting Liquidity Pool Examples...');
basicLiquidityPoolExample();
tokenTransferExample();
multiplePoolsExample();
poolSimulationExample();
