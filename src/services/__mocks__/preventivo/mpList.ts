import { makeRequestGet } from '@/services/__mocks__/http'

// API
const API_MANTENIMIENTO_PREVENTIVO = 'api/callrep/'

export const getMantenimientoPreventivo = async (id:number) => {
    const response = await makeRequestGet(API_MANTENIMIENTO_PREVENTIVO + id)
    return response
}