<template>
    <Header color="bluedark" titulo="Mantenimiento Correctivo" />
    <ion-content :fullscreen="true" color="bluedark">
        <ion-card color="gray" v-for="mantenimiento in correctivoStore.correctivoData" :key="mantenimiento.idMantenimiento">
            <ion-fab vertical="top" horizontal="end">
                <ion-fab-button size="small" translucent:true mode="ios">
                    <ion-icon src="src/assets/icon/IconMantenimiento.svg"></ion-icon>
                </ion-fab-button>
            </ion-fab>

            <CardContent :mantenimiento="mantenimiento" />
            <ion-accordion-group>
                <ion-accordion>
                    <ion-item slot="header" class="ionItem" color="silver1">
                        <ion-label> Más Funciones</ion-label>
                    </ion-item>
                    <div slot="content">
                        <ion-segment>
                            <SegmentButton name="INFORME" @click="informePreventivo(mantenimiento.idMantenimiento)">
                            </SegmentButton>
                            <SegmentButton name="INFORME ANTERIOR" @click="informeAnterior(mantenimiento.idMantenimiento)">
                            </SegmentButton>
                            <SegmentButton name="INFORME" estado @click="informePreventivo(mantenimiento.idMantenimiento)">
                            </SegmentButton>
                        </ion-segment>
                    </div>
                </ion-accordion>
            </ion-accordion-group>
        </ion-card>
    </ion-content>
</template>

<script setup lang="ts">
import {
    IonContent,
    useIonRouter,
    IonCard,
    IonFab,
    IonFabButton,
    IonIcon,
    IonLabel,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonSegment,
} from '@ionic/vue';
import Header from '@/common/Header.vue';
import SegmentButton from '@/common/SegmentButton.vue';
import CardContent from '@/common/CardContent.vue';
import { onMounted } from 'vue';
import { useCorrectivoStore } from '@/stores/mCorrectivoStore';
import { useAuthStore } from '@/stores/authStore';
import { Preferences } from '@capacitor/preferences';

const router = useIonRouter();
const correctivoStore = useCorrectivoStore();
const authStore = useAuthStore();


const routers = () => {
    router.push('tab1/2');
}

const informePreventivo = (id: string) => {
    console.log('informe preventivo', id);
}

const informeAnterior = (id: string) => {
    console.log('informe anterior', id);
}

const checkAuth = async () => {
    const data = await Preferences.get({ key: 'auth' });
    if (data.value) {
        const authData = JSON.parse(data.value)
        correctivoStore.getCorrectivo(Number(authData.idtuser));
    }
};

onMounted(() => {
    checkAuth();
});

</script>

<style scoped>
ion-icon {
    color: rgb(0, 0, 0);
    /* background: white; */
}

ion-fab-button {
    --background: #003249;
    --border-radius: 10px;
}
</style>