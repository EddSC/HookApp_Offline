<script setup lang="ts">
import HeaderBack from '@/common/HeaderBack.vue';
import SegmentButton from '@/common/SegmentButton.vue';
import {
    IonIcon,
    IonContent,
    IonSegment,
} from '@ionic/vue';
import { camera, clipboard, create, gitNetwork, server } from 'ionicons/icons';
import { useRoute } from 'vue-router';
import Photos from '@/modules/Preventivo/photoDatosGrua/Photos.vue';
import { ref } from 'vue';

const route = useRoute();
const id = Number(route.params.id);
const selectedSegment = ref('5');

const segmentChanged = (ev: CustomEvent) => {
    selectedSegment.value = ev.detail.value;
}


</script>

<template>
    <HeaderBack titulo="Fotos - Datos de Grua" color="orange" :id="id">
        <ion-segment 
            mode="md"
            :value="selectedSegment" 
            @ionChange="segmentChanged($event)" 
            select-on-focus
            scrollable
        >
            <SegmentButton class="SegmentButton" name="Portada" value="5">
                <ion-icon :icon="camera"></ion-icon>
            </SegmentButton>
            <SegmentButton class="SegmentButton" name="T. Realizados" value="9">
                <ion-icon :icon="gitNetwork"></ion-icon>
            </SegmentButton>
            <SegmentButton class="SegmentButton" name="Anexos" value="6">
                <ion-icon :icon="clipboard"></ion-icon>
            </SegmentButton>
            <SegmentButton class="SegmentButton" name="P. Polipasto" value="15">
                <ion-icon :icon="camera"></ion-icon>
            </SegmentButton>
            <SegmentButton class="SegmentButton" name="Datos Grua" value="2">
                <ion-icon :icon="create"></ion-icon>
            </SegmentButton>
            <SegmentButton class="SegmentButton" name="Base de Datos" value="4">
                <ion-icon :icon="server"></ion-icon>
            </SegmentButton>
        </ion-segment>
    </HeaderBack>
    <ion-content>
        <Photos titulo="Foto de Portada" sgmt="5" v-if="selectedSegment === '5'"/>
        <Photos titulo="Foto de Anexos" sgmt="6" v-if="selectedSegment === '6'"/>
        <Photos titulo="Foto de Placa Polipasto" sgmt="15" v-if="selectedSegment === '15'"/>
        <Photos titulo="Foto de Base de Datos" sgmt="4" v-if="selectedSegment === '4'"/>
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
  }
</style>