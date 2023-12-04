<template>
    <ion-label class="ion-padding ion-label">
        <h1><b>{{ titulo }}</b></h1>
    </ion-label>
</template>

<script setup lang="ts">
import {
    IonLabel,
} from '@ionic/vue';

defineProps<{
    titulo: string;
}>()

</script>

<style scoped>
.ion-label {
    color: black;
    text-align: center;
}
h1 {
    font-size: 1.5rem;
}
</style>