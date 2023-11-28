import { defineStore } from 'pinia'
import { Upkeep } from '@/interfaces/mantenimientoInterface';
import { getMantenimientoPreventivo } from '@/services/__mocks__/preventivo/mpList';
import { getTituloPreventivo } from '@/services/__mocks__/preventivo/tituloList';
import { getItem } from '@/services/__mocks__/preventivo/itemList';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { showToast } from '@/helpers/showToast';
import { ref } from 'vue';

export const usePreventivoStore = defineStore('preventivoStore', () => {
    const preventivoData = ref([] as Upkeep[]);
    // const preventivoTitulo = ref([] as Task[]);
    const preventivoTitulo = ref('' as string);
    const nameStorage = ref('gruas' as string);

    const setPreventivo = (data: Upkeep[]) => {
        preventivoData.value = data
    }

    const getPreventivo = async (id:number) => {
        try {
            await presentLoading('Cargando...');
            const res = await getMantenimientoPreventivo(id);
            if (res) {
                return res;
            }
        } catch (error) {
            await showToast('Ocurrió un error al obtener el mantenimiento preventivo', 'danger');
            return;
        } finally {
            await dismissLoading();
        }
    }

    const getTitulo = async (id:number, idUser:number) => {
        try {
            await presentLoading('Cargando...');
            const res = await getTituloPreventivo(id, idUser);
            if (res) {
                return res;
            }
        } catch (error) {
            await showToast('Ocurrió un error al obtener el Titulo', 'danger');
            return [];
        } finally {
            await dismissLoading();
        }
    }

    const getItems = async (id:number, orden:number) => {
        try {
            const res = await getItem(id, orden);
            if (res) {
                return res;
            }
        } catch (error) {
            await showToast('Ocurrió un error al obtener el Item', 'danger');
            return [];
        }
    }

    const tituloItem = (titulo:string) => {
        preventivoTitulo.value = titulo;
    }

    return {
        preventivoData,
        preventivoTitulo,
        setPreventivo,
        getPreventivo,
        getTitulo,
        tituloItem,
        getItems,
        nameStorage
    }
})