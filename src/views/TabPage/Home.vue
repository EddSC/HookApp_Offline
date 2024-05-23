<template>
    <ion-page>
        <Preventivo />
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from '@ionic/vue';
import Preventivo from '@/modules/Preventivo/Preventivo.vue';
import { useSynchronize } from '@/stores/synchronize';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { usePreventivoStore } from '@/stores/mPreventivoStore';
import { onMounted } from 'vue';

const syncronized = useSynchronize();
const preventivoStore = usePreventivoStore();
const { obtenerActividades } = useStorage();

const copiarActividades = async () => {
    const actividades = await obtenerActividades(preventivoStore.nameStorage);
    syncronized.copiarPendientes(actividades);
}

onMounted(() => {
    copiarActividades()
});
</script>