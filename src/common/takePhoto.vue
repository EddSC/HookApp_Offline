<script setup lang="ts">
import {
    IonFab,
    IonFabButton,
    IonIcon,
} from '@ionic/vue';
import { images } from 'ionicons/icons';

</script>

<template>
    <ion-fab vertical="bottom" horizontal="end" slot="fixed" class="image-upload">
        <ion-fab-button size="small">
            <ion-icon :icon="images"></ion-icon>
        </ion-fab-button>
    </ion-fab>
</template>

<style scoped>
ion-fab-button {
    --background: #AC44CF;
    --background-activated: #00000056;
    --border-color: white;
}
ion-fab {
    margin-bottom: 4rem;
}
</style>