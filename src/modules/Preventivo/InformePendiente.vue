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
    IonRefresher,
    IonRefresherContent,
} from '@ionic/vue';
import { useRoute } from 'vue-router';
import { getInformePendiente, getInformePendienteV2 } from '@/services/__mocks__/preventivo/informe';
import { showToast } from '@/helpers/showToast';
import { onMounted, ref } from 'vue';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import HeaderBack from '@/common/HeaderBack.vue';

const route = useRoute()
const serie = String(route.params.serie)
const id = Number(route.params.id)
const images = import.meta.env.VITE_BASE_IMAGE as string;

const Inicial = ref([] as any);
const actualizaciones = ref([] as any);
const resultadoFinal = ref([] as any);


const actualizarDatos = async () => {
    try {
        await presentLoading('Cargando datos...');
        const data = await getInformePendiente(serie);
        const dataV2 = await getInformePendienteV2(serie);

        if (data === null) {
            return showToast('No se pudo conectar con el servidor', 'danger');
        }

        if (dataV2 === null) {
            return showToast('No se pudo conectar con el servidor', 'danger');
        }

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
    <HeaderBack titulo="Tareas" color="orange" :id="id" />
    <ion-content :fullscreen="true" color="white">
        <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
            <ion-refresher-content refreshing-spinner="circles">
            </ion-refresher-content>
        </ion-refresher>
        <div v-for="cp in resultadoFinal">
            <div v-for="title in cp.titulos">
                <div v-for="item in title.items">
                    <div v-if="item.prioridad !== '' && item.condicion !== ''">
                        <ion-card color="black" class="color" v-if="item.prioridad !== '0' && item.condicion !== '3'">
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

.color {
    color: #000000;
}
</style>