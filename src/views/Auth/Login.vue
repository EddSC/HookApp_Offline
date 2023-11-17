<script setup lang="ts">
import { IonPage } from '@ionic/vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import Login from '@/modules/Auth/Login.vue';

</script>

<template>
    <ion-page>
        <AuthLayout>
            <Login />
        </AuthLayout>
    </ion-page>
</template>

<style scoped>

</style>