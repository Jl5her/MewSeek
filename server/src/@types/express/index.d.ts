export {}

declare global {
  namespace Express {
    interface Request {
      access_token?: string
    }
  }
}