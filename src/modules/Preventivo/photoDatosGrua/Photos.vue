<script setup lang="ts">
import {
    actionSheetController,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonLabel,
    IonButton,
    IonContent,
} from '@ionic/vue';
import { usePhotoGallery, UserPhoto } from '../../../services/__mocks__/multimedia/photoGallery';
import { trash, close } from "ionicons/icons";
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Image, TaskDetails } from "../../../interfaces/mantenimientoInterface";
import { genUniqueId } from '../../../helpers/uniqueId';
import { showToast } from '../../../helpers/showToast';
import Camera from '../../../common/Camera.vue';
import TakePhoto from '../../../common/takePhoto.vue';
import { useStorage } from '../../../services/__mocks__/sqlite/storage';
import { usePreventivoStore } from '@/stores/mPreventivoStore';
import { presentLoading, dismissLoading } from '@/helpers/loading';

const { insertarElemento } = useStorage();
const store = usePreventivoStore();
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

const route = useRoute()
const props = defineProps<{
    titulo: string;
    sgmt: string,
}>()

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

let setImage:TaskDetails = {
    id: '',
    idTaskDetail: '',
    idMantenimiento: 0,
    idTitulo: 0,
    idOrden: 0,
    idItem: 0,
    tipo: props.titulo,
    fechaHora: '',
    status: 'pending',
    image: image.value,
}
const regFormImage = async() => {
    const photo = photos.value[0];
    if (!photo) return;
    const base64 = await base64Convert(photo.filepath, photo.webviewPath);
    image.value.nombre = photo.fileName;
    image.value.imagen = String(base64);
    image.value.tipo = Number(props.sgmt);
    image.value.mantenimiento = Number(route.params.id);
    image.value.tecnico = Number(route.params.user);

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
        tipo: props.titulo,
        fechaHora: '',
        status: 'pending',
        image: image.value,
    }
}

const enviarImage = async () => {
    try {
        await presentLoading('Registrando Foto...');
    if (photos.value.length === 0) {
        return showToast('No existe Foto ', 'danger');
    }
    if (photos.value.length > 0) {
        await regFormImage();
        await insertarElemento(store.nameStorage, setImage.id, setImage)
    }
    if (photos.value.length > 0) {
        deletePhoto(photos.value[0]);
    }
    
    limpiarPhotos();
    await showToast('Foto registrado correctamente', 'success')
    } catch (error) {
        await showToast('Error al registrar Foto', 'danger')
    }finally{
        await dismissLoading();
    }
}

</script>

<template>
    <ion-label class="ion-padding ion-label">
        <h1><b>{{ titulo }}</b></h1>
    </ion-label>

    <ion-grid>
        <ion-row>
            <ion-col size="4" v-for="photo in photos" :key="photo.fileName">
                <ion-img :src="photo.webviewPath" @click="showActionSheet(photo)"></ion-img>
            </ion-col>
        </ion-row>
    </ion-grid>

    <TakePhoto @click="pickPhoto"/>
    <Camera @click="takePhoto"/>

    <ion-button expand="block" fill="clear" :disabled="!photos.length" @click="enviarImage()">
        Registrar Foto
    </ion-button>

    <ion-content class="ion-padding"  v-if="props.sgmt === '6'">
        <ion-label class="BasedeDatos">
            <h1 class="titulo">Tomar la imagen en forma Horizontal</h1>
            <dl>
                En esta sección usted puede incluir fotografias de todos los documentos 
                que complementan al Servicio Ejecutivo tales como:

                <dd>- Inform diario de Servicios</dd>
                <dd>- Documento de autorización de Ingreso a área (Cliente o Konecranes).</dd>
                <dd>- Otros Documentos entregados por el Cliente o generados por Konecranes</dd>
            </dl>
            
            
        </ion-label>
    </ion-content>


    <ion-content  class="ion-padding" v-if="props.sgmt === '4'">
        <ion-label class="BasedeDatos">
        <h1 class="titulo">Base de Datos (Fotográfica) de equipos intervenidos por Primera vez.</h1>
        <p>
            El área de servicios comenzara a generar una base de datos de todos los equipos que intervenga en adelante.
            La idea de esta base de datos es disponer de información importante de las grúas que intervengamos, con el fin de
            hacer uso futuro para próximos servicios, planificación, cotizaciones de mejoras o repuestos según corresponda.
            Si accedemos a un equipo que no se encuentre en la base de datos, se debe proceder de acuerdo con lo siguiente:
        </p>
        <p>
            El líder o supervisor debe organizar al personal técnico a su cargo para que proceda a tomar las fotografías del
            equipo que se menciona mas abajo, esto no debe demorar más allá de 40 minutos, solo se desarrolla una vez por grúa.
            Si hay una segunda intervención en ese equipo en una próxima oportunidad, ya no es necesario volver a tomar estas
            fotografías.
        </p>
        <p>
            Fotografías Generales del Equipo:
            La persona encargada de estas fotografías debe asegurar que se muestre el equipo a la distancia, en el área en donde
            este opera directamente. Se debe observar la nave, techumbre si posee. Si el equipo se encuentra dentro de un lugar
            cerrado, se debe incorporar algunas fotografías de la parte exterior del edificio.
        </p>
        <p>
            Fotografías especificas por zona
            La persona encargada de estas fotografías debe tomar fotografías por ejemplo desde debajo de la grúa, mostrando la
            zona inferior del equipo, también una fotografía a la zona donde está instalada la electrificación de la grúa. Sobre
            la grúa mostrando la zona de plataforma, vista general del carro, accesos a la grúa, vigas, entre otros.
        </p>
        <p>
            Fotografías específicas de componentes
            La o las personas encargadas de estas fotografías deben tomar dos fotos por componentes, una al componente en si y
            otra a su placa si la posee. Se debe abarcar la mayor cantidad de componentes posibles del equipo, con el fin de
            disponer de esta información en la base de dato del equipo. Algunos de estos componentes pueden ser: Motores,
            reductores, frenos, variadores, radio controles, emisores, ganchos, contactores, control pro, etc.
        </p>
        <p>
            Nota: Si por cualquier motivo el cliente que se este visitando no autoriza tomar fotografías de los equipos, el
            personal debera tomar los datos de placas y números de series del equipo y sus componentes.
        </p>
    </ion-label>
    </ion-content>


</template>


<style scoped>
.image-upload {
    margin-bottom: 4rem;
}

#takePhoto {
    --background: #AC44CF;
}

.ion-label {
    color: black;
    text-align: center;
}

h1 {
    font-size: 1.5rem;
}

ion-button {
    --background: #ff4d00;
    --color: white;
    --border-radius: 10px;
    width: 80%;
    margin: 0 auto;
}
.titulo{
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 30px;
    color: #FA6A02;
}
.BasedeDatos {
    font-family: Arial, Helvetica, sans-serif;
    color: black;
}
p {
    font-size: 1.2rem;
    margin: 10px;
    color: black;
    text-align: justify

}
dl {
    font-size: 1.2rem;
    color: black;
}
dd {
    color: black;
    font-size: 1.2rem;
    font-weight: 600;
    margin: 10px;
}
ion-content {
    --background: #f4f5f8;
}
</style>