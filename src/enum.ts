export enum Platform {
  PUMP = 'pump',
  APE = 'ape',
}

export enum Network {
  SOLANA = 'solana',
  BASE = 'base',
  ETH = 'eth',
}

export enum TransactionType {
  CREATE = 'create',
  BUY = 'buy',
  SELL = 'sell',
  SWAP = 'swap',
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum RefundStatus {
  YES = 'yes',
  NO = 'no',
  PENDING = 'pending',
}

export enum ProcessCurrentProgress {
  STEP_1_FUND = 'fund',
  STEP_2_LAUNCH = 'launch',
  STEP_3_BUY = 'buy',
  STEP_4_REFUND = 'refund',
  STEP_5_SELL = 'sell',
  STEP_6_SEND_FUND_BACK = 'send-fund-back',
}
