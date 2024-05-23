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
    actionSheetController,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
} from '@ionic/vue';
import SegmentButton from '@/common/SegmentButton.vue';
import { Nota, Cotizacion, PrioridadCondicion, TaskDetails, Image, Audio, Email, Upkeep } from '@/interfaces/mantenimientoInterface';
import { computed, ref, onMounted } from 'vue';
import ButtonSubmit from '@/common/ButtonSubmit.vue';
import TakePhoto from '@/common/takePhoto.vue';
import Camera from '@/common/Camera.vue';
import { close, trash, warning } from 'ionicons/icons';
import { usePhotoGallery, UserPhoto } from '@/services/__mocks__/multimedia/photoGallery';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { genUniqueId } from '@/helpers/uniqueId';
import { useAuthStore } from '@/stores/authStore';
import { showToast } from '@/helpers/showToast';
import { usePreventivoStore } from '@/stores/mPreventivoStore';
import { useRoute } from 'vue-router';
import { presentLoading, dismissLoading } from '@/helpers/loading';

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

const preventivoStore = usePreventivoStore();
const authStore = useAuthStore();
const { obtenerElemento, insertarElemento, insertarDatos } = useStorage();
const { photos, takePhoto, deletePhoto, pickPhoto, base64Convert } = usePhotoGallery();
const selectedSegment = ref('1');
const nota = ref({} as Nota);
const cotizacion = ref({} as Cotizacion);
const prioridadCondicion = ref({} as PrioridadCondicion);
const setTaskDetail = ref({} as TaskDetails);
const image = ref({} as Image);
const audios = ref({} as Audio);
const message = ref({} as Email);
const mPreventivo = ref({} as Upkeep);
const route = useRoute();
const BASE_IMAGE = import.meta.env.VITE_BASE_IMAGE as string;

const id = Number(route.params.id);
const orden = Number(route.params.idOden);

const cerrar = () => {
    return modalController.dismiss('ok');
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

const caracteresObs = computed(() => {
    return nota.value.comentario !== undefined ? 225 - nota.value.comentario.length : 225;
})
const caracteresRec = computed(() => {
    return nota.value.recomendacion !== undefined ? 225 - nota.value.recomendacion.length : 225;
})
const caracteresCoti = computed(() => {
    return cotizacion.value.NotaEscrita !== undefined ? 250 - cotizacion.value.NotaEscrita.length : 250;
})

const showActionSheet = async (photo: UserPhoto) => {
    const actionSheet = await actionSheetController.create({
        header: "Photos",
        buttons: [
            {
                text: "Delete",
                role: "destructive",
                icon: trash,
                handler: () => {
                    deletePhoto(photo);
                },
            },
            {
                text: "Cancel",
                icon: close,
                role: "cancel",
                handler: () => {
                    // Nothing to do, action sheet is automatically closed
                },
            },
        ],
    });
    await actionSheet.present();
};

// registro de prioridad y condicion en storage
const regPrioridadCondicion = () => {
    prioridadCondicion.value.VarItem = props.taskDetail.id_item;
    prioridadCondicion.value.Tecnico = Number(authStore.authId);
    prioridadCondicion.value.VarMant = props.taskDetail.IdMantenimiento;
    prioridadCondicion.value.VarTitulo = props.taskDetail.IdTitulo;

    setTaskDetails();
    setTaskDetail.value.tipo = 'prioridad condicion (nota)';
    setTaskDetail.value.prioridadCondicion = prioridadCondicion.value;
}

const regFormNota = () => {
    const shortId = Date.now().toString().substring(4);
    nota.value.idRecomen = Number(shortId);
    nota.value.idComentarios = Number(shortId);
    nota.value.item = props.taskDetail.id_item;
    nota.value.varNota = 1;
    nota.value.varFoto = photos.value.length > 0 ? 1 : 0;
    nota.value.varMant = props.taskDetail.IdMantenimiento;
    nota.value.tecnico = Number(authStore.authId);
    nota.value.varTitulo = props.taskDetail.IdTitulo;

    setTaskDetails();
    setTaskDetail.value.tipo = 'nota';
    setTaskDetail.value.nota = nota.value;

}

const setTaskDetails = async () => {
    const uniqueId = genUniqueId();
    setTaskDetail.value.id = uniqueId;
    setTaskDetail.value.idTaskDetail = uniqueId;
    setTaskDetail.value.idMantenimiento = props.id;
    setTaskDetail.value.idTitulo = props.taskDetail.IdTitulo;
    setTaskDetail.value.idOrden = props.taskDetail.num_ord;
    setTaskDetail.value.idItem = props.taskDetail.id_item;
    setTaskDetail.value.fechaHora = new Date().toLocaleString();
    setTaskDetail.value.status = 'pending';
}

const regFormImage = (filepath: string, base64: string) => {
    image.value.nombre = filepath;
    image.value.imagen = base64;
    image.value.tipo = Number(selectedSegment.value);
    image.value.mantenimiento = props.taskDetail.IdMantenimiento;
    image.value.tecnico = Number(authStore.authId);
    image.value.motivo = props.taskDetail.id_item;
    image.value.titulo = props.taskDetail.IdTitulo;

    setTaskDetails();
    setTaskDetail.value.tipo = selectedSegment.value === '1' ? 'imagen (nota): ' : 'imagen (cotizacion)';
    setTaskDetail.value.image = image.value;
}

const regCotizacion = () => {
    cotizacion.value.IdItems = props.taskDetail.id_item;
    cotizacion.value.idMant = props.taskDetail.IdMantenimiento;
    cotizacion.value.Status = 1;
    cotizacion.value.Foto = photos.value.length > 0 ? 1 : 0;
    cotizacion.value.Audio = 0;
    cotizacion.value.idUser = Number(authStore.authId);
    cotizacion.value.titulo = orden;
    cotizacion.value.idOffline = ''

    setTaskDetails();
    setTaskDetail.value.tipo = 'cotizacion';
    setTaskDetail.value.cotizacion = cotizacion.value;
}

type tipo = {
    value: number,
    nombre: string
}

const regMenssageEmail = (image:string[], tipo:tipo|undefined) => {
    let emailImage = '';
    for (const img of image) {
        emailImage += `<a href="${BASE_IMAGE + img}"> <img style="display: block; margin: auto;" src="${BASE_IMAGE + img}" alt="Imagen" width="25%" height="auto"> </a>`;
    }
    const emailAudio = 'Audio no disponible'
    message.value.asunto = `Informe de Mantenimiento: ${mPreventivo.value.Frecuencia} / ${mPreventivo.value.Nombres} / ${mPreventivo.value.TagGrua} / ${mPreventivo.value.Area}`;
    message.value.destinatario = String(tipo?.value);
    message.value.varMessage = `
                    <!DOCTYPE html>
                    <html lang="es">

                    <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    </head>

                    <body>

                    <div style=" font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 4%; " >
                    <div style="height: 150px; background-color: #0F111A; text-align: center; ">
                    <img style="margin-top: 20px ;" src="https://210811cace.com/wasp/Konecranes.png"  height="80px"  alt="">
                    <h2 style="color: white; margin:0" >Konecranes</h2>
                    </div>
                    <div style="background-color: #F4F4F4; padding: 15px; "  >
                    <div style="background-color: #00000027; padding: 15px; border-radius: 10px;  " >
                    <p style="text-align: center;"><b><span style="color: #4777CC; font-size: 1.2rem;">DATOS ESPECÍFICOS DEL EQUIPO DE LEVANTE</span></b></p>
                    <span>
                    <p><b><span style="font-size: 1rem;">TAG / IDENTIFICACION DE GRUA:</span></b> ${mPreventivo.value.TagGrua}</p>
                    <p><b><span style="font-size: 1rem;">SERIE:</span></b> ${mPreventivo.value.TagGrua}</p>
                    <p><b><span style="font-size: 1rem;">MARCA:</span></b> ${mPreventivo.value.Marcas}</p>
                    <p><b><span style="font-size: 1rem;">CAPACIDAD DE LEVANTE:</span></b> ${mPreventivo.value.Capacidad}</p>
                    <p><b><span style="font-size: 1rem;">ÁREA:</span></b> ${mPreventivo.value.Area}</p>
                    </span>
                    </div>
                    <div style="padding: 15px;">
                    <span>
                    <p><b><span style="font-size: 1rem;">Cotización informe N°: </span></b> ${mPreventivo.value.numreporte} </p>
                    <p><b><span style="font-size: 1rem;">Tipo: </span></b> ${tipo?.nombre}</p>
                    <p><b><span style="font-size: 1rem;">Item: </span></b> ${props.taskDetail.Item} </p>
                    </span>
                    <p><b><span style="font-size: 1rem;">Nota Escrita: </span></b> ${cotizacion.value.NotaEscrita} </p>
                    <p><b><span style="font-size: 1rem;">Técnico: </span></b> ${authStore.authNombres}</p>

                    <br>
                    <div style="max-width: 1200px; margin: 0 auto; display: grid; gap: 1rem;
                    grid-template-columns: repeat(auto-fit, minmax(350px, auto));
                    ">
                    ${emailImage}
                    </div>
                    <br>
                    <br>
                    ${emailAudio}
                    </div>

                    </body>
                `;

    setTaskDetails();
    setTaskDetail.value.tipo = 'Cotización - Mensaje Email';
    setTaskDetail.value.messageEmail = message.value;
}

const procesarEstado = async (id_item: number) => {
    const res = preventivoStore.procesarEstadoItem(id_item);
    await insertarDatos('pItem', `${String(id)}${String(orden)}${String(authStore.authId)}`, res);
}

const registrarFoto = async () => {
    for (const photo of photos.value) {
        const base64 = await base64Convert(photo.filepath, photo.webviewPath);
        regFormImage(photo.fileName, String(base64));
        await insertarElemento(preventivoStore.nameStorage, setTaskDetail.value.id, setTaskDetail.value);
        setTaskDetail.value = {} as TaskDetails;
        image.value = {} as Image;

        await deletePhoto(photo);
    }
}

const submitFrmNota = async () => {
    try {
        await presentLoading('Registrando...');
        if (prioridadCondicion.value.VarStatus !== undefined || prioridadCondicion.value.VarPrio !== undefined || nota.value.comentario !== undefined || nota.value.recomendacion !== undefined) {
            if (prioridadCondicion.value.VarPrio === 0 && prioridadCondicion.value.VarStatus === 3) return await showToast('Prioridad y Condición tiene que ser diferente 0 - 3', 'danger');
            if (prioridadCondicion.value.VarPrio === undefined) return await showToast('Prioridad es requerido', 'danger');
            if (prioridadCondicion.value.VarStatus === undefined) return await showToast('Condición es requerido', 'danger');
            if (nota.value.comentario === undefined || nota.value.comentario === '') return await showToast('Observaciones es requerido', 'danger');
            if (nota.value.recomendacion === undefined || nota.value.recomendacion === '') return await showToast('Recomendaciones es requerido', 'danger');

            regPrioridadCondicion()
            await insertarElemento(preventivoStore.nameStorage, setTaskDetail.value.id, setTaskDetail.value);
            setTaskDetail.value = {} as TaskDetails;
            prioridadCondicion.value = {} as PrioridadCondicion;

            regFormNota()
            await insertarElemento(preventivoStore.nameStorage, setTaskDetail.value.id, setTaskDetail.value);
            setTaskDetail.value = {} as TaskDetails;
            nota.value = {} as Nota;

            if (photos.value.length > 0) await registrarFoto();

            await procesarEstado(props.taskDetail.id_item);
            await showToast('Registrado con éxito', 'success');
        } else if (photos.value.length > 0) {
            await registrarFoto();

        } else {
            await showToast('Datos requeridos', 'danger');
        }
    } catch (error) {
        await showToast('Error al registrar', 'danger');
    } finally {
        await dismissLoading();
    }
}
const submitFrmCotizacion = async () => {
    try {
        await presentLoading('Registrando...');

        if (cotizacion.value.TipoCotizacion === undefined) return showToast('Tipo de Cotización es requerido', 'danger');
        if (cotizacion.value.NotaEscrita === undefined || cotizacion.value.NotaEscrita === '') return showToast('Cotización Escrita es requerido', 'danger');
        if (photos.value.length === 0) return showToast('Foto es requerido', 'danger');
        regCotizacion();
        await insertarElemento(preventivoStore.nameStorage, setTaskDetail.value.id, setTaskDetail.value);
        const nombresImagenes = photos.value.map(photo => photo.fileName);
        const tipoCotizacion = selectCotizacion.find((i) => i.value === cotizacion.value.TipoCotizacion);
        setTaskDetail.value = {} as TaskDetails;
        
        regMenssageEmail(nombresImagenes, tipoCotizacion);
        await insertarElemento(preventivoStore.nameStorage, setTaskDetail.value.id, setTaskDetail.value);
        cotizacion.value = {} as Cotizacion;
        setTaskDetail.value = {} as TaskDetails;
        message.value = {} as Email;

        if (photos.value.length > 0) await registrarFoto();

        await showToast('Registrado con éxito', 'success');

    } catch (error) {
        await showToast('Error al registrar', 'danger');
    } finally {
        await dismissLoading();
    }
}

const customFormatter = (inputLength: number, maxLength: number) => {
    return `${maxLength - inputLength} caracteres restantes`;
}

const obtenerDatosMantenimiento = async () => {
    const dbData = await obtenerElemento('mPreventivo', String(authStore.authId));
    mPreventivo.value = dbData.find((objeto:any) => objeto.idMantenimiento === String(id));
}

onMounted(() => {
    obtenerDatosMantenimiento();
})

</script>

<template>
    <ion-header>
        <ion-toolbar class="toolbar">
            <ion-title>| {{ props.titulo }}</ion-title>
            <ion-buttons slot="end">
                <ion-button color="danger" @click="cerrar"> <b>Cerrar</b> </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-segment :value="selectedSegment" @ionChange="segmentChanged($event)" mode="md">
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
                <ion-item lines="none">
                    <ion-label><b>NOTA</b></ion-label>
                </ion-item>
                <ion-textarea class="custom" :disabled="prioridadCondicion.VarStatus === undefined" :maxlength="225"
                    autocapitalize="on" inputmode="text" mode="ios" :rows="7" v-model.trim="nota.comentario"
                    label-placement="floating" placeholder="Ingrese Observaciones..." :counter="true"
                    :counter-formatter="customFormatter">
                    <div slot="label">Observaciones <ion-text :color="caracteresObs <= 175 ? 'danger' : 'primary'">{{
                        caracteresObs }}</ion-text></div>
                </ion-textarea>
                

                <ion-textarea class="custom" :disabled="prioridadCondicion.VarStatus === undefined" :maxlength="225"
                    autocapitalize="on" inputmode="text" mode="ios" :rows="7" v-model.trim="nota.recomendacion"
                    label-placement="floating" placeholder="Ingrese Recomendaciones..." :counter="true"
                    :counter-formatter="customFormatter">
                    <div slot="label">Recomendaciones <ion-text :color="caracteresRec <= 175 ? 'danger' : 'primary'">{{
                        caracteresRec }}</ion-text></div>
                </ion-textarea>
                

                <ButtonSubmit name="Registrar" />
            </ion-list>
        </form>
        <!-- HookCamara -->
        <ion-text color="primary">
            <h1 class="text-center">GALERIA DE IMAGENES</h1>
        </ion-text>
        <ion-grid v-if="photos.length">
            <ion-row>
                <ion-col size="4" v-for="photo in photos" :key="photo.filepath">
                    <ion-img :src="photo.webviewPath" @click="showActionSheet(photo)"></ion-img>
                </ion-col>
            </ion-row>
        </ion-grid>
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
                <ion-item lines="none">
                    <ion-label> <b>Cotización Escrita</b></ion-label>
                </ion-item>
                <ion-textarea class="custom" :disabled="cotizacion.TipoCotizacion === undefined" :maxlength="250" autocapitalize="on"
                    inputmode="text" mode="ios" :rows="8" placeholder="Ingrese nota de cotización..."
                    v-model.trim="cotizacion.NotaEscrita" label-placement="floating" :counter="true"
                    :counter-formatter="customFormatter">
                    <div slot="label">Cotización Escrita <ion-text
                            :color="caracteresCoti <= 175 ? 'danger' : 'primary'">{{ caracteresCoti }}</ion-text></div>
                </ion-textarea>
                <ButtonSubmit name="Registrar Cotización" />
            </ion-list>
        </form>
        <!-- HookCamara -->
        <ion-text color="primary">
            <h1 class="text-center">GALERIA DE IMAGENES</h1>
        </ion-text>
        <ion-grid v-if="photos.length">
            <ion-row>
                <ion-col size="4" v-for="photo in photos" :key="photo.filepath">
                    <ion-img :src="photo.webviewPath" @click="showActionSheet(photo)"></ion-img>
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-content>
    <ion-text class="advertencia" color="warning"><ion-icon :icon="warning"></ion-icon>
        <span class="mensage">Se procederá a registrar todas las imágenes disponibles.</span>
    </ion-text>


    <!-- Fin formulario Cotización -->
    <!-- Inicio Camara -->
    <TakePhoto @click="pickPhoto" />
    <Camera @click="takePhoto" />
</template>


<style scoped>
.advertencia {
    /* centrar */
    text-align: center;
}

.text-center {
    /* centrar */
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
    color: #FF4D00;
}

ion-grid {
    margin-top: 1rem;
    background-color: #09405a7c;
    border-radius: 10px;
}

ion-item {
    --background: #F4F5F8;
    --color: black;
}

.caracter {
    color: blue;
}

.caracterMin {
    color: red;
}


.fondoFormulario {
    background: #F4F5F8;
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
    color: #E4E2E1;
}

.addPhoto {
    --background: #5157AE;
    --border-radius: 20%;
}

.btn-add {
    margin-top: -0.7rem;
}

ion-content {
    --background: #F4F5F8;
}
</style>