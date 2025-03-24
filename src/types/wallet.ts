export interface IWallet {
    publicKey: string;
    Init(): void;
    sendMoney(amount: number, payee: IWallet, payeePublicKey: string): void;
}
