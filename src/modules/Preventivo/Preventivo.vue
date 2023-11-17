<script setup lang="ts">
import {
    IonContent,
    useIonRouter,
    IonCard,
    IonFab,
    IonFabButton,
    IonIcon,
    IonLabel,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonSegment,
    InfiniteScrollCustomEvent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/vue';
import Header from '@/common/Header.vue';
import SegmentButton from '@/common/SegmentButton.vue';
import CardContent from '@/common/CardContent.vue';
import { onMounted, ref } from 'vue';
import { usePreventivoStore } from '@/stores/mPreventivoStore';
import { Preferences } from '@capacitor/preferences';
import { Upkeep } from '@/interfaces/mantenimientoInterface';


const mPreventivos = ref([] as Upkeep[]);

const router = useIonRouter();
const preventivoStore = usePreventivoStore();


const informePreventivo = (id: string) => {
    router.push('tab1/' + id);
}

const tareasPreventivos = (id: string) => {
    router.push('tab1/' + id);
}

const informeAnterior = (id: string) => {
    console.log('informe anterior', id);
}

const checkAuth = async () => {
    const data = await Preferences.get({ key: 'auth' });
    if (data.value) {
        const authData = JSON.parse(data.value)
        await preventivoStore.getPreventivo(Number(authData.idtuser));
        generateMantenimientoPreventivo()
    }
}

const generateMantenimientoPreventivo = () => {
    const count = mPreventivos.value.length;
    for (let p = 0; p < 6; p++) {
        if (preventivoStore.preventivoData[count + p] === undefined) {
            break;
        }
        mPreventivos.value.push(preventivoStore.preventivoData[count + p])
    }
}

const ionInfinite = async (ev: InfiniteScrollCustomEvent) => {
    generateMantenimientoPreventivo();
    await ev.target.complete();
};

const handleRefresh = async(event: CustomEvent) => {
    await checkAuth();
    event.detail.complete();
}

onMounted(() => {
    checkAuth();
});

</script>

<template>
    <Header color="orange" titulo="Mantenimiento Preventivo" />
    <ion-content :fullscreen="true" color="white">
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-card color="gray" v-for="mantenimiento in mPreventivos" :key="mantenimiento.idMantenimiento">
            <ion-fab vertical="top" horizontal="end">
                <ion-fab-button size="small" translucent:true mode="ios">
                    <ion-icon src="src/assets/icon/IconMantenimiento.svg"></ion-icon>
                </ion-fab-button>
            </ion-fab>

            <CardContent :mantenimiento="mantenimiento" @click="tareasPreventivos(mantenimiento.idMantenimiento)" />
            <ion-accordion-group>
                <ion-accordion>
                    <ion-item slot="header" class="ionItem" color="silver1">
                        <ion-label> Más Funciones</ion-label>
                    </ion-item>
                    <div slot="content">
                        <ion-segment>
                            <SegmentButton name="INFORME" @click="informePreventivo(mantenimiento.idMantenimiento)">
                            </SegmentButton>
                            <SegmentButton name="OBS. PENDIENTES" @click="informeAnterior(mantenimiento.idMantenimiento)">
                            </SegmentButton>
                            <SegmentButton name="INFORME" estado @click="informePreventivo(mantenimiento.idMantenimiento)">
                            </SegmentButton>
                        </ion-segment>
                    </div>
                </ion-accordion>
            </ion-accordion-group>
        </ion-card>
        <ion-infinite-scroll @ionInfinite="ionInfinite">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
    </ion-content>
</template>

<style scoped>
ion-icon {
    color: rgb(0, 0, 0);
    /* background: white; */
}

ion-fab-button {
    --background: #003249;
    --border-radius: 10px;
}
</style>