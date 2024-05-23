<script setup lang="ts">
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonText,
    modalController,
    actionSheetController,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonFab,
    IonFabButton,
    IonImg,
} from '@ionic/vue';
import { usePhotoGallery, UserPhoto } from '@/services/__mocks__/multimedia/photoGallery';
import { trash, close, images, camera } from "ionicons/icons";
import { onMounted, ref } from 'vue';
import { Image, TaskDetails } from '@/interfaces/mantenimientoInterface';
import { genUniqueId } from '@/helpers/uniqueId';
import { showToast } from '@/helpers/showToast';
import { useRoute } from 'vue-router';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { usePreventivoStore } from '@/stores/mPreventivoStore';
import { useAuthStore } from '@/stores/authStore';

const preventivoStore = usePreventivoStore();
const authStore = useAuthStore();
const route = useRoute()
const { obtenerElemento, insertarElemento, insertarDatos } = useStorage();
const { photos, takePhoto, deletePhoto, pickPhoto, base64Convert } = usePhotoGallery();
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

const take5 = ref([] as any)

const cerrar = () => {
    return modalController.dismiss(null, 'cerrar');
}

const image = ref({
    nombre: "",
    imagen: "",
    tipo: 0,
    mantenimiento: 0,
    tecnico: 0,
    // motivo: "4",
    // titulo: "1",
    // nota: 1,
} as Image)

let setImage: TaskDetails = {
    id: '',
    idTaskDetail: '',
    idMantenimiento: 0,
    idTitulo: 0,
    idOrden: 0,
    idItem: 0,
    tipo: 'Foto Take 5',
    fechaHora: '',
    status: 'pending',
    image: image.value,
}

const regFormImage = async () => {
    const photo = photos.value[0];
    if (!photo) return;
    const base64 = await base64Convert(photo.filepath, photo.webviewPath);
    image.value.nombre = photo.fileName;
    image.value.imagen = String(base64);
    image.value.mantenimiento = Number(route.params.id);
    image.value.tecnico = Number(authStore.authId);

    const id = genUniqueId();
    setImage.id = id;
    setImage.idTaskDetail = id;
    setImage.idMantenimiento = Number(route.params.id);
    setImage.fechaHora = new Date().toLocaleString();
}

const limpiarPhotos = () => {
    image.value = {
        nombre: '',
        imagen: '',
        tipo: 0,
        mantenimiento: 0,
        tecnico: 0,
    }

    setImage = {
        id: '',
        idTaskDetail: '',
        idMantenimiento: 0,
        idTitulo: 0,
        idOrden: 0,
        idItem: 0,
        tipo: 'Foto Take 5',
        fechaHora: '',
        status: 'pending',
        image: image.value,
    }
}

const enviarImage = async () => {
    try {
        await presentLoading('Registrando Open Take...');
        const id = route.params.id
        if (photos.value.length === 0) return showToast('No existe Foto', 'danger');
        await regFormImage();
        await insertarElemento(preventivoStore.nameStorage, setImage.id, setImage)
        take5.value = [...take5.value, id]
        await insertarDatos('Open', 'Takes', take5.value)
        if (photos.value.length > 0) {
            deletePhoto(photos.value[0]);
        }
        limpiarPhotos();
        await showToast('Foto registrado correctamente', 'success')
    } catch (error) {
        await showToast('Error al registrar foto', 'danger')
    } finally {
        await dismissLoading()
    }
}

onMounted(() => {
    obtenerElemento('Open', 'Takes').then((res: any) => {
        take5.value = res
    }).catch((err: any) => {
        console.log(err)
    })
})

</script>
<template>
    <ion-header>
        <ion-toolbar>
            <ion-title> Take 5 | {{ $route.params.id }} </ion-title>
            <ion-buttons slot="end">
                <ion-button color="danger" @click="cerrar"> <b>Cerrar</b> </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>

    <ion-content>
        <div class="textoTake5">
            <p class="color-uno">
                <ion-text>
                    “En casa te esperan, asegúrate de completar el take 5 antes de iniciar cualquier trabajo”
                </ion-text>
            </p>
            <p class="color-dos">
                <ion-text>
                    Recuerda que en Konecranes no hay ningún trabajo tan importante ni ningún servicio tan urgente que
                    nos
                    impida llevar a cabo nuestra tarea de la forma más segura y correcta.
                </ion-text>
            </p>
            <p class="color-tres">
                <ion-text>
                    Toma la fotografía del take 5 realizado como evidencia, para que puedas comenzar con tu trabajo de
                    forma segura.
                </ion-text>
            </p>
        </div>
        <ion-label class="ion-padding">
            <h1><b></b></h1>
        </ion-label>
        <ion-grid v-if="photos.length !== 0">
            <ion-row>
                <ion-col size="4" v-for="photo in photos" :key="photo.filepath">
                    <ion-img :src="photo.webviewPath" @click="showActionSheet(photo)"></ion-img>
                </ion-col>
            </ion-row>
        </ion-grid>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed" class="image-upload">
            <ion-fab-button id="takePhoto" @click="pickPhoto()" size="small">
                <ion-icon :icon="images"></ion-icon>
            </ion-fab-button>
        </ion-fab>
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button @click="takePhoto()">
                <ion-icon :icon="camera"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        <ion-button expand="block" fill="clear" :disabled="!photos.length" @click="enviarImage">
            Registrar Foto
        </ion-button>
    </ion-content>
</template>

<style scoped>
ion-content {
    --background: url("assets/images/take5.jpeg");
    background-size: cover;
}

ion-grid {
    backdrop-filter: blur(10px);
}

.textoTake5 {
    padding: 20px;
    width: 90%;
    margin: 0 auto;
    margin-top: 10%;
    border-radius: 10px;
    backdrop-filter: blur(10px);
    background-color: rgba(0, 0, 0, 0.5);
}

.color-uno {
    font-style: normal;
    font-size: 1.6rem;
    text-align: center;
    color: #ffffff;
    /* Color oscuro para contraste */
}

.color-dos {
    font-style: normal;
    font-size: 1.4rem;
    color: #ffffff;
    /* Color de texto más oscuro */
    width: 60%;
}

.color-tres {
    font-style: normal;
    font-size: 1.6rem;
    text-align: center;
    color: #ffffff;
    /* Color oscuro para contraste */
    margin-top: 10px;
    margin-bottom: 10px;
}

ion-toolbar {
    --background: #264354;
    --color: white;
}

.image-upload {
    margin-bottom: 4rem;
}

#takePhoto {
    --background: #AC44CF;
}

ion-label {
    color: black;
    text-align: center;
}

h1 {
    font-size: 1.5rem;
}

ion-button {
    --background: #005eff;
    --color: white;
    --border-radius: 10px;
    width: 80%;
    margin: 0 auto;
}</style>