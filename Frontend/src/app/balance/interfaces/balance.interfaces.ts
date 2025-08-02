export interface AccountResponse {
  status: boolean
  message: string
  data: Account[]
}

export interface Account {
  id: string
  accountNumber: string
  balance: number
  currency: string
  createdAt: string
}
