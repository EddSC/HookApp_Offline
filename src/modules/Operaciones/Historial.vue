<script setup lang="ts">
import {
    IonList,
    IonItem,
    IonLabel,
    IonItemDivider,
    IonItemOptions,
    IonItemSliding,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonItemOption,
} from '@ionic/vue';
import { TaskDetailsType } from '../../types/MantenimientoTypes';
import { trash } from 'ionicons/icons';
import { useSynchronize } from '@/stores/synchronize';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { showToast } from '@/helpers/showToast';

defineProps({
    history: {
        type: Array as () => TaskDetailsType[],
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    contador: {
        type: Number,
        required: true
    },
});

const synStore = useSynchronize();
const { eliminarActividad } = useStorage();


const deleteTask = async (id: string) => {
    try {
        const res = await eliminarActividad('gruas', id);
        if (res === 'Eliminado') {
            synStore.eliminarActividad(id);
        }
        showToast('¡Tarea eliminada con éxito!', 'success');
    } catch (error) {
        showToast('Error al eliminar tarea', 'danger');
    }
};
</script>
<template>
    <ion-list>
        <ion-item-divider class="pendienteDivider">
            <ion-label>
                {{ estado }} | {{ contador }}
            </ion-label>
        </ion-item-divider>

        <ion-item-sliding v-for="task in history" :key="task.id">
            <ion-item>
                <ion-grid>
                    <ion-row>
                        <ion-col size="12" size-sm="4" size-md="3">
                            <ion-label color="primary">
                                <h4>Mantenimiento: {{ task.idMantenimiento }}</h4>
                            </ion-label>
                        </ion-col>
                        <ion-col size="12" size-sm="4" size-md="3">
                            <ion-label color="darkgreen">
                                <h4 v-if="task.idTitulo">Titulo: {{ task.idTitulo }}</h4>
                            </ion-label>
                        </ion-col>
                        <ion-col size="12" size-sm="4" size-md="3">
                            <ion-label color="tertiary">
                                <h4 v-if="task.idOrden">Item: {{ task.idOrden }}</h4>
                            </ion-label>
                        </ion-col>
                        <ion-col size="12" size-sm="6" size-md="3">
                            <ion-label color="darkgreen">
                                <h4>Tipo: {{ task.tipo }}</h4>
                            </ion-label>
                        </ion-col>
                        <ion-col size="12" size-sm="6" size-md="3">
                            <ion-label color="darkgreen">
                                <h4>Fecha: {{ task.fechaHora }}</h4>
                            </ion-label>
                        </ion-col>
                        <ion-col size="12" size-sm="6" size-md="3">
                            <ion-label color="danger">
                                Id: {{ task.idTaskDetail }}
                            </ion-label>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </ion-item>
            <ion-item-options>
                <ion-item-option color="danger" @click="deleteTask(task.id)">
                    <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                </ion-item-option>
            </ion-item-options>
        </ion-item-sliding>
    </ion-list>
</template>

<style scoped>
h4 {
    font-size: 1.2rem;
    font-weight: bold;
}

ion-list {
    background: #EFF1F3;
}

ion-item-divider {
    background-color: #FDFFFC;
    color: #000000;
    font-size: 1.2rem;
    font-weight: bold;
}

ion-item {
    --background: #D9D9D9;
    --color: black;
    --font-size: 1.2rem;
}

ion-icon {
    color: rgb(255, 255, 255);
}

.ion-button {
    --padding-start: 10px;
    --padding-end: 10px;
    --padding-top: 5px;
    --padding-bottom: 5px;
    margin: 10px;
}
</style>