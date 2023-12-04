<template>
    <ion-accordion-group expand="inset" :value="['first', 'third']">
        <ion-accordion value="first" >
            <ion-item class="header-according" slot="header">
                <ion-icon color="primary" slot="start" :icon="folder"></ion-icon>
                <ion-label>Lista Personal</ion-label>
            </ion-item>
            <ion-item slot="content" :detail="true" :button="true" @click="historialActividades">
                <ion-label>Historial - Actividades</ion-label>
            </ion-item>
            <ion-item slot="content" :button="true" :detail="true" disabled>
                <ion-label>En desarrollo</ion-label>
            </ion-item>
        </ion-accordion>
    </ion-accordion-group>
</template>

<script setup lang="ts">
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonIcon, useIonRouter } from '@ionic/vue';
import { folder } from 'ionicons/icons';

const router = useIonRouter();

const historialActividades = () => {
    router.push('tab4/historial');
}

</script>

<style scoped>
ion-icon {
    font-size: 48px;
    color: #D4463C
}
ion-accordion {
    background: #222428;
    color: #fff;
}
ion-item {
    --background: #222428;
    --color: #fff;
}
</style>