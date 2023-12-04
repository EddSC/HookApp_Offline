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
import { Preferences } from '@capacitor/preferences';
import { Upkeep } from '@/interfaces/mantenimientoInterface';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { showToast } from '@/helpers/showToast';
import { useCorrectivoStore } from '@/stores/mCorrectivoStore';
import { presentLoading, dismissLoading } from '@/helpers/loading';

const { insertarDatos, obtenerElemento } = useStorage();

const mCorrectivo = ref([] as Upkeep[]);
const items = ref<any>();
const id = ref(0);

const router = useIonRouter();
const correctivoStore = useCorrectivoStore();


const informeCorrectivo = (id: string) => {
    router.push('tab2/informe/' + id);
}

const informeAnterior = async(id: string, serie?: string) => {
    if (!serie) return await showToast('No se pudo obtener la serie', 'danger');
    router.push('tab2/informe-pendiente/' + id + '/' + serie);
}

const tareasCorrectivos = (id: string) => {
    router.push('tab2/' + id);
}

const ActividadRealizado = (idmant: string) => {
    router.push('tab2/actividad-realizado/' + idmant + '/' + id.value);
}


const checkAuth = async () => {
    const data = await Preferences.get({ key: 'auth' });
    if (data.value) {
        const authData = JSON.parse(data.value)
        id.value = Number(authData.idtuser)
        const res = await correctivoStore.getCorrectivo(Number(authData.idtuser));
        return res;
    }
}

const generateMantenimientoPreventivo = () => {
    const count = mCorrectivo.value.length;
    for (let p = 0; p < 15; p++) {
        if (items.value[count + p] === undefined) {
            break;
        }
        mCorrectivo.value.push(items.value[count + p])
    }
}

const ionInfinite = async (ev: InfiniteScrollCustomEvent) => {
    generateMantenimientoPreventivo();
    await ev.target.complete();
};

const handleRefresh = async (event: CustomEvent) => {
    await synchronizeData();
    event.detail.complete();
}

const synchronizeData = async () => {
    try {
        await presentLoading('Sincronizando datos...');
        const apiData = await checkAuth();
        const dbData = await obtenerElemento('mCorrectivo', String(id.value));
        if(!apiData){
            const data = await obtenerElemento('mCorrectivo', String(id.value));
            items.value = data.sort((a: any, b: any) => a.idMantenimiento - b.idMantenimiento);
            generateMantenimientoPreventivo();
            return
        }

        // Actualizar datos que han cambiado
        if (JSON.stringify(apiData) !== JSON.stringify(dbData)) {
            await insertarDatos('mCorrectivo', String(id.value), apiData);
        }

        const data = await obtenerElemento('mCorrectivo', String(id.value));
        items.value = data.sort((a: any, b: any) => a.idMantenimiento - b.idMantenimiento);
        generateMantenimientoPreventivo();
        // await syncTask(data)
    } catch (error) {
        alert('Error al sincronizar:' + error);
    }finally{
        await dismissLoading();
    }
}

onMounted(async () => {
    await synchronizeData();
});

</script>

<template>
    <Header color="bluedark" titulo="Mantenimiento Correctivo" />
    <ion-content :fullscreen="true" color="bluedark">
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-card color="gray" v-for="mantenimiento in mCorrectivo" :key="mantenimiento.idMantenimiento">
            <ion-fab vertical="top" horizontal="end" @click="ActividadRealizado(mantenimiento.idMantenimiento)">
                <ion-fab-button size="small" translucent:true mode="ios">
                    <ion-icon src="/assets/icon/IconMantenimiento.svg"></ion-icon>
                </ion-fab-button>
            </ion-fab>

            <CardContent :mantenimiento="mantenimiento" @click="tareasCorrectivos(mantenimiento.idMantenimiento)"/>
            <ion-accordion-group>
                <ion-accordion>
                    <ion-item slot="header" class="ionItem" color="silver1">
                        <ion-label> Más Funciones</ion-label>
                    </ion-item>
                    <div slot="content">
                        <ion-segment>
                            <SegmentButton name="INFORME" @click="informeCorrectivo(mantenimiento.idMantenimiento)">
                            </SegmentButton>
                            <SegmentButton name="REG. CUMPLIMIENTO" @click="informeAnterior(mantenimiento.idMantenimiento, mantenimiento.serie)">
                            </SegmentButton>
                            <SegmentButton name="EN DESARROLLO" estado >
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
}

ion-fab-button {
    --background: #003249;
    --border-radius: 10px;
}
</style>