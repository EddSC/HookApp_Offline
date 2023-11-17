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
import { onMounted, provide, ref } from 'vue';
import type { InjectionKey } from 'vue';
import { useRoute } from 'vue-router';
import { Task } from '@/interfaces/mantenimientoInterface';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { showToast } from '@/helpers/showToast';
import { getTituloPreventivo } from '@/services/__mocks__/preventivo/tituloList';
import { usePreventivoStore } from '@/stores/mPreventivoStore';

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

const question: InjectionKey<string> = Symbol('question');
provide('question', '¿Desea eliminar el registro?');

const getTitulo = async () => {
    try {
        await presentLoading('Cargando...');
        const res = await getTituloPreventivo(id, Number(authStore.authId));
        if (res) {
            preventivoTitulo.value = res;
            preventivoTitulo.value.sort((a, b) => a.orden - b.orden);
            generateTitulos()
            return
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
    await getTitulo();
    event.detail.complete();
}

onMounted(() => {
    getTitulo()
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
    /* background-color: aliceblue; */
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