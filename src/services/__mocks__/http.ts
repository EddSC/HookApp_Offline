import { CapacitorHttp, HttpResponse } from '@capacitor/core'
import { showToast } from '@/helpers/showToast';
// variables de entorno
const BASE_URL = import.meta.env.VITE_BASE_URL;


export const makeRequestPost = async (endpoint: string, data: any) => {
    return makeRequest('POST', endpoint, data);
};

export const makeRequestGet = async (endpoint: string) => {
    return makeRequest('GET', endpoint);
};

const makeRequest = async (method: string, endpoint: string, data?: any) => {
    try {
        const options = {
            method: method,
            url: `${BASE_URL}/${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };
        const res: HttpResponse = await CapacitorHttp.request(options);
        if (res.status === 200) {
            await showToast('La sincronización se realizó con éxito', 'success');
            return res.data;
        } else {
            await showToast('La solicitud no tuvo éxito', 'danger');
        }
    } catch (error) {
        await showToast('Ocurrió un error durante la solicitud, Se mostrarán los datos almacenados.', 'warning');
    }
};