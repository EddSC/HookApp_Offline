import { makeRequestPost } from '@/services/__mocks__/http'
import { LoginInterface } from '@/interfaces/loginInterface'

// API
const API_AUTH = 'api/token'

export const authenticate = async (credentials:LoginInterface) => {
    const response = makeRequestPost(API_AUTH, credentials)
    return response
}