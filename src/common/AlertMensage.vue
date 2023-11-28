<template>
    <div class="container">
        <ion-text color="warning"><ion-icon :icon="warning" size="large"></ion-icon>
            <span class="mensage">{{ mensage }}</span>
        </ion-text>
    </div>
</template>

<script setup lang="ts">
import { IonIcon, IonText } from '@ionic/vue';
import { warning } from 'ionicons/icons';

defineProps<{
    mensage: string;
}>()



</script>

<style scoped>
.container {
    display: grid;
    place-items: center;
    height: 100vh;
    text-align: center;
    background-color: #FFFFFF;
}

.mensage {
    font-size: 1.5rem;
    font-weight: bold;
    color: #FA6A02;
    margin: 30px;
}</style>