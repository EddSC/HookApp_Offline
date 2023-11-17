<template>
    <!-- <ion-card color="gray"> -->
        <!-- <ion-fab vertical="top" horizontal="end" @click="operaciones(idMantenimiento)">
            <ion-fab-button size="small" translucent:true mode="ios">
                <ion-icon src="src/assets/icon/IconMantenimiento.svg"></ion-icon>
            </ion-fab-button>
        </ion-fab> -->
        <ion-card-content @click="navigatePreventivo(idMantenimiento)">
            <span item-left> <b>N° Reporte: {{ numreporte }}</b> <b class="colorNaranja"> | {{ Nombres }}</b> </span>
            <ion-grid fixed>
                <ion-row>
                    <ion-col size="6">
                        <ion-label>
                            <h5> <b> Tipo: {{ Tipo }} </b></h5>
                            <h5> <b> Tag Grua: {{ TagGrua }} </b></h5>
                            <h5> <b> Capacidad: {{ Capacidad }} </b></h5>
                            <h5> <b> Marca: {{ Marcas }} </b></h5>
                        </ion-label>
                    </ion-col>
                    <ion-col size="6">
                        <ion-label>
                            <h5> <b> Área: {{ Area }} </b></h5>
                            <h5> <b> Frecuencia: {{ Frecuencia }} </b></h5>
                            <h5> <b> Fecha: {{ Fecha }} </b></h5>
                            <h5 class="colorNaranja"> <b>Numero: {{ idMantenimiento }} </b></h5>
                        </ion-label>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
        <!-- <ion-accordion-group>
            <ion-accordion>
                <ion-item slot="header" class="ionItem" color="silver1">
                    <ion-label> Más Funciones</ion-label>
                </ion-item>
                <div slot="content">
                    <ion-segment @ionChange="segmentChanged($event)">
                        <ion-segment-button button @click="informePreventivo(idMantenimiento)">
                            <ion-label> <b>INFORME</b> </ion-label>
                        </ion-segment-button>
                        <ion-segment-button button @click="informeAnterior(idMantenimiento)">
                            <ion-label> <b>INFORME ANTERIOR</b> </ion-label>
                        </ion-segment-button>
                        <ion-segment-button button disabled>
                            <ion-label> <b>EN PROGRESO</b> </ion-label>
                        </ion-segment-button>
                    </ion-segment>
                </div>
            </ion-accordion>
        </ion-accordion-group> -->
    <!-- </ion-card> -->
</template>

<script setup lang="ts">
import {
    IonCard,
    IonCardContent,
    useIonRouter,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
} from '@ionic/vue';

// props
defineProps({
    idMantenimiento: {
        type: String,
        required: false
    },
    numreporte: {
        type: String,
        required: false
    },
    Nombres: {
        type: String,
        required: false
    },
    Tipo: {
        type: String,
        required: false
    },
    TagGrua: {
        type: String,
        required: false
    },
    Capacidad: {
        type: String,
        required: false
    },
    Marcas: {
        type: String,
        required: false
    },
    Area: {
        type: String,
        required: false
    },
    Frecuencia: {
        type: String,
        required: false
    },
    Fecha: {
        type: String,
        required: false
    }
});

const operaciones = (idMantenimiento: string | undefined) => {
    console.log(idMantenimiento);
}

const navigatePreventivo = (idMantenimiento: string | undefined) => {
    console.log(idMantenimiento);
}

const segmentChanged = (ev: CustomEvent) => {
    console.log('Segment changed', ev.detail.value);
}

const informePreventivo = ( idMantenimiento: string | undefined) => {
    console.log('informePreventivo', idMantenimiento);
}

const informeAnterior = (idMantenimiento: string | undefined) => {
    console.log('informeAnterior', idMantenimiento);
}

</script>

<style scoped>
a {
    text-decoration: none;
    color: black;
}

.colorNaranja {
    color: #FB6B02;
}
</style>