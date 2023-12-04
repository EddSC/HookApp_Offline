<script setup lang="ts">
import {
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonTextarea,
    actionSheetController,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonText,
    IonIcon
} from '@ionic/vue';
import LabelTitle from '@/common/LabelTitle.vue';
import ButtonSubmit from '@/common/ButtonSubmit.vue';
import { TaskDetails, Image, TrabajoRealizado } from '@/interfaces/mantenimientoInterface';
import { computed, ref } from 'vue';
import { usePhotoGallery, UserPhoto } from '@/services/__mocks__/multimedia/photoGallery';
import { close, trash, warning } from 'ionicons/icons';
import Camera from '@/common/Camera.vue';
import TakePhoto from '@/common/takePhoto.vue';
import { showToast } from '@/helpers/showToast';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { genUniqueId } from '@/helpers/uniqueId';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { usePreventivoStore } from '@/stores/mPreventivoStore';


const props = defineProps<{
    titulo: string;
    sgmt: string,
}>()

const route = useRoute();
const authStore = useAuthStore();
const { insertarElemento } = useStorage();
const preventivoStore = usePreventivoStore();
const { photos, takePhoto, deletePhoto, pickPhoto, base64Convert } = usePhotoGallery();

const setTaskDetail = ref({} as TaskDetails);
const image = ref({} as Image);
const trabajoRealizado = ref({} as TrabajoRealizado);

const idMantenimiento = Number(route.params.id);
const IdWorkDone = ref()

const customFormatter = (inputLength: number, maxLength: number) => {
    return `${maxLength - inputLength} caracteres restantes`;
}
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
const caracteres = computed(() => {
    return trabajoRealizado.value.NotaEscrita !== undefined ? 225 - trabajoRealizado.value.NotaEscrita.length : 225;
})

const setTaskDetails = async () => {
    const uniqueId = genUniqueId();
    setTaskDetail.value.id = uniqueId;
    setTaskDetail.value.idTaskDetail = uniqueId;
    setTaskDetail.value.idMantenimiento = idMantenimiento;
    setTaskDetail.value.idTitulo = 0;
    setTaskDetail.value.idOrden = 0;
    setTaskDetail.value.idItem = 0;
    setTaskDetail.value.fechaHora = new Date().toLocaleString();
    setTaskDetail.value.status = 'pending';
}
const regFormImage = (filepath: string, base64: string) => {
    image.value.nombre = filepath;
    image.value.imagen = base64;
    image.value.tipo = Number(props.sgmt);
    image.value.mantenimiento = idMantenimiento;
    image.value.tecnico = Number(authStore.authId);
    image.value.IdWorkDone = IdWorkDone.value;

    setTaskDetails();
    setTaskDetail.value.tipo = 'Foto Trabajos Realizados';
    setTaskDetail.value.imageDone = image.value;
}

const regFormTrabajoRealizado = () => {
    trabajoRealizado.value.IdWorkDone = IdWorkDone.value;
    trabajoRealizado.value.idMant = idMantenimiento
    trabajoRealizado.value.idUser = Number(authStore.authId)

    setTaskDetails();
    setTaskDetail.value.tipo = 'Trabajos Realizados';
    setTaskDetail.value.trabajoRealizado = trabajoRealizado.value;
}
const registrarFoto = async () => {
    for (const photo of photos.value) {
        const base64 = await base64Convert(photo.filepath, photo.webviewPath);
        regFormImage(photo.filepath, String(base64));
        await insertarElemento(preventivoStore.nameStorage, setTaskDetail.value.id, setTaskDetail.value);
        setTaskDetail.value = {} as TaskDetails;
        image.value = {} as Image;

        await deletePhoto(photo);

        if(photos.value.length === 0) {
            IdWorkDone.value = '';
        }
    }
}
const submitTrabajoRealizado = async() => {
    try {
        await presentLoading('Registrando Trabajo Realizado...');
        IdWorkDone.value = Date.now();
        if(trabajoRealizado.value.NotaEscrita === '') return await showToast('Debe ingresar una descripción', 'danger');
        if(photos.value.length === 0) return await showToast('Debe ingresar al menos una foto', 'danger');
        regFormTrabajoRealizado();
        await insertarElemento(preventivoStore.nameStorage, setTaskDetail.value.id, setTaskDetail.value);
        setTaskDetail.value = {} as TaskDetails;
        trabajoRealizado.value = {} as TrabajoRealizado;
        await registrarFoto();
    } catch (error) {
        await showToast('Error al registrar', 'danger');
    } finally {
        await dismissLoading();
    }
}
</script>

<template>
    <LabelTitle :titulo="titulo" />
    <ion-content class="ion-padding">
        <form @submit.prevent="submitTrabajoRealizado">
            <ion-list class="fondoFormulario">
                <ion-item lines="none">
                    <ion-label><b>{{ titulo }}</b></ion-label>
                </ion-item>
                <ion-textarea class="custom" mode="md" :maxlength="225" autocapitalize="on" inputmode="text" :rows="7"
                    v-model.trim="trabajoRealizado.NotaEscrita" label-placement="floating"
                    placeholder="Ingrese Descripción..." :counter="true" :counter-formatter="customFormatter">
                    <div slot="label">Descripción <ion-text :color="caracteres <= 175 ? 'danger' : 'primary'">{{
                        caracteres }}</ion-text></div>
                </ion-textarea>
                <ButtonSubmit name="Registrar Trabajo Realizado" :disabled="trabajoRealizado.NotaEscrita === undefined" />
            </ion-list>
        </form>
        <LabelTitle class="galeria" titulo="GALERIA DE IMAGENES" />
        <ion-grid v-if="photos.length">
            <ion-row>
                <ion-col size="4" v-for="photo in photos" :key="photo.filepath">
                    <ion-img :src="photo.webviewPath" @click="showActionSheet(photo)"></ion-img>
                </ion-col>
            </ion-row>
        </ion-grid>
        <ion-text class="advertencia" color="danger"><ion-icon :icon="warning"></ion-icon>
            <span class="mensage">Se procederá a registrar todas las imágenes disponibles en Galeria.</span>
        </ion-text>
    </ion-content>
    <TakePhoto @click="pickPhoto" />
    <Camera @click="takePhoto" />
</template>

<style scoped>
ion-content {
    --background: #f4f4f4;
}

.fondoFormulario {
    background: #F4F4F4;
}

ion-item {
    --background: #F4F4F4;
    --color: black;
}

.galeria {
    font-size: 1.2rem;
    font-weight: bold;
    color: #FF4D00;
}

ion-grid {
    margin-top: 1rem;
    margin-bottom: 1rem;
    background-color: #09405a7c;
    border-radius: 10px;
}

.advertencia {
    text-align: center;
    font-size: 1.2rem;
}</style>