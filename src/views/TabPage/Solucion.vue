<template>
    <ion-page>
        <Header titulo="Soluciones" color="bluedark" />
        <ion-content :fullscreen="true" color="white">
            <ion-list>
                <ion-item>
                    <ion-input aria-label="Insert" v-model='insert'></ion-input>
                    <ion-button @click="insertDataDB()">Insert</ion-button>
                </ion-item>
                <ion-item v-for="item in items" :key="item.id">
                    <ion-label>{{ item.idMantenimiento }} - {{ item.numreporte }}</ion-label>
                    <ion-button @click="update(item.idMantenimiento)">Update</ion-button>
                    <ion-button @click="deleteDatas(item.idMantenimiento)">Delete</ion-button>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    onIonViewDidEnter,
    onIonViewDidLeave,
    IonInput,
    IonButton
} from '@ionic/vue';
import Header from '@/common/Header.vue';
import { useAuthStore } from '@/stores/authStore';
import { initializeDatabase, closeSQLiteConnection, getData, insertData, deleteData, updateData } from '@/services/__mocks__/sqlite/database'
import { ref } from 'vue';
import { usePreventivoStore } from '@/stores/mPreventivoStore';


// variables
const authStore = useAuthStore();
const items = ref<any>();
const insert = ref('');
const preventivoStore = usePreventivoStore();
const data = ref(null)

onIonViewDidEnter(async () => {
    console.log('ionViewDidEnter');
    await initializeDatabase();
    // const res = await preventivoStore.getPreventivo(31);
    // if (res) {
    //     await insertData('mantenimiento', res);
    // }
    await synchronizeData();
});
onIonViewDidLeave(async () => {
    await closeSQLiteConnection();
    console.log('ionViewDidLeave');
});

const loadList = async () => {
    const data = await getData();
    items.value = data;
};

const insertDataDB = async () => {
    // await insertData(insert.value);
    await loadList();
};

const deleteDatas = async (id: number) => {
    try {
        await deleteData('mantenimiento', 'idMantenimiento = ?', [id]);
        const datosEliminados = await getData(); // Obtener los datos después de la eliminación
        const seElimino = !datosEliminados.some((dato:any) => dato.idMantenimiento === id);
        if (seElimino) {
            console.log('El dato se eliminó correctamente.');
        } else {
            console.log('El dato no se eliminó correctamente o todavía existe en la base de datos.');
        }

    } catch (error) {
        console.error('Error al eliminar los datos:', error);
    }finally{
        await loadList();
    }
};

const update = async (id: number) => {
    try {
        const data = {
            numreporte: '123456789',
            idMantenimiento: id
        }
        await updateData('mantenimiento', data, 'idMantenimiento = ?', [id]);
    } catch (error) {
        console.error('Error al actualizar los datos:', error);
    }finally{
        await loadList();
    }
};

const synchronizeData = async () => {
    try {
        const apiData  = await preventivoStore.getPreventivo(31);
        const dbData  = await getData();

         // Identificar datos a insertar, eliminar y actualizar
        const dataToInsert = apiData.filter((apiItem:any) => !dbData.some((dbItem:any) => dbItem.idMantenimiento === apiItem.idMantenimiento));
        const dataToDelete = dbData.filter((dbItem:any) => !apiData.some((apiItem:any) => apiItem.idMantenimiento === dbItem.idMantenimiento));
        const dataToUpdate = apiData.filter((apiItem:any) =>
            dbData.some(
                (dbItem:any) =>
                    dbItem.idMantenimiento === apiItem.idMantenimiento &&
                    JSON.stringify(dbItem) !== JSON.stringify(apiItem)
            )
        );

        // Insertar datos que no existen en la base de datos
        if (dataToInsert.length > 0) {
            await insertData('mantenimiento', dataToInsert);
        }

         // Eliminar datos que no están en la respuesta de la API
         if (dataToDelete.length > 0) {
            const idsToDelete = dataToDelete.map((item:any) => item.idMantenimiento);
            for (const id of idsToDelete) {
                await deleteData('mantenimiento', 'idMantenimiento = ?', [id]);
            }
        }

        // Actualizar datos que han cambiado
        if (dataToUpdate.length > 0) {
            for (const updatedItem of dataToUpdate) {
                await updateData('mantenimiento', updatedItem, 'idMantenimiento = ?', [updatedItem.idMantenimiento]);
            }
        }
        console.log('Sincronización exitosa');
    } catch (error) {
        console.error('Error al sincronizar:', error);
    } finally {
        await loadList();
    }
}

</script>