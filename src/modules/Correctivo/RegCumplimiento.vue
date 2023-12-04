<script setup lang="ts">
import {
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonRow,
    IonCol,
    IonImg,
    IonButton,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/vue';
import { useRoute } from 'vue-router';
import { PrioridadCondicion, TaskDetails } from '@/interfaces/mantenimientoInterface';
import { onMounted, ref } from 'vue';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { genUniqueId } from '@/helpers/uniqueId';
import { showToast } from '@/helpers/showToast';
import { getInformePendiente, getInformePendienteV2 } from '@/services/__mocks__/preventivo/informe';
import { useAuthStore } from '@/stores/authStore';
import { usePreventivoStore } from '@/stores/mPreventivoStore';
import HeaderBack from '@/common/HeaderBack.vue';

const route = useRoute()
const images = import.meta.env.VITE_BASE_IMAGE as string;

const { insertarElemento, obtenerElemento } = useStorage();
const authStore = useAuthStore();
const preventivoStore = usePreventivoStore();
const Inicial = ref([] as any);
const actualizaciones = ref([] as any);
const resultadoFinal = ref([] as any);
const id = Number(route.params.id);
const serie = String(route.params.serie);

const prioridadCondicion = ref({
    VarItem: 0,
    VarPrio: 0,
    VarStatus: 3,
    Tecnico: 0,
    VarMant: 0,
    VarTitulo: 0,
} as PrioridadCondicion);
let setPrioridadCondicion: TaskDetails = {
    id: '',
    idTaskDetail: '',
    idMantenimiento: 0,
    idTitulo: 0,
    idOrden: 0,
    idItem: 0,
    tipo: 'Correctivo - Cumplimiento (PC)',
    fechaHora: '',
    status: 'pending',
    prioridadCondicion: prioridadCondicion.value,
}

const limpiarForm = () => {
    prioridadCondicion.value = {
        VarItem: 0,
        VarPrio: 0,
        VarStatus: 3,
        Tecnico: 0,
        VarMant: 0,
        VarTitulo: 0,
    };

    setPrioridadCondicion = {
        id: '',
        idTaskDetail: '',
        idMantenimiento: 0,
        idTitulo: 0,
        idOrden: 0,
        idItem: 0,
        tipo: 'Correctivo - Cumplimiento (PC)',
        fechaHora: '',
        status: 'pending',
        prioridadCondicion: prioridadCondicion.value,
    }
}


const actualizarDatos = async () => {
    try {
        await presentLoading('Cargando...');
        const data = await getInformePendiente(serie);
        const dataV2 = await getInformePendienteV2(serie);

        if (data === null) return showToast('No se pudo conectar con el servidor', 'danger');
        if (dataV2 === null) return showToast('No se pudo conectar con el servidor', 'danger');

        Inicial.value = data;
        actualizaciones.value = dataV2;
        console.log(actualizaciones.value);

        resultadoFinal.value = [...Inicial.value];

        actualizaciones.value.forEach((objActualizacion: any) => {
            const titulosActualizados = objActualizacion.titulos;
            // Si titulosActualizados es undefined, haz algo apropiado, por ejemplo, continua con el siguiente objeto actualización o muestra un mensaje de error.
            titulosActualizados.forEach((tituloActualizado: any) => {
                const tituloInicial = resultadoFinal.value[0].titulos.find(
                    (titulo: any) => titulo.idTitulo === tituloActualizado.idTitulo
                );

                if (tituloInicial) {
                    const itemsActualizados = tituloActualizado.items;

                    itemsActualizados.forEach((itemActualizado: any) => {
                        const itemInicial = tituloInicial.items.find(
                            (item: any) => item.id === itemActualizado.id
                        );

                        if (itemInicial) {
                            itemInicial.prioridad = itemActualizado.prioridad;
                            itemInicial.condicion = itemActualizado.condicion;
                            itemInicial.nota = itemActualizado.nota;
                            itemInicial.fotos = itemActualizado.fotos;
                        }
                    });
                }
            });

        });
    } catch (error) {
        await showToast('No se pudo conectar con el servidor', 'danger');
    } finally {
        console.log('Actualizado', resultadoFinal.value);
        await dismissLoading();
    }
}
const submitStore = async (dato: TaskDetails, id_item: number) => {
    await insertarElemento(preventivoStore.nameStorage, dato.id, dato)
    console.log('Registro exitoso', setPrioridadCondicion);
    // hookApp.processTaskDetails(id_item)
    limpiarForm();
    await showToast('Registro exitoso', 'success');
    await dismissLoading()
}

const regPrioridadCondicion = (IdTitulo: number, id_item: number, num_ord: number) => {
    prioridadCondicion.value.VarItem = id_item;
    prioridadCondicion.value.Tecnico = Number(authStore.authId);
    prioridadCondicion.value.VarTitulo = IdTitulo;
    prioridadCondicion.value.VarMant = id;

    const uniqueId = genUniqueId();
    setPrioridadCondicion.id = uniqueId;
    setPrioridadCondicion.idTaskDetail = uniqueId;
    setPrioridadCondicion.idMantenimiento = id;
    setPrioridadCondicion.idTitulo = IdTitulo;
    setPrioridadCondicion.idOrden = num_ord;
    setPrioridadCondicion.idItem = id_item;
    setPrioridadCondicion.fechaHora = new Date().toLocaleString();
}

const submitPrioridadCondicion = async (IdTitulo: number, id_item: number) => {
    try {
        await presentLoading('Registrando...');
        regPrioridadCondicion(IdTitulo, id_item, IdTitulo);
        await insertarElemento(preventivoStore.nameStorage, setPrioridadCondicion.id, setPrioridadCondicion)
        limpiarForm();
        await showToast('Registro exitoso', 'success');
    } catch (error) {
        await showToast('No se pudo conectar con el servidor', 'danger');
    } finally {
        await dismissLoading();
    }
}

const doRefresh = async (event: any) => {
    await actualizarDatos()
    await event.target.complete();
}

onMounted(() => {
    actualizarDatos()
})

</script>

<template>
    <HeaderBack titulo="Registro de Cumplimiento" color="orange" :id="id" />
    <ion-content :fullscreen="true" color="white">
        <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
            <ion-refresher-content refreshing-spinner="circles">
            </ion-refresher-content>
        </ion-refresher>
        <div v-for="cp in resultadoFinal">
            <div v-for="title in cp.titulos">
                <div v-for="item in title.items">
                    <div v-if="item.prioridad !== '' && item.condicion !== ''">
                        <ion-card color="black" v-if="item.prioridad !== '0' && item.condicion !== '3'">
                            <ion-card-header color="black">
                                <ion-card-title>{{ title.titulo }}</ion-card-title>
                                <ion-card-subtitle>{{ item.item }}</ion-card-subtitle>
                            </ion-card-header>
                            <ion-card-content>
                                <p><b>Obervaciones:</b> {{ item.nota.observaciones }}</p>
                                <p><b>Recomendaciones:</b> {{ item.nota.recomendaciones }}</p>
                            </ion-card-content>
                            <ion-card-header>
                                <ion-row>
                                    <ion-col size-md="6" size-sm="6" size-xs="12" v-for="image in item.fotos">
                                        <div class="image-anexo">
                                            <ion-img :src="images + image.img" alt=""></ion-img>
                                        </div>
                                    </ion-col>
                                </ion-row>
                                <ion-button @click="submitPrioridadCondicion(title.id, item.id)" color="primary">
                                    Registrar Cumplimiento
                                </ion-button>
                            </ion-card-header>
                        </ion-card>
                    </div>
                </div>
            </div>
        </div>
    </ion-content>
</template>


<style scoped>
.image-container {
    width: 100%;
    /* Opcional: Ajusta el ancho del contenedor según tus necesidades */
    height: 0;
    /* Inicialmente establecemos la altura en 0 */
    padding-bottom: 50%;
    /* Ajusta el valor para obtener la forma deseada (ejemplo: 140%) */
    position: relative;
    /* Necesario para posicionar la imagen de forma correcta */
}

.image-container ion-img {
    position: absolute;
    /* Posicionamos la imagen de forma absoluta dentro del contenedor */
    width: 100%;
    /* La imagen ocupará el 100% del ancho del contenedor */
    height: 100%;
    /* La imagen ocupará el 100% de la altura del contenedor */
    object-fit: fill;
    /* Ajusta la imagen para cubrir completamente el contenedor */
}

.image-anexo {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    position: relative;
}

.image-anexo ion-img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: fill;
}

p {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    text-align: justify;
}

ion-item {
    --background: #FFFFFF;
}

/* ion-button{
    --background: #00334A;
    --color: #FFFFFF;
    --border-color: #000000;
} */
</style>