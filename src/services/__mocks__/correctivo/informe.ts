import { makeRequestGet } from '@/services/__mocks__/http'

// API
const API_ITEM = 'api/correctivoInforme/'
const API_ITEM_ANTERIOR = 'api/cumplimientoInicial/'
const API_ITEM_ANTERIORV2 = 'api/cumplimientoV2/'

export const getInforme = async (id:number) => {
    const response = await makeRequestGet(API_ITEM + id)
    return response
}

export const getInformePendiente = async (serie:string) => {
    const response = await makeRequestGet(API_ITEM_ANTERIOR + serie)
    return response
}

export const getInformePendienteV2 = async (serie:string) => {
    const response = await makeRequestGet(API_ITEM_ANTERIORV2 + serie)
    return response
}