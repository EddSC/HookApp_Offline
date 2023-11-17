<script setup lang="ts">
import { 
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
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent 
} from '@ionic/vue';
import { heart, caretForwardOutline } from 'ionicons/icons';
import HeaderBack from '@/common/HeaderBack.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { TaskDetail } from '@/interfaces/mantenimientoInterface';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { showToast } from '@/helpers/showToast';
import { getItem } from '@/services/__mocks__/preventivo/itemList';
import { usePreventivoStore } from '@/stores/mPreventivoStore';

const route = useRoute();
const preventivoStore = usePreventivoStore();

const id = Number(route.params.id);
const orden = Number(route.params.idOden);


const preventivoItems = ref([] as TaskDetail[]);
const mItems= ref([] as TaskDetail[]);

const getItems = async () => {
    try {
        await presentLoading('Cargando...');
        const res = await getItem(id, orden);
        if (res) {
            preventivoItems.value = res;
            generateItems()
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

const generateItems = () => {
    const count = mItems.value.length;
    for (let p = 0; p < 21; p++) {
        if (preventivoItems.value[count+p] === undefined) {
            break;
        }
        mItems.value.push(preventivoItems.value[count + p])
    }
}

const ionInfinite = async(ev: InfiniteScrollCustomEvent) => {
    generateItems();
    await ev.target.complete();
}

const handleRefresh = async(event: CustomEvent) => {
    await getItems();
    event.detail.complete();
}

onMounted(() => {
    getItems()
});

</script>

<template>
    <HeaderBack :titulo="preventivoStore.preventivoTitulo" color="orange" :id="id" />
    <ion-content :fullscreen="true" color="white">
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-list>
            <ion-item-sliding v-for="item in mItems" :key="item.id_item">

                <ion-item :class="[item.Condicion === 'nocolor' ? 'param_no' : 'param_si']" button :detail="true" :detailIcon="caretForwardOutline">
                    <ion-note slot="start"><b>{{ item.num_ord }} |</b></ion-note>
                    <ion-label class="ion-text-wrap custom-label">{{ item.Item }}</ion-label>
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
    --background: #BFBFBF;
    --color: black;
}
</style>