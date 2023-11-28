<script setup lang="ts">
import {
    IonFab,
    IonFabButton,
    IonIcon,
} from '@ionic/vue';
import { camera } from 'ionicons/icons';

</script>

<template>
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
            <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
    </ion-fab>
</template>

<style scoped>
ion-fab-button {
    --background: #f61c1b;
    --background-activated: #00000056;
    --border-color: white;
}
</style>
