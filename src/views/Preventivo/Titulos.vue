<template>
    <ion-page>
        <Titulo/>
    </ion-page>
</template>

<script setup lang="ts">
import Titulo from '@/modules/Preventivo/Titulo.vue';
import { IonPage, onIonViewDidEnter, onIonViewDidLeave } from '@ionic/vue';
import { initializeDatabase, closeSQLiteConnection } from '@/services/__mocks__/sqlite/database'
onIonViewDidEnter(async () => {
    await initializeDatabase();
});
onIonViewDidLeave(async () => {
    await closeSQLiteConnection();
});
</script>