import { makeRequestGet } from '@/services/__mocks__/http'

// API
const API_MANTENIMIENTO_CORRECTIVO = 'api/correctivo/'

export const getMantenimientoCorrectivo = async (id:number) => {
    const response = await makeRequestGet(API_MANTENIMIENTO_CORRECTIVO + id)
    return response
}