<script setup lang="ts">
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    modalController,
    IonItem,
    IonLabel,
    IonToggle,
    IonTextarea,
    IonIcon
} from '@ionic/vue';
import { toggleOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { PruebasPreOperacionales, TaskDetails } from '@/interfaces/mantenimientoInterface';
import { genUniqueId } from '@/helpers/uniqueId';
import { showToast } from '@/helpers/showToast';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { usePreventivoStore } from '@/stores/mPreventivoStore';
import { useAuthStore } from '@/stores/authStore';
import { useStorage } from '@/services/__mocks__/sqlite/storage';

const cerrar = () => {
    return modalController.dismiss(null, 'cerrar');
}
const route = useRoute()
const preventivoStore = usePreventivoStore();
const authStore = useAuthStore();
const { insertarElemento } = useStorage();
const pruebasOperacionales = ref([
    {
        id: "1",
        nombre: "Movimiento Puente, carro e izaje en ambos sentidos",
        comentario: '',
        estado: true
    },
    {
        id: "2",
        nombre: "Operación de limites de Puente en ambos sentidos",
        comentario: '',
        estado: true
    },
    {
        id: "3",
        nombre: "Operaciones de limtes de Puente, carro e izaje en ambos sentidos",
        comentario: '',
        estado: true
    },
    {
        id: "4",
        nombre: "Correcto Frenado de Puente",
        comentario: '',
        estado: true
    },
    {
        id: "5",
        nombre: "La sirena y baliza funcionan correctamente",
        comentario: '',
        estado: true
    },
    {
        id: "6",
        nombre: "Funcionan todas la velocidades en los movimientos?",
        comentario: '',
        estado: true
    },
    {
        id: "7",
        nombre: "Ha preguntado al Operador de la grúa, si esta ha tenido problemas últimamente?",
        comentario: '',
        estado: true
    },
])

const filter_No = () => {
    return pruebasOperacionales.value.filter((e) => e.estado === false)
}
const filter_Si = () => {
    return pruebasOperacionales.value.filter((e) => e.estado === true)
}

const preOperacionales = ref({
    var_ppreope: '',
    var_status: 1,
    var_det: '',
    var_mant: 0,
    tecnico: 0
} as PruebasPreOperacionales)

let setPreOperacionales: TaskDetails = {
    id: '',
    idTaskDetail: '',
    idMantenimiento: 0,
    idTitulo: 0,
    idOrden: 0,
    idItem: 0,
    tipo: 'Pruebas Pre-Operacionales',
    fechaHora: '',
    status: 'pending',
    pruebasPreOperacionales: preOperacionales.value,
}

const limpiarForm = () => {
    preOperacionales.value = {
        var_ppreope: '',
        var_status: 1,
        var_det: '',
        var_mant: 0,
        tecnico: 0
    }

    setPreOperacionales = {
        id: '',
        idTaskDetail: '',
        idMantenimiento: 0,
        idTitulo: 0,
        idOrden: 0,
        idItem: 0,
        tipo: 'Pruebas Pre-Operacionales',
        fechaHora: '',
        status: 'pending',
        pruebasPreOperacionales: preOperacionales.value,
    }
}

const pruebasPreOperacionales = () => {
    const Si = filter_Si()
    const No = filter_No()
    const id = []
    const idN = []
    for (let i in Si) {
        id.push(Si[i].id)
    }
    for (let i in No) {
        idN.push(No[i].id + ':' + No[i].comentario + ' ')
    }
    preOperacionales.value.var_ppreope = id.toString().replace(/,/g, '')
    preOperacionales.value.var_det = idN.toString().replace(/,/g, '')
    preOperacionales.value.var_status = No.length === 0 ? 1 : 0
    preOperacionales.value.var_mant = Number(route.params.id)
    preOperacionales.value.tecnico = Number(authStore.authId)

    const id2 = genUniqueId();
    setPreOperacionales.id = id2;
    setPreOperacionales.idTaskDetail = id2;
    setPreOperacionales.idMantenimiento = Number(route.params.id);
    setPreOperacionales.fechaHora = new Date().toLocaleString();
}

const regPruebasOperacionales = async () => {
    try {
        await presentLoading('Registrando Pruebas Pre Operacionales...');
        pruebasPreOperacionales();
        await insertarElemento(preventivoStore.nameStorage, setPreOperacionales.id, setPreOperacionales);
        await showToast('Pruebas Pre Operacionales registrado correctamente', 'success');
        limpiarForm();
    } catch (error) {
        await showToast('Error al registrar Pruebas Pre Operacionales', 'danger');
    } finally {
        await dismissLoading();
    }
}


</script>
<template>
    <ion-header>
        <ion-toolbar color="light">
            <ion-title> Pruebas Pre Operacionales | {{ $route.params.idMantenimiento }} </ion-title>
            <ion-buttons slot="end">
                <ion-button color="danger" @click="cerrar"> <b>Cerrar</b> </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding container">
        <ion-item class="textFondo" lines="none">
            <ion-label class="ion-text-wrap">
                Antes de ejecutar cualquier servicio, realice pruebas operacionales para comprobar
                que la grúa este en buen estado. Desactivar el switch
                <ion-icon :icon="toggleOutline" color="primary"></ion-icon>
                si detecta alguna anomalía o falla y describir el problema. <br>
                <span class="importante">Importante:</span> Si detecta algun problema del equipo en las pruebas
                preoperacionales, debe informar inmediatamente al cliente antes de ingresar a intervenir el equipo. Esta
                comunicacion debe ser por correo hacia el cliente para dejar registro. Luego de que el cliente confirme la
                recepcion de esta informacion, el personal puede ingresar y continuar los trabajos.
            </ion-label>
        </ion-item>
        <ion-item class="descipcion" lines="none" v-for=" pruebas in pruebasOperacionales" :key="pruebas.id">
            <ion-toggle :checked="pruebas.estado" v-model="pruebas.estado">
                {{ pruebas.nombre }}
            </ion-toggle>
            <div v-if="pruebas.estado === false">
                <ion-label position="stacked"> Caracteres Max | </ion-label>
                <ion-textarea label-placement="floating" :counter="true" label="Descripción" :maxlength="225" autocapitalize="on" inputmode="text" mode="ios" :rows="5" :cols="100"
                    placeholder="Escriba porque razon no aplica" v-model.trim="pruebas.comentario">
                </ion-textarea>
            </div>
        </ion-item>
        <ion-item class="textFondos" lines="none">
        </ion-item>

        <ion-button @click="regPruebasOperacionales()" expand="block" fill="clear" shape="round">
            Registrar
        </ion-button>
    </ion-content>
</template>

<style scoped>
.textFondo {
    --background: #C7CDC4;
    --color: black;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.textFondos {
    --background: #C7CDC4;
    --color: black;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

.ppOperacionales {
    --background: #C7CDC4;
    --color: black;
    --padding-start: 0;
}

.descipcion {
    --background: #D9D9D9;
    --color: black;
}

ion-content {
    --background: #EFF1F3;
}

ion-button {
    --background: #ff4d00;
    --color: white;
    --border-radius: 10px;
}

ion-icon {
    /* aumentar de tamaño el icono */
    font-size: 1.5rem;
    /* centrar el icono en linea */
    vertical-align: middle;
}

.importante {
    font-weight: bold;
    color: red;
}
</style>