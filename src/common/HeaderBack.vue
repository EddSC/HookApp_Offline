<template>
    <ion-header>
        <ion-toolbar :color="color">
            <ion-button fill="clear" @click="$router.back()" aria-label="back" slot="start">
                <ion-icon aria-hidden="true" :icon="arrowBack" size="large" color="white" />
            </ion-button>
            <ion-title>{{ titulo }}</ion-title>
            <ion-label slot="end"> Mant. {{ id }}</ion-label>
        </ion-toolbar>
    </ion-header>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonLabel } from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';

defineProps({
    titulo: {
        type: String,
        required: true,
        default: 'Items',
    },
    color: {
        type: String,
        required: false,
        default: 'primary',
    },
    id: {
        type: Number,
        required: true,
        default: '0',
    },
});



</script>

<style scoped>
ion-label {
    font-size: 1.2rem;
    font-weight: bold;
    margin-right: 0.6rem;
}
</style>