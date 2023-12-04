<template>
    <HeaderBack titulo="Historial de Actividades" color="bluedark" :id="0" />
    <ion-segment :value="selectedSegment" @ionChange="segmentChanged($event)" mode="md">
        <SegmentButton name="pendientes" value="pendientes" />
        <SegmentButton name="procesado" value="procesado" />
    </ion-segment>
    <ion-content v-if="selectedSegment === 'pendientes'">
        <Historial :history="pendientes" estado="Pendiente" :contador="synStore.pendientesPendientes"/>
    </ion-content>

    <ion-content v-if="selectedSegment === 'procesado'">
        <Historial :history="procesados" estado="Finalizados" :contador="synStore.pendientesProcesados"/>
    </ion-content>
</template>

<script setup lang="ts">
import { IonContent, IonSegment } from '@ionic/vue';
import HeaderBack from '@/common/HeaderBack.vue';
import { useSynchronize } from '@/stores/synchronize';
import { computed, ref } from 'vue';
import Historial from './Historial.vue';
import SegmentButton from '@/common/SegmentButton.vue';


const synStore = useSynchronize();
const selectedSegment = ref('pendientes');
const pendientes = computed(() => synStore.pendientes.filter((task) => task.status === 'pending'));
const procesados = computed(() => synStore.pendientes.filter((task) => task.status === 'processed'));
const segmentChanged = (event: any) => {
    selectedSegment.value = event.detail.value;
};
</script>