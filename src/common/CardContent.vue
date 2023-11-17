<template>
        <ion-card-content>
            <span item-left> <b>N° Reporte: {{ mantenimiento.numreporte }}</b> <b class="colorNaranja"> | {{ mantenimiento.Nombres }}</b> </span>
            <ion-grid fixed>
                <ion-row>
                    <ion-col size="6">
                        <ion-label>
                            <h5> <b> Tipo: {{ mantenimiento.Tipo }} </b></h5>
                            <h5> <b> Tag Grua: {{ mantenimiento.TagGrua }} </b></h5>
                            <h5> <b> Capacidad: {{ mantenimiento.Capacidad }} </b></h5>
                            <h5> <b> Marca: {{ mantenimiento.Marcas }} </b></h5>
                        </ion-label>
                    </ion-col>
                    <ion-col size="6">
                        <ion-label>
                            <h5> <b> Área: {{ mantenimiento.Area }} </b></h5>
                            <h5> <b> Frecuencia: {{ mantenimiento.Frecuencia }} </b></h5>
                            <h5> <b> Fecha: {{ mantenimiento.Fecha }} </b></h5>
                            <h5 class="colorNaranja"> <b>Numero: {{ mantenimiento.idMantenimiento }} </b></h5>
                        </ion-label>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
</template>

<script setup lang="ts">
import {
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel
} from '@ionic/vue';

import { MantenimientoTypes } from '../types/MantenimientoTypes';

// props
defineProps({
    mantenimiento: {
        type: Object as () => MantenimientoTypes,
        required: true
    }
});

</script>

<style scoped>
a {
    text-decoration: none;
    color: black;
}

.colorNaranja {
    color: #FB6B02;
}
</style>../types/MantenimientoTypes