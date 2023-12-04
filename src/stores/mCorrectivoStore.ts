import { defineStore } from 'pinia'
import { getMantenimientoCorrectivo } from '@/services/__mocks__/correctivo/mpList';
import { showToast } from '@/helpers/showToast';

export const useCorrectivoStore = defineStore('correctivoStore', () => {

    const getCorrectivo = async (id:number) => {
        try {
            const res = await getMantenimientoCorrectivo(id);
            return res;
        } catch (error) {
            await showToast('Ocurrió un error al obtener el mantenimiento preventivo', 'danger');
        }
    }

    return {
        getCorrectivo,
    }
})