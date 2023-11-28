<script setup lang="ts">
import {
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
    IonInfiniteScrollContent,
    modalController,
    IonSegment,
} from '@ionic/vue';
import { caretForwardOutline } from 'ionicons/icons';
import HeaderBack from '@/common/HeaderBack.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { TaskDetail, PrioridadCondicion, TaskDetails, NoAplica } from '@/interfaces/mantenimientoInterface';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { showToast } from '@/helpers/showToast';
import { usePreventivoStore } from '@/stores/mPreventivoStore';
import FormularioNormal from '@/modules/Preventivo/FormularioNormal.vue';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { useAuthStore } from '@/stores/authStore';
import SegmentButton from '@/common/SegmentButton.vue';
import AlertMensage from '@/common/AlertMensage.vue';
import { genUniqueId } from '@/helpers/uniqueId';


const { obtenerElemento, insertarElemento } = useStorage();
const route = useRoute();
const preventivoStore = usePreventivoStore();

const id = Number(route.params.id);
const orden = Number(route.params.idOden);
const authStore = useAuthStore();
const prioridadCondicion = ref({} as PrioridadCondicion);
const setPrioridadCondicion = ref({} as TaskDetails);
const noAplica = ref({} as NoAplica);
const selectedSegment = ref('PENDIENTE');

const segmentChanged = (ev: CustomEvent) => {
    selectedSegment.value = ev.detail.value;
}

const getItems = async () => {
    try {
        await presentLoading('Cargando...');
        preventivoStore.resetItems();
        const res:TaskDetail[] = await obtenerElemento('pItem', `${String(id)}${String(orden)}${String(authStore.authId)}`);
        if (res) {
            console.log(res);
            preventivoStore.setItems(res);
            preventivoStore.generateItems()
            return
        } else {
            await showToast('No se encontraron datos', 'danger');
        }
    } catch (error) {
        await showToast('Ocurrió un error al obtener el Items', 'danger');
    } finally {
        await dismissLoading();
    }
}


const ionInfinite = async (ev: InfiniteScrollCustomEvent) => {
    preventivoStore.generateItems();
    await ev.target.complete();
}

const handleRefresh = async (event: CustomEvent) => {
    await getItems();
    event.detail.complete();
}

const openModalForm = async (taskDetail: TaskDetail) => {
    const modal = await modalController.create({
        component: FormularioNormal,
        componentProps: {
            taskDetail: taskDetail,
            id: id,
            titulo: preventivoStore.preventivoTitulo
        }
    });
    //traes datos del modal
    modal.onDidDismiss().then((data) => {
        if (data.data === 'ok') {
            getItems();
        }
    });

    return modal.present();
}


// registro de prioridad y condicion en storage
const regPrioridadCondicion = (IdTitulo: number, id_item: number, num_ord: number) => {
    prioridadCondicion.value.VarItem = id_item;
    prioridadCondicion.value.VarPrio = 0;
    prioridadCondicion.value.VarStatus = 3;
    prioridadCondicion.value.Tecnico = Number(authStore.authId);
    prioridadCondicion.value.VarMant = Number(route.params.id);
    prioridadCondicion.value.VarTitulo = IdTitulo;

    const id = genUniqueId();
    setPrioridadCondicion.value.id = id;
    setPrioridadCondicion.value.idTaskDetail = id;
    setPrioridadCondicion.value.idMantenimiento = Number(route.params.id);
    setPrioridadCondicion.value.idTitulo = IdTitulo;
    setPrioridadCondicion.value.idOrden = num_ord;
    setPrioridadCondicion.value.idItem = id_item;
    setPrioridadCondicion.value.fechaHora = new Date().toLocaleString();
    setPrioridadCondicion.value.prioridadCondicion = prioridadCondicion.value;
}

const cambiarPrioridadCondicion = async (id_item: number) => {
    const res = preventivoStore.procesarEstadoItem(id_item);
    await insertarElemento('pItem', `${String(id)}${String(orden)}${String(authStore.authId)}`, res);
}


// registro de no aplica en storage
const regNoAplica = (IdTitulo: number, id_item: number, num_ord: number) => {
    noAplica.value.VarItem = id_item;
    noAplica.value.VarTitulo = IdTitulo;
    noAplica.value.VarMant = Number(route.params.id);

    const id = genUniqueId();
    setPrioridadCondicion.value.id = id;
    setPrioridadCondicion.value.idTaskDetail = id;
    setPrioridadCondicion.value.idMantenimiento = Number(route.params.id);
    setPrioridadCondicion.value.idTitulo = IdTitulo;
    setPrioridadCondicion.value.idOrden = num_ord;
    setPrioridadCondicion.value.idItem = id_item;
    setPrioridadCondicion.value.fechaHora = new Date().toLocaleString();
    setPrioridadCondicion.value.noAplica = noAplica.value;
}


const submitAccion = async (
    IdTitulo: number,
    id_item: number,
    num_ord: number,
    accion: 'prioridadCondicion' | 'noAplica'
) => {
    try {
        await presentLoading('Registrando...');
        const verificar = preventivoStore.preventivoItems.find(item => item.id_item === id_item);
        if (verificar?.estado === 'processed') {
            return showToast('Este item ya fue procesado', 'danger');
        }

        if (accion === 'prioridadCondicion') {
            regPrioridadCondicion(IdTitulo, id_item, num_ord);
        } else if (accion === 'noAplica') {
            regNoAplica(IdTitulo, id_item, num_ord);
        }

        await insertarElemento(preventivoStore.nameStorage, setPrioridadCondicion.value.id, setPrioridadCondicion.value);
        await cambiarPrioridadCondicion(id_item);
        await showToast('Prioridad y condición registrada correctamente', 'success');
        console.log(setPrioridadCondicion.value);
    } catch (error) {
        const errorMessage = accion === 'prioridadCondicion' ?
            'Ocurrió un error al registrar la prioridad y condición' :
            'Ocurrió un error al registrar no Aplica';
        await showToast(errorMessage, 'danger');
    } finally {
        prioridadCondicion.value = {} as PrioridadCondicion;
        setPrioridadCondicion.value = {} as TaskDetails;
        noAplica.value = {} as NoAplica;
        await dismissLoading();
    }
}


onMounted(() => {
    getItems()
});

</script>

<template>
    <HeaderBack :titulo="preventivoStore.preventivoTitulo" color="orange" :id="id">
        <ion-segment mode="md" :value="selectedSegment" @ionChange="segmentChanged($event)" select-on-focus scrollable>
            <SegmentButton name="PENDIENTE" value="PENDIENTE" />
            <SegmentButton name="COMPLETADO" value="COMPLETADO" />
        </ion-segment>
    </HeaderBack>
    <ion-content :fullscreen="true" color="white">
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-list v-if="selectedSegment === 'PENDIENTE'">
            <ion-item-sliding v-for="item in preventivoStore.itemPendiente" :key="item.id_item">

                <ion-item @click="openModalForm(item)" :class="[item.estado === 'processed' ? 'param_si' : 'param_no']"
                    button :detail="true" :detailIcon="caretForwardOutline">
                    <ion-note slot="start"><b>{{ item.num_ord }} |</b></ion-note>
                    <ion-label class="ion-text-wrap custom-label">{{ item.Item }}</ion-label>
                </ion-item>

                <ion-item-options side="end" class="custom-item-options">
                    <ion-item-option color="danger" class="custom-item-option"
                        @click="submitAccion(item.IdTitulo, item.id_item, item.num_ord, 'noAplica')">
                        NO APLICA
                    </ion-item-option>
                    <ion-item-option class="custom-item-option"
                        @click="submitAccion(item.IdTitulo, item.id_item, item.num_ord, 'prioridadCondicion')">
                        P=0 C=0
                    </ion-item-option>
                </ion-item-options>
            </ion-item-sliding>
            <AlertMensage mensage="No tienes Items pendientes" v-if="preventivoStore.itemPendiente.length === 0" />
        </ion-list>

        <ion-list v-if="selectedSegment === 'COMPLETADO'">
            <ion-item-sliding v-for="item in preventivoStore.itemCompletado" :key="item.id_item">

                <ion-item @click="openModalForm(item)" :class="[item.Condicion === 'nocolor' ? 'param_no' : 'param_si']"
                    button :detail="true" :detailIcon="caretForwardOutline">
                    <ion-note slot="start"><b>{{ item.num_ord }} |</b></ion-note>
                    <ion-label class="ion-text-wrap custom-label">{{ item.Item }}</ion-label>
                </ion-item>

                <ion-item-options side="end" class="custom-item-options">
                    <ion-item-option color="danger" class="custom-item-option" disabled>
                        NO APLICA
                    </ion-item-option>
                    <ion-item-option class="custom-item-option" disabled>
                        P=0 C=0
                    </ion-item-option>
                </ion-item-options>
            </ion-item-sliding>
            <AlertMensage mensage="No has completado ningún ítem todavía." v-if="preventivoStore.itemCompletado.length === 0" />
        </ion-list>
        <ion-infinite-scroll @ionInfinite="ionInfinite">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
    </ion-content>
</template>


<style scoped>
ion-segment {
    --background: #013F5C;
}

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
    --background: #8a8a8a;
    --color: black;
}
</style>