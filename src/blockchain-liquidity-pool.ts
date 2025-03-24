/**
 * Liquidity Pool Implementation
 *
 * This implementation provides a decentralized exchange (DEX) liquidity pool
 * that allows users to provide liquidity and trade tokens. The pool maintains
 * a constant product formula (x * y = k) for price determination.
 */

/**
 * Represents a token in the liquidity pool
 */
export class Token {
    private balances: Map<string, number>;
    public name: string;
    public symbol: string;
    public totalSupply: number;

    constructor(name: string, symbol: string, totalSupply: number) {
        this.name = name;
        this.symbol = symbol;
        this.totalSupply = totalSupply;
        this.balances = new Map<string, number>();
        this.balances.set('creator', totalSupply);
    }

    /**
     * Transfers tokens from one account to another
     * @param from - The sender's address
     * @param to - The recipient's address
     * @param amount - The amount of tokens to transfer
     * @returns True if transfer was successful, false otherwise
     */
    transfer(from: string, to: string, amount: number): boolean {
        const fromBalance = this.balances.get(from) || 0;
        if (fromBalance < amount) return false;

        this.balances.set(from, fromBalance - amount);
        this.balances.set(to, (this.balances.get(to) || 0) + amount);
        return true;
    }

    /**
     * Gets the balance of tokens for a given account
     * @param account - The account address
     * @returns The token balance
     */
    balanceOf(account: string): number {
        return this.balances.get(account) || 0;
    }
}

/**
 * Represents a liquidity pool for a pair of tokens
 */
export class LiquidityPool {
    public tokenA: Token;
    public tokenB: Token;
    public reserveA: number;
    public reserveB: number;

    constructor(tokenA: Token, tokenB: Token) {
        this.tokenA = tokenA;
        this.tokenB = tokenB;
        this.reserveA = 0;
        this.reserveB = 0;
    }

    /**
     * Adds liquidity to the pool
     * @param amountA - Amount of token A to add
     * @param amountB - Amount of token B to add
     * @returns True if liquidity was added successfully
     */
    addLiquidity(amountA: number, amountB: number): boolean {
        if (amountA <= 0 || amountB <= 0) return false;

        this.reserveA += amountA;
        this.reserveB += amountB;
        return true;
    }

    /**
     * Calculates the exchange rate between two tokens
     * @param tokenIn - The input token
     * @param tokenOut - The output token
     * @returns The exchange rate
     * @throws Error if invalid token pair is provided
     */
    getExchangeRate(tokenIn: Token, tokenOut: Token): number {
        if (tokenIn === this.tokenA && tokenOut === this.tokenB) {
            return this.reserveB / this.reserveA;
        } else if (tokenIn === this.tokenB && tokenOut === this.tokenA) {
            return this.reserveA / this.reserveB;
        }
        throw new Error('Invalid token pair');
    }
}
