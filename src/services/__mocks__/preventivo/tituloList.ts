import { makeRequestGet } from '@/services/__mocks__/http'

// API
const API_TITULO = 'api/calltitulo/'

export const getTituloPreventivo = async (id:number, idUser:number) => {
    const response = await makeRequestGet(API_TITULO + id + '/' + idUser)
    return response
}