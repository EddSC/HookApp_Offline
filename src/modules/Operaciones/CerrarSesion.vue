<script setup lang="ts">
import {
    IonItem,
    IonLabel,
    IonIcon,
    alertController,
} from '@ionic/vue';
import { logOut } from 'ionicons/icons';
import { showToast } from '@/helpers/showToast';
import { Preferences } from '@capacitor/preferences';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { presentLoading, dismissLoading } from '@/helpers/loading';

const { deleteDB } = useStorage();

const cerrarSession = async () => {
    const alert = await alertController.create({
        header: 'Alerta! Se eliminará toda información almacenada en la Tablet. ¿Deseas continuar?',
        buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    // Nothing to do, action sheet is automatically closed
                }
            },
            {
                text: 'OK',
                role: 'confirm',
                handler: async () => {
                    await cerrarSesion();
                }
            }
        ],
        mode: 'ios',
        cssClass: 'my-custom-class',
        translucent: true,
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
}

const cerrarSesion = async () => {
    try {
        await presentLoading('Cerrando sesión...');
        await deleteDB();
        await Preferences.remove({ key: 'auth' });
        window.location.reload();
    } catch (error) {
        await showToast('Error al cerrar sesión', 'danger');
    }finally{
        await dismissLoading();
    }
};

</script>

<template>
    <div class="ion-padding">
        <ion-item expand="inset" button slot="header" @click="cerrarSession">
            <ion-icon :icon="logOut" slot="start"></ion-icon>
            <ion-label>Cerrar Sesión</ion-label>
        </ion-item>
    </div>
</template>


<style scoped>
ion-icon {
    font-size: 32px;
    color: #D4463C
}

ion-item {
    --background: #222428;
    --color: #D4463C;
    border-radius: 8px;
    font-size: large;
}
</style>