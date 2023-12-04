
import { Storage, Drivers } from '@ionic/storage';
import { onMounted } from 'vue';
import { TaskDetails } from '@/interfaces/mantenimientoInterface';
import { useSynchronize } from '@/stores/synchronize';
import { showToast } from '@/helpers/showToast';

const { setPendientes } = useSynchronize();
const db = new Storage({
    name: '__mydb',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
});

export const useStorage = () => {

    const insertarDatos = async (storage: string, id: string, dato: object) => {
        try {
            const key = `${storage}_${id}`;
            await db.set(key, JSON.stringify(dato));
        } catch (error) {
            console.log(error);
        }
    }

    const insertarElemento = async (storage: string, id: string, dato: object) => {
        try {
            const key = `${storage}_${id}`;
            await db.set(key, JSON.stringify(dato));
            setPendientes(dato as TaskDetails);
        } catch (error) {
            console.log(error);
        }
    }

    const obtenerElemento = async (storage: string, id: string) => {
        try {
            const key = `${storage}_${id}`;
            const res = await db.get(key);
            return res ? JSON.parse(res) : [];
        } catch (error) {
            console.log(error);
        }
    }


    const obtenerActividades = async (storage: string): Promise<TaskDetails[]> => {
        try {
            const actividades: TaskDetails[] = [];
            await db.forEach((value, key) => {
                if (key.startsWith(`${storage}_`)) {
                    actividades.push(JSON.parse(value));
                }
            });
            return actividades;
        } catch (error) {
            return [];
        }
    };

    const eliminarActividad = async (storage: string, id: string) => {
        try {
            const key = `${storage}_${id}`;
            await db.remove(key);
            return 'Eliminado'
        } catch (error) {
            await showToast('Error al eliminar la actividad', 'danger')
        }
    };

    const deleteDB = async () => {
        try {
            await db.clear();
        } catch (error) {
            await showToast('Error al eliminar la base de datos', 'danger')
        }
    }

    onMounted(async () => {
        await db.create();
    });

    return {
        insertarElemento,
        obtenerElemento,
        insertarDatos,
        obtenerActividades,
        updateActividad,
        eliminarActividad,
        deleteDB,
    }
}

export const inicializarDB = async () => {
    await db.create();
}

export const updateActividad = async (storage: string, id: string) => {
    const key = `${storage}_${id}`;
    try {
        const existingData = await db.get(key);
        if (!existingData) {
            console.dir('No se encontró el registro');
            return false;
        }
        const existingDataJson = JSON.parse(existingData);
        existingDataJson.status = 'processed';

        const updatedData = { ...existingDataJson };
        await db.set(key, JSON.stringify(updatedData));
        return true;
    } catch (error) {
        return false;
    }
};
