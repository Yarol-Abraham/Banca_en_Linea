export interface MovementResponse {
  success: boolean
  message: string
  data: Movement[]
}

export interface Movement {
  _id: string
  fromAccount: string
  amount: number
  type: string
  description: string
  timestamp: string
  __v: number
}

export interface TransferResponse {
  status: boolean
  message: string
}