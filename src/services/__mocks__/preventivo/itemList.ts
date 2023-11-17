import { makeRequestGet } from '@/services/__mocks__/http'

// API
const API_ITEM = 'api/callitemvt_iii/'

export const getItem = async (id:number, idOden:number) => {
    const response = await makeRequestGet(API_ITEM + id + '/' + idOden)
    return response
}