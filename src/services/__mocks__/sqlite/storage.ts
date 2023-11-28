
import { Storage, Drivers } from '@ionic/storage';
import { onMounted } from 'vue';

export const useStorage = () => {
    const db = new Storage({
        name: '__mydb',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    });
    
    const insertarElemento = async (storage:string, id:string, dato:object) => {
        try {
            const key = `${storage}_${id}`;
            await db.set(key, JSON.stringify(dato));
        } catch (error) {
            console.log(error);
        }
    }
    
    const obtenerElemento = async (storage:string, id:string) => {
        try {
            const key = `${storage}_${id}`;
            const res = await db.get(key);
            return res ? JSON.parse(res):[];
        } catch (error) {
            console.log(error);
        }
    }

    onMounted(async () => {
        await db.create();
    });

    return {
        insertarElemento,
        obtenerElemento
    }
}

