<script setup lang="ts">
import {
    IonButton,
    IonContent,
    IonText,
    IonSelect,
    IonSelectOption,
    IonTextarea
} from '@ionic/vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { CorrectivoDesc, CorrectivoObs, TaskDetails } from '@/interfaces/mantenimientoInterface';
import { genUniqueId } from '@/helpers/uniqueId';
import { showToast } from '@/helpers/showToast';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { usePreventivoStore } from '@/stores/mPreventivoStore';


const { insertarElemento } = useStorage();
const preventivoStore = usePreventivoStore();

const route = useRoute()
const operatividad = [
    { value: 1, nombre: 'OPERATIVO' },
    { value: 2, nombre: 'OPERATIVO CON OBSERVACIONES' },
    { value: 3, nombre: 'INOPERATIVO' }
];
const recomendacion = ref({
    Descripcion: '',
} as CorrectivoDesc)
const correctivo = ref({
    estado: '',
    idMantenimiento: route.params.id,
    recomendacion: [] as any,
} as CorrectivoObs)

let setCorrectivo: TaskDetails = {
    id: '',
    idTaskDetail: '',
    idMantenimiento: 0,
    idTitulo: 0,
    idOrden: 0,
    idItem: 0,
    tipo: 'Correctivo Recomendaciones',
    fechaHora: '',
    status: 'pending',
    correctivoObs: correctivo.value,
}

const limpiarForm = () => {

    correctivo.value = {
        estado: '',
        idMantenimiento: Number(route.params.id),
        recomendacion: [] as any,
    }

    setCorrectivo = {
        id: '',
        idTaskDetail: '',
        idMantenimiento: 0,
        idTitulo: 0,
        idOrden: 0,
        idItem: 0,
        tipo: 'Correctivo Recomendaciones',
        fechaHora: '',
        status: 'pending',
        correctivoObs: correctivo.value
    }
}

const regCorrectivoObs = () => {
    const id = genUniqueId();
    setCorrectivo.id = id;
    setCorrectivo.idTaskDetail = id;
    setCorrectivo.idMantenimiento = correctivo.value.idMantenimiento;
    setCorrectivo.fechaHora = new Date().toLocaleString();
    setCorrectivo.correctivoObs = correctivo.value;
}

const operatividades = computed(() => {
    const id = correctivo.value.estado;
    for (let i in operatividad) {
        if (operatividad[i].nombre === id) {
            return operatividad[i].nombre;
        }
    }
})


const submitCorrectivo = async () => {
    try {
        await presentLoading('procesando...')
        if (correctivo.value.estado === '') {
            await showToast('Seleccione el estado de la grúa', 'warning');
            return;
        }
        if (recomendacion.value.Descripcion !== '') {
            await showToast('Existe datos pendientes en recomendaciones', 'warning');
            return;
        }

        regCorrectivoObs();
        await insertarElemento(preventivoStore.nameStorage, setCorrectivo.id, setCorrectivo)
        await showToast('Se registro correctamente', 'success');
        console.log('correctivo', setCorrectivo);
        limpiarForm();
    } catch (error) {
        await showToast('Error al registrar', 'danger');
    } finally {
        await dismissLoading();
    }
}

const recomendaciones = () => {
    correctivo.value.recomendacion.push(recomendacion.value.Descripcion);
    recomendacion.value.Descripcion = '';
}

console.log('correctivo', route.params.id);
</script>

<template>
    <ion-content class="ion-padding">
        <form @submit.prevent="submitCorrectivo">
            <ion-select label="Selecione Estado" interface="action-sheet" placeholder="Seleccione Condición"
                cancelText="Cancelar" v-model.trim="correctivo.estado">
                <ion-select-option v-for="opr in operatividad" :value="opr.nombre">{{ opr.nombre }}
                </ion-select-option>
            </ion-select>

            <ion-text class="txtNotafrm">
                <h4>RESUMEN Y RECOMENDACIONES</h4>
            </ion-text>
            <ion-textarea class="custom" :disabled="correctivo.estado === ''" :maxlength="350" autocapitalize="on" inputmode="text"
                mode="ios" :rows="6" label-placement="floating" label="Recomendaciones"
                placeholder="Ingrese Recomendaciones..." helper-text="Caracteres Max" :counter="true"
                v-model.trim="recomendacion.Descripcion">
            </ion-textarea>
            <div class="btnContainer">
                <ion-button class="addRecomendaciones" type="button" @click="recomendaciones">
                    AGREGAR RECOMENDACIONES
                </ion-button>
            </div>
            <div class="ion-padding">
                <ion-text v-if="correctivo.estado !== ''">
                    <p>Estado de la Grua: <b>{{ operatividades }}</b></p>

                    <div class="recomendacion" v-for="rec in correctivo.recomendacion">
                        <p>{{ rec }}</p>
                    </div>

                </ion-text>
            </div>
            <ion-button type="submit" expand="block" fill="clear" shape="round"
                :disabled="correctivo.recomendacion.length === 0">
                REGISTRAR CONCLUSIONES
            </ion-button>
        </form>
    </ion-content>
</template>

<style scoped>
/* Estilo del ion-select */
ion-select {
    --background: #D9D9D9;
    --placeholder-color: #000000;
    color: #000000;
    --border-color: #cccccc;
    --border-radius: 8px;
    --padding-start: 16px;
    --padding-end: 16px;
    --padding-top: 12px;
    --padding-bottom: 12px;
    margin-bottom: 2px;
}

/* Estilo de las opciones del ion-select */
ion-select-option {
    --background: #ffffff;
    --color: #333333;
    --ion-color-primary: #336699;
}

/* Estilo de la opción seleccionada */
ion-select-option[selected] {
    --background: #336699;
    --color: #002232;
}

/* Estilo del texto de la opción seleccionada */
ion-select-option[selected] ion-label {
    font-weight: bold;
}

/* Estilo del botón de cancelar */
ion-select ion-alert-button.cancel-button {
    color: #999999;
    font-weight: bold;
}

h4 {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
    padding: 0;
    color: #000000;
}

.txtNotafrm {
    display: block;
    margin-top: 30px;
    margin-bottom: 5px;
    color: #000000;
}

ion-button {
    --border-radius: 8px;
    --background: #FE6B01;
    --color: #ffffff;
    --padding-start: 16px;
    --padding-end: 16px;
    --padding-top: 12px;
    --padding-bottom: 12px;
    margin-bottom: 2px;
    font-weight: bold;
}

p {
    font-size: 1.2rem;
    margin: 0;
    padding: 0;
    color: #000000;
}

.recomendacion {
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px;
}

.addRecomendaciones {
    /* posicionar button a la derecha */
    --background: #003249;
    --color: #ffffff;

}

.btnContainer {
    display: flex;
    justify-content: flex-end;
}
</style>