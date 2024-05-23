<script setup lang="ts">
import {
    IonItem,
    IonIcon,
    IonBadge,
    IonButton,
    IonProgressBar,
} from '@ionic/vue';
import { notificationsSharp, syncCircle, trash } from 'ionicons/icons';
import { showToast } from '@/helpers/showToast';
import { syncronizeTasks } from '@/services/__mocks__/sendTasksToAPI';
import { useSynchronize } from '@/stores/synchronize';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { ref } from 'vue';

const synStore = useSynchronize();
const { procesarEstado } = syncronizeTasks()
const { eliminarActividad } = useStorage();
const progress = ref(false);
const taskPending = ref(0);
const taskProcessed = ref(0);
const procesarTasks = async () => {
    try {
        taskPending.value = synStore.pendientesPendientes
        progress.value = true;
        await showToast('Sincronización en curso. ¡Iniciando...', 'warning');
        const task = synStore.pendientes.filter((task) => task.status === 'pending');
        await procesarEstado(task);
        await showToast('¡Sincronización completada con éxito!', 'success');
        progress.value = false;
    } catch (error) {
        await showToast('Error al sincronizar tareas', 'danger');
    }
}

const eliminarTareas = async () => {
    try {
        await showToast('Eliminando tareas...', 'warning');
        const tasks = synStore.pendientes.filter((task) => task.status === 'processed');
        for (const task of tasks) {
           const res = await eliminarActividad('gruas', task.id);
              if (res === 'Eliminado') {
                synStore.eliminarActividad(task.id);
              }
        }
        await showToast('¡Tareas eliminadas con éxito!', 'success');
    } catch (error) {
        await showToast('Error al eliminar tareas', 'danger');
    }
}

</script>

<template>
    <div class="ion-padding">
        <ion-progress-bar v-if="progress" :value="(taskPending - synStore.pendientesPendientes) / taskPending"
            :buffer="(taskPending - synStore.pendientesPendientes) / taskPending + .15">
        </ion-progress-bar>
        <ion-item lines="none" expand="inset" slot="header">
            <ion-button>
                <ion-icon :class="synStore.pendientesPendientes ? 'notification' : ''" :icon="notificationsSharp">
                </ion-icon>
                <ion-badge v-if="synStore.pendientesPendientes" color="primary">{{ synStore.pendientesPendientes
                }}</ion-badge>
            </ion-button>
            <ion-button @click="eliminarTareas">
                <ion-icon :class="synStore.pendientesProcesados ? 'trash' : ''" :icon="trash"></ion-icon>
                <ion-badge v-if="synStore.pendientesProcesados"> {{ synStore.pendientesProcesados }} </ion-badge>
            </ion-button>
            <ion-button :class="progress ? 'notification' : ''" slot="end" @click="procesarTasks">
                <ion-icon :icon="syncCircle"></ion-icon>
            </ion-button>
        </ion-item>
    </div>
</template>


<style scoped>
ion-icon {
    font-size: 48px;
}

ion-item {
    --background: #22242800;
    --color: #fff;
    border-radius: 8px;
}

ion-badge {
    --background: #D4463C;
    --color: white;
    border-radius: 8px;
    font-size: 1rem;
}

ion-button {
    --background: transparent;
    --color: #929292;
    --box-shadow: none;
}

.notification {
    color: #428CFF;
}

.trash {
    color: #D4463C;
}

ion-progress-bar::part(track) {
    background: #f3e895;
}

ion-progress-bar::part(progress) {
    background: #09c567;
}

ion-progress-bar::part(stream) {
    background-image: radial-gradient(ellipse at center, #e475f3 0%, #e475f3 30%, transparent 30%);
}
</style>