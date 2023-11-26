<script setup lang="ts">
import {
    IonContent,
    IonPage,
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
import { getData, insertData, deleteData, updateData } from '@/services/__mocks__/sqlite/database'


const mPreventivos = ref([] as Upkeep[]);
const items = ref<any>();
const id = ref(0);

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
        id.value = Number(authData.idtuser)
        const res = await preventivoStore.getPreventivo(Number(authData.idtuser));
        return res;
        // generateMantenimientoPreventivo()
    }
}

const generateMantenimientoPreventivo = () => {
    const count = mPreventivos.value.length;
    for (let p = 0; p < 6; p++) {
        if (items.value[count + p] === undefined) {
            break;
        }
        mPreventivos.value.push(items.value[count + p])
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

const synchronizeData = async () => {
    try {
        const apiData  = await checkAuth();
        const dbData  = await getData('mantenimiento');

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
        
        const data = await getData('mantenimiento');
        items.value = data.sort((a:any, b:any) => a.idMantenimiento - b.idMantenimiento);
        generateMantenimientoPreventivo();
        // await syncTask(data)
    } catch (error) {
        console.error('Error al sincronizar:', error);
    } finally {
        console.log('Sincronización exitosa');
    }
}

onMounted( async() => {
    await synchronizeData();
});

</script>

<template>
<ion-page>
    <Header color="orange" titulo="Mantenimiento Preventivo" />
    <ion-content :fullscreen="true" color="white">
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-card color="gray" v-for="mantenimiento in mPreventivos" :key="mantenimiento.idMantenimiento">
            <ion-fab vertical="top" horizontal="end">
                <ion-fab-button size="small" translucent:true mode="ios">
                    <ion-icon src="/assets/icon/IconMantenimiento.svg"></ion-icon>
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
</ion-page>
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