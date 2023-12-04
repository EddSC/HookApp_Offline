import { makeRequestGet } from '@/services/__mocks__/http'

// API
const API_ITEM = 'api/reporte/'
const API_ITEM_ANTERIOR = 'api/cumplimientoInicial/'
const API_ITEM_ANTERIORV2 = 'api/cumplimientoV2/'

export const getInforme = async (id:number) => {
    const response = await makeRequestGet(API_ITEM + id)
    return response
}

export const getInformePendiente = async (id:string) => {
    const response = await makeRequestGet(API_ITEM_ANTERIOR + id)
    return response
}

export const getInformePendienteV2 = async (id:string) => {
    const response = await makeRequestGet(API_ITEM_ANTERIORV2 + id)
    return response
}