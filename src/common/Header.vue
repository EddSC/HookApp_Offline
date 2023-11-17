<template>
    <ion-header>
        <ion-toolbar :color="color">
            <ion-title>{{ titulo }}</ion-title>
        </ion-toolbar>
    </ion-header>
</template>

<script setup lang="ts">
import { IonToolbar, IonTitle, IonHeader } from '@ionic/vue';

defineProps({
    titulo: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: false,
        default: 'primary'
    }
});

</script>