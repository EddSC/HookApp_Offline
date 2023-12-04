<script setup lang="ts">
import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonItem,
    IonButton,
    IonIcon,
    IonGrid,
    IonInput,
    IonCol,
    useIonRouter,
} from '@ionic/vue';
import {
    mailOutline,
    lockClosedOutline,
    logInOutline,
    eyeOutline,
    eyeOffOutline,
} from 'ionicons/icons';
import { ref } from 'vue';
import { LoginInterface } from '@/interfaces/loginInterface';
import { useAuthStore } from '@/stores/authStore';
import { presentLoading, dismissLoading } from '@/helpers/loading';

// Variables
const eyePassword = ref(false)
const dataLogin = ref({} as LoginInterface)
const authStore = useAuthStore()
const ionRouter = useIonRouter();

// Funciones
const eyebtn = () => {
    eyePassword.value = !eyePassword.value;
}
const signIn = async () => {
    try {
        await presentLoading('Iniciando sesión...');
    const res = await authStore.signIn(dataLogin.value)
    if (res) {
        ionRouter.navigate('/', 'forward', 'replace');
    }
    } catch (error) {
        alert(error);
    }finally{
        await dismissLoading();
    }
}


</script>

<template>
    <ion-card>
        <ion-img src="/assets/images/Konecranes.png"></ion-img>
        <ion-card-header>
            <ion-card-title>Iniciar Sesión</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <form @submit.prevent="signIn()">
                <ion-grid fixed>
                    <ion-col size="6">
                        <ion-item>
                            <ion-icon :icon="mailOutline" slot="start"></ion-icon>
                            <ion-input type="email" label="" placeholder="Email" v-model.trim="dataLogin.correo">
                            </ion-input>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item v-if="!eyePassword">
                            <ion-icon :icon="lockClosedOutline" slot="start"></ion-icon>
                            <ion-input type="password" label="" placeholder="Password" v-model.trim="dataLogin.password">
                            </ion-input>
                            <ion-icon @click="eyebtn" :icon="eyeOutline" slot="end" mode="ios"></ion-icon>
                        </ion-item>
                        <ion-item v-if="eyePassword">
                            <ion-icon :icon="lockClosedOutline" slot="start"></ion-icon>
                            <ion-input type="text" label="" placeholder="Password" v-model.trim="dataLogin.password">
                            </ion-input>
                            <ion-icon @click="eyebtn" :icon="eyeOffOutline" slot="end" mode="ios"></ion-icon>
                        </ion-item>
                    </ion-col>
                </ion-grid>
                <ion-button fill="solid" type="submit" expand="block" mode="ios">
                    <ion-icon :icon="logInOutline"></ion-icon>
                    Login
                </ion-button>
            </form>
        </ion-card-content>
    </ion-card>
</template>

<style scoped>
ion-img {
    height: 80px;
    margin: 1.2rem auto;
}
ion-card {
    background: #222428;
    color: #fff;
    width: 95%;
}

ion-card-title {
    color: #fff;
}

ion-icon {
    color: white;
}

ion-input {
    color: white;
    background: #1E1E1E;
}

ion-item {
    --background: #1E1E1E;
}
</style>