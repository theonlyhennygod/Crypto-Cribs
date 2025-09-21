import { Client, Payment, TxResponse, AccountInfoRequest } from 'xrpl'

// XRPL Client for handling cross-chain payments
export class XRPLClient {
  private client: Client
  private isConnected: boolean = false

  constructor(serverUrl?: string) {
    // Use testnet by default, mainnet for production
    const defaultServer = process.env.NODE_ENV === 'production' 
      ? 'wss://xrplcluster.com'
      : 'wss://s.altnet.rippletest.net:51233'
    
    this.client = new Client(serverUrl || defaultServer)
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect()
      this.isConnected = true
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect()
      this.isConnected = false
    }
  }

  /**
   * Create a payment transaction for booking
   */
  async createBookingPayment(
    sourceWallet: string,
    destinationWallet: string,
    amountXRP: string,
    bookingId: string
  ): Promise<Payment> {
    await this.connect()

    const payment: Payment = {
      TransactionType: 'Payment',
      Account: sourceWallet,
      Amount: this.xrpToDrops(amountXRP),
      Destination: destinationWallet,
      Memos: [
        {
          Memo: {
            MemoType: Buffer.from('CryptoCribs', 'utf8').toString('hex').toUpperCase(),
            MemoData: Buffer.from(`booking-${bookingId}`, 'utf8').toString('hex').toUpperCase(),
          },
        },
      ],
    }

    return payment
  }

  /**
   * Submit a signed payment transaction
   */
  async submitPayment(signedTx: any): Promise<TxResponse> {
    await this.connect()
    return await this.client.submitAndWait(signedTx)
  }

  /**
   * Get transaction details by hash
   */
  async getTransaction(txHash: string): Promise<any> {
    await this.connect()
    return await this.client.request({
      command: 'tx',
      transaction: txHash,
    })
  }

  /**
   * Get account balance
   */
  async getAccountBalance(address: string): Promise<string> {
    await this.connect()
    
    const accountInfo: AccountInfoRequest = {
      command: 'account_info',
      account: address,
    }
    
    const response = await this.client.request(accountInfo)
    return this.dropsToXrp(response.result.account_data.Balance)
  }

  /**
   * Validate XRPL address
   */
  isValidAddress(address: string): boolean {
    // Basic XRPL address validation
    return /^r[a-zA-Z0-9]{24,34}$/.test(address)
  }

  /**
   * Convert XRP to drops (1 XRP = 1,000,000 drops)
   */
  private xrpToDrops(xrp: string): string {
    return (parseFloat(xrp) * 1000000).toString()
  }

  /**
   * Convert drops to XRP
   */
  private dropsToXrp(drops: string): string {
    return (parseInt(drops) / 1000000).toString()
  }

  /**
   * Format amount for display
   */
  formatXRP(drops: string): string {
    const xrp = this.dropsToXrp(drops)
    return `${parseFloat(xrp).toFixed(6)} XRP`
  }

  /**
   * Check if payment matches booking requirements
   */
  validateBookingPayment(
    transaction: any,
    expectedAmount: string,
    expectedDestination: string,
    bookingId: string
  ): boolean {
    // Check amount
    if (transaction.Amount < this.xrpToDrops(expectedAmount)) {
      return false
    }

    // Check destination
    if (transaction.Destination !== expectedDestination) {
      return false
    }

    // Check memo contains booking ID
    const memos = transaction.Memos || []
    const bookingMemo = memos.find((memo: any) => {
      const memoData = Buffer.from(memo.Memo.MemoData, 'hex').toString('utf8')
      return memoData.includes(`booking-${bookingId}`)
    })

    return !!bookingMemo
  }
}

// Singleton instance
export const xrplClient = new XRPLClient()

// Helper functions for components
export const formatXRPAmount = (drops: string | number): string => {
  const xrp = (Number(drops) / 1000000).toFixed(6)
  return `${xrp} XRP`
}

export const xrpToUSD = (xrpAmount: string, xrpPrice: number): string => {
  const usd = parseFloat(xrpAmount) * xrpPrice
  return `$${usd.toFixed(2)}`
}

export const usdToXRP = (usdAmount: string, xrpPrice: number): string => {
  const xrp = parseFloat(usdAmount) / xrpPrice
  return xrp.toFixed(6)
}
