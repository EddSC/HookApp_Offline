<script setup lang="ts">
import {
    IonAccordion,
    IonItem,
    IonLabel,
    IonAccordionGroup,
    IonIcon,
} from '@ionic/vue';
import { settingsSharp } from 'ionicons/icons';
import { App } from '@capacitor/app';
import { onMounted, ref } from 'vue';
import { Device } from '@capacitor/device';

type DeviceInfo = {
    model: string;
    operatingSystem: string;
    androidSDKVersion?: number;
    platform: string;
    manufacturer: string;
    name: string;
    webViewVersion: string;
};

const andoidVersion = ref('');
const deviceInfo = ref({} as any );

const obtenerVersion = async () => {
    try {
        const info = await App.getInfo();
        return info.version;
    } catch (error) {
        return 'No se pudo obtener la versión'
    }
};

const getDeviceInfo = async () => {
    try {
        const info = await Device.getInfo();
        return info;
    } catch (error) {
        return 'No se pudo obtener la información del dispositivo'
    }
};

onMounted(async () => {
    andoidVersion.value = await obtenerVersion();
    deviceInfo.value = await getDeviceInfo();
});
</script>

<template>
    <ion-accordion-group expand="inset" :value="['first', 'third']">
        <ion-accordion value="first">
            <ion-item class="Header_Item" slot="header">
                <ion-icon :icon="settingsSharp" slot="start"></ion-icon>
                <div>
                    <ion-label class="cuenta_header"> Ajustes </ion-label>
                    <ion-label class="id_header"> Versión: {{ andoidVersion }} </ion-label>
                </div>
            </ion-item>
            <div class="ion-padding" slot="content">
                <p>Modelo: {{ deviceInfo.model }}</p>
                <p>Sistema Operativo: {{ deviceInfo.operatingSystem }}</p>
                <p>SDK Android: {{ deviceInfo.androidSDKVersion }}</p>
                <p>Plataforma: {{ deviceInfo.platform }}</p>
                <p>Fabricante: {{ deviceInfo.manufacturer }}</p>
                <p>Nombre: {{ deviceInfo.name }}</p>
                <p>WebView: {{ deviceInfo.webViewVersion }}</p>
            </div>
        </ion-accordion>
    </ion-accordion-group>
</template>


<style scoped>
ion-icon {
    font-size: 48px;
    color: #D4463C
}

.cuenta_header {
    font-size: 1.2rem;
    color: white;
}

.id_header {
    font-size: 1.2rem;
    color: #D4463C;
}

.id_item_header {
    --background: #22242800;
}

ion-accordion {
    background: #222428;
    color: #fff;
}

ion-item {
    --background: #222428;
    --color: #fff;
}
</style>