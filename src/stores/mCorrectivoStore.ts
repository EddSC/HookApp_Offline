import { defineStore } from 'pinia'
import { Upkeep } from '@/interfaces/mantenimientoInterface';
import { getMantenimientoCorrectivo } from '@/services/__mocks__/correctivo/mpList';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { showToast } from '@/helpers/showToast';
import { ref } from 'vue';

export const useCorrectivoStore = defineStore('correctivoStore', () => {
    const correctivoData = ref([] as Upkeep[]);

    const getCorrectivo = async (id:number) => {
        try {
            await presentLoading('Cargando...');
            const res = await getMantenimientoCorrectivo(id);
            if (res) {
                correctivoData.value = res;
                return res;
            } else {
                await showToast('No se encontraron datos', 'danger');
                return [];
            }
        } catch (error) {
            await showToast('Ocurrió un error al obtener el mantenimiento preventivo', 'danger');
            return [];
        } finally {
            await dismissLoading();
        }
    }

    return {
        correctivoData,
        getCorrectivo
    }
})