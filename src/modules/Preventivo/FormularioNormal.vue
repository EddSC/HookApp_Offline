<script setup lang="ts">
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonItem,
    IonLabel,
    modalController,
    IonText,
    IonSelect,
    IonSelectOption,
    IonList,
    IonTextarea,
    IonSegment,
    IonItemGroup,
    IonItemDivider,
    IonSegmentButton,
    actionSheetController,
    IonFab,
    IonFabButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonItemSliding,
    IonItemOptions,
    IonItemOption
} from '@ionic/vue';
import SegmentButton from '@/common/SegmentButton.vue';
import { Nota, Cotizacion, PrioridadCondicion } from '@/interfaces/mantenimientoInterface';
import { computed, ref } from 'vue';


const props = defineProps({
    taskDetail: {
        type: Object,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    titulo: {
        type: String,
        required: true,
    },
})
const selectedSegment = ref('1');
const cerrar = () => {
    return modalController.dismiss(null, 'cerrar');
}
const segmentChanged = (ev: CustomEvent) => {
    selectedSegment.value = ev.detail.value;
}

const selectPrioridad = [
    { nombre: '0 - No Requiere reparación', value: 0 },
    { nombre: '1 - Asociado a la seguridad', value: 1 },
    { nombre: '2 - Involucra perdidas', value: 2 },
    { nombre: '3 - No hay efecto', value: 3 },
]
const selectCondicion = [
    { nombre: '1 Muy bueno o nuevo', value: 1 },
    { nombre: '2 Bueno (rara vez usado)', value: 2 },
    { nombre: '3 Aceptable', value: 3 },
    { nombre: '4 Limpieza o lubricación.', value: 4 },
    { nombre: '5 Revisar item periódicamente.', value: 5 },
    { nombre: '6 Requiere ajuste.', value: 6 },
    { nombre: '7 Reemplazo requerido después de X horas de USO.', value: 7 },
    { nombre: '8 Reparación del componente.', value: 8 },
    { nombre: '9 Reemplazo del Item o Implementación.', value: 9 },
    { nombre: '10 Precaución No Usar. Amenaza a la vida / Peligro', value: 10 },
    { nombre: '11 Inaccesible para Inspeccionar', value: 11 },
]
const selectCotizacion = [
    { nombre: 'Servicio', value: 1 },
    { nombre: 'Repuesto', value: 2 },
    { nombre: 'Servicio y Repuesto', value: 3 },
    { nombre: 'Modernización', value: 4 },
]

const nota = ref({} as Nota);
const cotizacion = ref({} as Cotizacion);
const prioridadCondicion = ref({} as PrioridadCondicion);

const submitFrmNota = () => {
    console.log('submitFrmNota');
}
const submitFrmCotizacion = () => {
    console.log('submitFrmCotizacion');
}

const customFormatter = (inputLength:number, maxLength:number) => {
    return `${maxLength - inputLength} caracteres restantes`;
}

</script>

<template>
    <ion-header>
        <ion-toolbar class="toolbar">
            <ion-title> | {{ props.titulo }}</ion-title>
            <ion-buttons slot="end">
                <ion-button color="danger" @click="cerrar"> <b>Cerrar</b> </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-segment :value="selectedSegment" @ionChange="segmentChanged($event)" mode="md" color="primary">
        <SegmentButton name="NOTA" value="1" />
        <SegmentButton name="COTIZACIÓN" value="2" />
    </ion-segment>
    <ion-item lines="none">
        <ion-text>{{ props.taskDetail.num_ord }} | {{ props.taskDetail.Item }}</ion-text>
    </ion-item>
    <ion-content class="ion-padding" v-if="selectedSegment === '1'">
        <form @submit.prevent="submitFrmNota">
            <ion-list class="fondoFormulario">
                <ion-item>
                    <ion-select mode="ios" interface="action-sheet" label="Selecione Prioridad"
                        placeholder="Seleccione Prioridad" v-model.number="prioridadCondicion.VarPrio">
                        <ion-select-option v-for="prioridad in selectPrioridad" :key="prioridad.value"
                            :value="prioridad.value">{{ prioridad.nombre }}</ion-select-option>
                    </ion-select>
                </ion-item>
                <ion-item>
                    <ion-select mode="ios" interface="action-sheet" label="Selecione Condición"
                        placeholder="Seleccione Condición" v-model.number="prioridadCondicion.VarStatus">
                        <ion-select-option v-for="condicion in selectCondicion" :key="condicion.value"
                            :value="condicion.value">{{ condicion.nombre }}</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>


            <ion-list class="fondoFormulario">
                <ion-item>
                    <ion-label><b>NOTA</b></ion-label>
                </ion-item>
                <ion-item lines="none">
                    <ion-textarea :disabled="prioridadCondicion.VarStatus <= 3" :maxlength="225" autocapitalize="on"
                        inputmode="text" :rows="7" v-model.trim="nota.comentario" label-placement="floating"
                        placeholder="Ingrese Observaciones..." :counter="true" :counter-formatter="customFormatter">
                        <div slot="label">Observaciones <ion-text color="danger">(required)</ion-text></div>
                    </ion-textarea>
                </ion-item>
                
                <ion-item lines="none">
                    <ion-textarea :disabled="prioridadCondicion.VarStatus <= 3" :maxlength="225" autocapitalize="on"
                        inputmode="text" mode="ios" :rows="7" v-model.trim="nota.recomendacion"
                        label-placement="floating" placeholder="Ingrese Recomendaciones..." :counter="true"
                        :counter-formatter="customFormatter">
                        <div slot="label">Recomendaciones <ion-text color="danger">(required)</ion-text></div>
                    </ion-textarea>
                </ion-item>

                <ion-button expand="block" fill="clear" type="submit">
                    <b>Registrar</b>
                </ion-button>
            </ion-list>
        </form>
    </ion-content>
     <!-- Fin formulario NOTA -->
    <!-- Inicio de Formulario Cotización -->
    <ion-content class="ion-padding" v-if="selectedSegment === '2'">
        <form @submit.prevent="submitFrmCotizacion">
            <ion-list class="fondoFormulario">
                <ion-item>
                    <ion-label>Tipo de Cotización</ion-label>
                    <ion-select mode="ios" interface="action-sheet" placeholder="Seleccione Cotización"
                        v-model="cotizacion.TipoCotizacion" label="Cotización">
                        <ion-select-option v-for="cotizacion in selectCotizacion" :key="cotizacion.value"
                            :value="cotizacion.value">{{ cotizacion.nombre }}</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>


            <ion-list class="fondoFormulario">
                <ion-item>
                    <ion-label> <b>Cotización Escrita</b></ion-label>
                </ion-item>
                <ion-item>
                    <ion-textarea :disabled="cotizacion.TipoCotizacion === 0" :maxlength="250" autocapitalize="on"
                        inputmode="text" mode="ios" :rows="8" placeholder="Ingrese nota de cotización..."
                        v-model.trim="cotizacion.NotaEscrita"
                        label-placement="floating"
                        :counter="true"
                        :counter-formatter="customFormatter"
                    >
                    <div slot="label">Cotización Escrita <ion-text color="danger">(required)</ion-text></div>
                    </ion-textarea>
                </ion-item>
                <ion-button expand="block" fill="clear" type="submit">
                    <b>Registrar Cotización</b>
                </ion-button>
            </ion-list>
        </form>
        <!-- HookCamara -->
    </ion-content>
</template>


<style scoped>
ion-button {
    --background: #ff4d00;
    --color: white;
    --border-radius: 10px;
}

ion-item {
    --background: #E4E2E1;
    --color: black;
}

.caracter {
    color: blue;
}

.caracterMin {
    color: red;
}

/* .image-upload{
    margin-top: 30rem;
} */
#takePhoto {
    --background: #AC44CF;
}

.fondoFormulario {
    background: #E4E2E1;
}

.image-upload {
    margin-bottom: 4rem;
}

.btnStart {
    margin-bottom: 7.5rem;
}

#btnAudio {
    --background: #6b6b6b;
}

.btnAudio {
    --background: #6b6b6b;
}

.btnStartStop {
    margin-bottom: 7.5rem;
}

#btnAudioStop {
    --background: #FF4D00;
}

.onTime {
    --background: #003249;
}

.onTimetext {
    color: white;
    font-size: 1.3rem;
}

.audiosliding {
    padding-right: 50px;
    background: #E4E2E1;
}

.toolbar {
    --background: linear-gradient(0deg, #003249, #003249);
    box-shadow: 0px 4px 9px rgba(42, 59, 75, 0.2);
}

ion-segment-button {
    color: #ffffff;
}

ion-segment {
    --background: #383838;
}

.addPhoto {
    --background: #5157AE;
    --border-radius: 20%;
}

.btn-add {
    margin-top: -0.7rem;
}

ion-textarea {
    font-size: 1.2rem;
    /* negrita */
    font-weight: bold;
}
ion-content {
    --background: #E4E2E1;
}
</style>