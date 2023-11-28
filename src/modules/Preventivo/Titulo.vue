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
import { caretForwardOutline, speedometerOutline } from 'ionicons/icons';
import HeaderBack from '@/common/HeaderBack.vue';
import { useAuthStore } from '@/stores/authStore';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Task, TaskDetail } from '@/interfaces/mantenimientoInterface';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { showToast } from '@/helpers/showToast';
import { getTituloPreventivo } from '@/services/__mocks__/preventivo/tituloList';
import { usePreventivoStore } from '@/stores/mPreventivoStore';
import { useStorage } from '@/services/__mocks__/sqlite/storage';


const { insertarElemento, obtenerElemento } = useStorage();

const authStore = useAuthStore();
const route = useRoute();
const router = useIonRouter();
const preventivoStore = usePreventivoStore();

const id = Number(route.params.id);
const preventivoTitulo = ref([] as Task[]);
const mTitulos = ref([] as Task[]);


const getItem = (orden: number, titulo: string) => {
    preventivoStore.tituloItem(titulo)
    router.push(id + '/' + orden)
}

const mapTaskDetail = (taskDetail: TaskDetail[], estado: string) => {
    return taskDetail.map((e) => {
        return {
            ...e,
            estado: estado
        }
    })
};
const mapTaskDetail2 = (taskDetail: TaskDetail[]) => {
    return taskDetail.map((e) => {
        return {
            IdMantenimiento: e.IdMantenimiento,
            IdTitulo: e.IdTitulo,
            id_item: e.id_item,
            Item: e.Item,
            num_ord: e.num_ord,
            Prioridad: e.Prioridad,
            Status: e.Status,
            Completo: e.Completo,
            Condicion: e.Condicion,
        }
    })
};

const getTitulo = async () => {
    try {
        const res = await getTituloPreventivo(id, Number(authStore.authId));
        return res;
    } catch (error) {
        await showToast('Ocurrió un error al obtener Titulos', 'danger');
    } finally {
        console.log('Finalizado');
    }
}

const syncTask = async () => {
    try {
        await presentLoading('Cargando Tareas...');

        const apiData = await getTitulo();
        const dbData = await obtenerElemento('pTitulo', String(id));

        if(!apiData){
            const datos = await obtenerElemento('pTitulo', String(id));
            preventivoTitulo.value = datos.sort((a: any, b: any) => a.orden - b.orden);
            generateTitulos()
            return
        }

        // Actualizar datos que han cambiado
        if (JSON.stringify(apiData) !== JSON.stringify(dbData)) {
            await insertarElemento('pTitulo', String(id), apiData);
        }

        const datos = await obtenerElemento('pTitulo', String(id));
        preventivoTitulo.value = datos.sort((a: any, b: any) => a.orden - b.orden);
        generateTitulos()
        await syncTaskDetails(datos);
    } catch (error) {
        console.error('Error al sincronizar:', error);
    } finally {
        await dismissLoading();
    }
}

const syncTaskDetails = async (data: any[]) => {
    try {
        await presentLoading('Cargando Items...');
        for (const tarea of data) {

            const apiData = await preventivoStore.getItems(tarea.IdMant, tarea.orden);
            const apiDataItem = mapTaskDetail(apiData, 'pending')

            const dbDataItem = await obtenerElemento('pItem', `${String(id)}${String(tarea.orden)}${String(authStore.authId)}`);
            const dbData = mapTaskDetail2(dbDataItem)

            if (!apiData) {
                await showToast('No se encontraron datos', 'danger');
                return
            }

            // Actualizar datos que han cambiado
            if (JSON.stringify(apiData) !== JSON.stringify(dbData)) {
                await insertarElemento('pItem', `${String(id)}${String(tarea.orden)}${String(authStore.authId)}`, apiDataItem);
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
        if (preventivoTitulo.value[count + p] === undefined) {
            break;
        }
        mTitulos.value.push(preventivoTitulo.value[count + p])
    }
}

const ionInfinite = async (ev: InfiniteScrollCustomEvent) => {
    generateTitulos();
    await ev.target.complete();
}

const handleRefresh = async (event: CustomEvent) => {
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

                <ion-item @click="getItem(titulo.orden, titulo.Titulodescripcion)"
                    :class="[titulo.parametros !== 'si' ? 'param_no' : 'param_si']" button :detail="true"
                    :detailIcon="caretForwardOutline">
                    <ion-note slot="start"><b>{{ titulo.orden }} |</b></ion-note>
                    <ion-label class="custom-label">{{ titulo.Titulodescripcion }}</ion-label>
                </ion-item>

                <ion-item-options side="end" class="custom-item-options">
                    <ion-item-option class="custom-item-option">
                        <ion-icon class="custom-icon" slot="icon-only" :icon="speedometerOutline"></ion-icon>
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

.custom-item-option {
    --border-radius: 10%;
    --background: #003249;
    --color: white
}
</style>