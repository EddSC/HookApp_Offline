<template>
    <ion-page>
        <Header titulo="Soluciones" color="bluedark" />
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from '@ionic/vue';
import  Header  from '@/common/Header.vue';
import { useAuthStore } from '@/stores/authStore';

// variables
const authStore = useAuthStore();

</script>