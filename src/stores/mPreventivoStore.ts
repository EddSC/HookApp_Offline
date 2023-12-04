import { defineStore } from 'pinia'
import { Upkeep,TaskDetail } from '@/interfaces/mantenimientoInterface';
import { getMantenimientoPreventivo } from '@/services/__mocks__/preventivo/mpList';
import { getTituloPreventivo } from '@/services/__mocks__/preventivo/tituloList';
import { getItem } from '@/services/__mocks__/preventivo/itemList';
import { showToast } from '@/helpers/showToast';
import { ref, computed } from 'vue';

export const usePreventivoStore = defineStore('preventivoStore', () => {
    const preventivoData = ref([] as Upkeep[]);
    const preventivoTitulo = ref('' as string);
    const nameStorage = ref('gruas' as string);
    const preventivoItems = ref([] as TaskDetail[]);
    const mItems = ref([] as TaskDetail[]);
    const setPreventivo = (data: Upkeep[]) => {
        preventivoData.value = data
    }

    const itemPendiente = computed(() => {
        return mItems.value.filter(item => item.Condicion === 'nocolor');
    });
    
    const itemCompletado = computed(() => {
        return mItems.value.filter(item => item.Condicion !== 'nocolor');
    });

    const getPreventivo = async (id:number) => {
        try {
            const res = await getMantenimientoPreventivo(id);
            return res;
        } catch (error) {
            await showToast('Ocurrió un error al obtener el mantenimiento preventivo', 'danger');
        }
    }

    const getTitulo = async (id:number, idUser:number) => {
        try {
            
            const res = await getTituloPreventivo(id, idUser);
            return res;
        } catch (error) {
            await showToast('Ocurrió un error al obtener el Titulo', 'danger');
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

    const setItems = (data: TaskDetail[]) => {
        preventivoItems.value = data
    }

    const resetItems = () => {
        mItems.value = [];
    }

    const generateItems = () => {
        const count = mItems.value.length;
        for (let p = 0; p < 42; p++) {
            if (preventivoItems.value[count + p] === undefined) {
                break;
            }
            mItems.value.push(preventivoItems.value[count + p])
        }
    }

    const procesarEstadoItem = (id_item: number) => {
        preventivoItems.value = preventivoItems.value.map(t => t.id_item === id_item ? { ...t, estado: 'processed' } : t)
        mItems.value = mItems.value.map(t => t.id_item === id_item ? { ...t, estado: 'processed' } : t)
        return preventivoItems.value
    }

    return {
        preventivoData,
        preventivoTitulo,
        setPreventivo,
        getPreventivo,
        getTitulo,
        tituloItem,
        getItems,
        nameStorage,
        mItems,
        setItems,
        generateItems,
        procesarEstadoItem,
        itemPendiente,
        itemCompletado,
        preventivoItems,
        resetItems
    }
})