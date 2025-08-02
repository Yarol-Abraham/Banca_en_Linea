export interface CardResponse {
  status: boolean
  message: string
  data: Card[]
}

export interface Card {
  id: string
  cardNumber: string
  userName: string
  accountId: string
  type: string
  status: string
  expiresAt: string
}