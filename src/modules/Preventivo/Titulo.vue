<script setup lang="ts">
import { 
    useIonRouter, 
    IonIcon, 
    IonItem, 
    IonItemOption, 
    IonItemOptions, 
    IonItemSliding, 
    IonLabel, 
    IonList, 
    IonContent, 
    IonNote,
    InfiniteScrollCustomEvent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent, 
} from '@ionic/vue';
import { heart, caretForwardOutline } from 'ionicons/icons';
import HeaderBack from '@/common/HeaderBack.vue';
import { useAuthStore } from '@/stores/authStore';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Task } from '@/interfaces/mantenimientoInterface';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { showToast } from '@/helpers/showToast';
import { getTituloPreventivo } from '@/services/__mocks__/preventivo/tituloList';
import { usePreventivoStore } from '@/stores/mPreventivoStore';
import { insertData, deleteData, updateData, getDataCondicion, getDataItems } from '@/services/__mocks__/sqlite/database';

const authStore = useAuthStore();
const route = useRoute();
const router = useIonRouter();
const preventivoStore = usePreventivoStore();


const id = Number(route.params.id);
const preventivoTitulo = ref([] as Task[]);
const mTitulos = ref([] as Task[]);


const getItem = (orden: number, titulo:string) => {
    preventivoStore.tituloItem(titulo)
    router.push(id+'/'+orden)
}

const getTitulo = async () => {
    try {
        const res = await getTituloPreventivo(id, Number(authStore.authId));
        if (res) {
            return res.sort((a:any, b:any) => a.orden - b.orden);
        } else {
            await showToast('No se encontraron datos', 'danger');
            return [];
        }
    } catch (error) {
        await showToast('Ocurrió un error al obtener el mantenimiento preventivo', 'danger');
        return [];
    } finally {
        console.log('Finalizado');
    }
}

const syncTask = async () => {
    try {
            await presentLoading('Cargando Tareas...');

            const apiData  = await getTitulo();
            const dbData  = await getDataCondicion('task', 'IdMant = ?', String(id));

            const dataToInsert = apiData.filter((apiItem:any) => !dbData.some((dbItem:any) => dbItem.orden === apiItem.orden));
            const dataToDelete = dbData.filter((dbItem:any) => !apiData.some((apiItem:any) => apiItem.orden === dbItem.orden));
            const dataToUpdate = apiData.filter((apiItem:any) =>
                dbData.some(
                    (dbItem:any) =>
                        dbItem.orden === apiItem.orden &&
                        JSON.stringify(dbItem) !== JSON.stringify(apiItem)
                )
            );
            
            // Insertar datos que no existen en la base de datos
            if (dataToInsert.length > 0) {
                await insertData('task', dataToInsert);
            }

            // Eliminar datos que no están en la respuesta de la API
            if (dataToDelete.length > 0) {
                const idsToDelete = dataToDelete.map((item:any) => item.orden);
                for (const id of idsToDelete) {
                    await deleteData('task', 'orden = ?', [id]);
                }
            }

            // Actualizar datos que han cambiado
            if (dataToUpdate.length > 0) {
                for (const updatedItem of dataToUpdate) {
                    await updateData('task', updatedItem, 'orden = ?', [updatedItem.orden]);
                }
            }

        const datos =  await getDataCondicion('task', 'IdMant = ?', String(id));
        preventivoTitulo.value = datos;
        generateTitulos()
        await syncTaskDetails(datos);
    } catch (error) {
        console.error('Error al sincronizar:', error);
    } finally {
        await dismissLoading();
    }
}

const syncTaskDetails = async (data:any[]) => {
    try {
        await presentLoading('Cargando Items...');
        for(const tarea of data){
            
            const apiData  = await preventivoStore.getItems(tarea.IdMant, tarea.orden);
            const dbData  = await getDataItems('taskdetail', 'IdMantenimiento = ? AND IdTitulo = ?', tarea.IdMant, tarea.orden);
            
            const dataToInsert = apiData.filter((apiItem:any) => !dbData.some((dbItem:any) => dbItem.num_ord === apiItem.num_ord));
            const dataToDelete = dbData.filter((dbItem:any) => !apiData.some((apiItem:any) => apiItem.num_ord === dbItem.num_ord));
            const dataToUpdate = apiData.filter((apiItem:any) =>
                dbData.some(
                    (dbItem:any) =>
                        dbItem.num_ord === apiItem.num_ord &&
                        JSON.stringify(dbItem) !== JSON.stringify(apiItem)
                )
            );
            
            // Insertar datos que no existen en la base de datos
            if (dataToInsert.length > 0) {
                await insertData('taskdetail', dataToInsert);
            }

            // Eliminar datos que no están en la respuesta de la API
            if (dataToDelete.length > 0) {
                const idsToDelete = dataToDelete.map((item:any) => item.num_ord);
                for (const id of idsToDelete) {
                    await deleteData('taskdetail', 'num_ord = ?', [id]);
                }
            }

            // Actualizar datos que han cambiado
            if (dataToUpdate.length > 0) {
                for (const updatedItem of dataToUpdate) {
                    await updateData('taskdetail', updatedItem, 'num_ord = ?', [updatedItem.num_ord]);
                }
            }
        }
    } catch (error) {
        console.error('Error al sincronizar:', error);
    } finally {
        await dismissLoading();
    }
}

const generateTitulos = () => {
    const count = mTitulos.value.length;
    for (let p = 0; p < 21; p++) {
        if (preventivoTitulo.value[count+p] === undefined) {
            break;
        }
        mTitulos.value.push(preventivoTitulo.value[count + p])
    }
}

const ionInfinite = async(ev: InfiniteScrollCustomEvent) => {
    generateTitulos();
    await ev.target.complete();
}

const handleRefresh = async(event: CustomEvent) => {
    await syncTask();
    event.detail.complete();
}

onMounted(() => {
    syncTask()
});

</script>

<template>
    <HeaderBack titulo="Tareas" color="orange" :id="id" />
    <ion-content :fullscreen="true" color="white">
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-list>
            <ion-item-sliding v-for="titulo in mTitulos" :key="titulo.Id">

                <ion-item @click="getItem(titulo.orden, titulo.Titulodescripcion)" :class="[titulo.parametros !== 'si' ? 'param_no' : 'param_si']" button :detail="true" :detailIcon="caretForwardOutline">
                    <ion-note slot="start"><b>{{ titulo.orden }} |</b></ion-note>
                    <ion-label class="custom-label">{{ titulo.Titulodescripcion }}</ion-label>
                </ion-item>

                <ion-item-options side="end" class="custom-item-options">
                    <ion-item-option class="custom-item-option">
                        <ion-icon class="custom-icon" slot="icon-only" :icon="heart"></ion-icon>
                    </ion-item-option>
                </ion-item-options>
            </ion-item-sliding>
        </ion-list>
        <ion-infinite-scroll @ionInfinite="ionInfinite">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
    </ion-content>
</template>

<style scoped>
ion-list {
    padding: 0;
}

.custom-label {
    font-size: 1rem;
    font-weight: bold;
}

ion-note {
    color: #007EA7;
    font-size: 1.1rem;
}

.itemOrd {
    color: #EAB117;
}

.param_no {
    --background: #E4E2E1;
    --color: #000000;
}

.param_si {
    --background: rgb(177, 207, 218);
    --color: black;
}
</style>