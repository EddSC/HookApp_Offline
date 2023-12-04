<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue';
import Header from '@/common/Header.vue';
import InformationUsuario from '@/modules/Operaciones/InformacionUsuario.vue';
import ListaPersonal from '@/modules/Operaciones/ListaPersonal.vue';
import Ajustes from '@/modules/Operaciones/Ajustes.vue';
import CerrarSesion from '@/modules/Operaciones/CerrarSesion.vue';
import Sincronizar from '@/modules/Operaciones/Sincronizar.vue';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { usePreventivoStore } from '@/stores/mPreventivoStore';
import { showToast } from '@/helpers/showToast';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { useSynchronize } from '@/stores/synchronize';

const syncronized = useSynchronize();
const { obtenerActividades } = useStorage();
const preventivoStore = usePreventivoStore();


const copiarActividades = async () => {
  try {
    await presentLoading('Obteniendo actividades');
    const actividades = await obtenerActividades(preventivoStore.nameStorage);
    syncronized.copiarPendientes(actividades);
    await showToast('Actividades obtenidos', 'success');
  } catch (error) {
    await showToast('No se pudo obtener las actividades', 'danger');
  } finally {
    await dismissLoading(); 
  }
}
const handleRefresh = async (event: CustomEvent) => {
    await copiarActividades();
    event.detail.complete();
}
 
</script>

<template>
  <ion-page>
    <Header titulo="Operaciones" color="bluedark" >
      <Sincronizar />
    </Header>
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
      <InformationUsuario class="InformationUsuario" />
      <ListaPersonal />
      <Ajustes />
      <CerrarSesion />
    </ion-content>
  </ion-page>
</template>


<style scoped>
/* css */
</style>