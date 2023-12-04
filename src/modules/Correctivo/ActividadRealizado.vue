<script setup lang="ts">
import HeaderBack from '@/common/HeaderBack.vue';
import SegmentButton from '@/common/SegmentButton.vue';
import {
    IonIcon,
    IonContent,
    IonSegment,
} from '@ionic/vue';
import { camera, gitNetwork, server } from 'ionicons/icons';
import Photos from '@/modules/Preventivo/photoDatosGrua/Photos.vue';
import { ref } from 'vue';
import TrabajoRealizado from '@/modules/Preventivo/photoDatosGrua/TrabajoRealizado.vue';
import { useRoute } from 'vue-router';
import Recomendaciones from './Recomendaciones.vue';

const route = useRoute();
const id = Number(route.params.id);
const selectedSegment = ref('5');

const segmentChanged = (ev: CustomEvent) => {
    selectedSegment.value = ev.detail.value;
}


</script>

<template>
    <HeaderBack titulo="Fotos - Datos de Grua" color="orange" :id="id">
        <ion-segment mode="md" :value="selectedSegment" @ionChange="segmentChanged($event)" select-on-focus scrollable>
            <SegmentButton class="SegmentButton" name="Portada" value="5">
                <ion-icon :icon="camera"></ion-icon>
            </SegmentButton>
            <SegmentButton class="SegmentButton" name="T. Realizados" value="9">
                <ion-icon :icon="gitNetwork"></ion-icon>
            </SegmentButton>
            <SegmentButton class="SegmentButton" name="Recomendaciones" value="4">
                <ion-icon :icon="server"></ion-icon>
            </SegmentButton>
        </ion-segment>
    </HeaderBack>
    <ion-content>
        <Photos titulo="Foto de Portada" sgmt="5" v-if="selectedSegment === '5'" />
        <TrabajoRealizado titulo="Actividades Realizados" sgmt="9" v-if="selectedSegment === '9'" />
        <Recomendaciones v-if="selectedSegment === '4'"/>
    </ion-content>   
</template>

<style scoped>
.SegmentButton {
    font-size: 0.7rem;
    text-transform: capitalize;
}

ion-content {
    --background: #f4f5f8;
}

ion-segment {
    --background: #013F5C;
    color: white;
}

h1 {
    font-size: 1.5rem;
    text-align: center;
    font-weight: bold;
    margin: 30px;
    color: #000000;
}
</style>