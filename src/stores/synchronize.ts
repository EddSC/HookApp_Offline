import { defineStore } from 'pinia'
import { showToast } from '@/helpers/showToast';
import { computed, ref } from 'vue';
import { TaskDetails } from '@/interfaces/mantenimientoInterface';

export const useSynchronize = defineStore('synchronizeStore', () => {

    const pendientes = ref<TaskDetails[]>([] as TaskDetails[]);

    const pendientesProcesados = computed(() => {
        return pendientes.value.reduce((contador, mant) => {
            if (mant.status === 'processed') {
                contador++;
            }
            return contador;
        }, 0);
    });

    const pendientesPendientes = computed(() => {
        return pendientes.value.reduce((contador, mant) => {
            if (mant.status === 'pending') {
                contador++;
            }
            return contador;
        }, 0);
    });

    const procesarEstado = async (id: string) => {
        try {
            pendientes.value = pendientes.value.map(mant => {
                if (mant.id === id) {
                    return { ...mant, status: 'processed' };
                }
                return mant;
            });
        } catch (error) {
            await showToast('Error al procesar el estado', 'danger')
        }
    }

    const copiarPendientes = (pending: TaskDetails[]) => {
        pendientes.value = pending;
    }

    const setPendientes = (pending: TaskDetails) => {
        pendientes.value.push(pending);
    }

    const eliminarActividad = async (id: string) => {
        try {
            pendientes.value = pendientes.value.filter(mant => mant.id !== id);
        } catch (error) {
            await showToast('Error al eliminar la actividad', 'danger')
        }
    }

    return {
        procesarEstado,
        copiarPendientes,
        setPendientes,
        pendientesProcesados,
        pendientesPendientes,
        pendientes,
        eliminarActividad,
    }
})