<template>
    <ion-page>
        <Preventivo />
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, onIonViewDidEnter, onIonViewDidLeave } from '@ionic/vue';
import Preventivo from '@/modules/Preventivo/Preventivo.vue';
import { initializeDatabase, closeSQLiteConnection } from '@/services/__mocks__/sqlite/database'
onIonViewDidEnter(async () => {
    await initializeDatabase();
});
onIonViewDidLeave(async () => {
    await closeSQLiteConnection();
});
</script>