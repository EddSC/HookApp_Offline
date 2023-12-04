<script setup lang="ts">
import {
    actionSheetController,
    alertController,
    IonImg,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonCheckbox,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonIcon,
    IonList,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonContent,
} from '@ionic/vue';
import { closeCircle, trashSharp, trash, close } from 'ionicons/icons';
import { useRoute } from 'vue-router';
import { showToast } from '@/helpers/showToast';
import { onMounted, ref } from 'vue';
import { getInforme } from '@/services/__mocks__/preventivo/informe';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import HeaderBack from '@/common/HeaderBack.vue';

const route = useRoute();
const id = Number(route.params.id);
const images = import.meta.env.VITE_BASE_IMAGE as string;

const rporte = ref([] as any);

const btnPdfWeb = async () => {
    try {
        await presentLoading('Cargando...');
        const data = await getInforme(Number(route.params.id));
    if (data === null) {
        return showToast('Reporte no existe', 'danger', closeCircle)
    }
    rporte.value.push(data);
    } catch (error) {
        await showToast('Error al cargar el reporte', 'danger', closeCircle)
    }finally{
        await dismissLoading();
    }

}

const showActionSheet = async (id: string) => {
    const actionSheet = await actionSheetController.create({
        header: "Photos",
        buttons: [
            {
                text: "Delete",
                role: "destructive",
                icon: trash,
                handler: () => {
                    deletePhoto(id);
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
}

const deletePhoto = (id: string) => {
    console.log(id);
}

const alertDelete = async (id: string, item: string) => {
    const alert = await alertController.create({
        header: 'Alerta',
        subHeader: '¿Seguro que quieres eliminar este item?',
        message: item,
        buttons: [
            {
                text: 'Cancelar',
                role: 'cancel',
                handler: () => {
                    console.log('Alert canceled');
                },
            },
            {
                text: 'Eliminar',
                role: 'confirm',
                handler: () => {
                    deleteItem(id);
                },
            },
        ],
    });

    await alert.present();
};

const deleteItem = async (id: string) => {
    // await doDelete(taskDelete);
    console.log(id);
    console.log(rporte.value);
    rporte.value.forEach((element: any) => {
        element.titulos.forEach((titulo: any) => {
            titulo.items = titulo.items.filter((item: any) => {
                if (item.idPC === id) {
                    if(item.fotos.length > 0){
                        item.fotos.forEach((foto: any) => {
                            deletePhoto(foto.id);
                        });
                    }
                    if(item.nota){
                        deletePhoto(item.nota.id);
                    }
                }
                return item.idPC !== id;
            });
        });
    });
}

const alertObs = async (id: string, obs: string, tipo: string) => {
    const alert = await alertController.create({
        cssClass: 'textAreaAlert',
        buttons: [
            {
                text: 'Cancelar',
                role: 'cancel',
                handler: () => {
                    console.log('Alert canceled');
                },
            },
            {
                text: 'Editar',
                role: 'confirm',
                handler: (data) => {
                    const txtDato = data.obs
                    if(tipo === 'Observaciones'){
                        editObs(id, txtDato);
                        console.log(txtDato);
                    }
                    if(tipo === 'Recomendaciones'){
                        editRec(id, txtDato);
                        console.log(txtDato);
                    }
                },
            },
        ],
        inputs: [
            {
                name: 'obs',
                type: 'textarea',
                placeholder: tipo,
                value: obs,
                attributes: {
                    maxlength: 225,
                    required: true,
                
                },
            },
        ],
    });

    await alert.present();
};

const editObs = (id: string, data: string) => {
    rporte.value.forEach((element: any) => {
        element.titulos.forEach((titulo: any) => {
            titulo.items = titulo.items.filter((item: any) => {
                //Editar Observaciones con map
                // console.log(item.nota.id);
                if(item.nota){
                    if(item.nota.id === id){
                        console.log(item.nota.id);
                        item.nota.observaciones = data;
                    }
                }
                return item
            });
        });
    });
}


const editRec = (id: string, data: string) => {
    rporte.value.forEach((element: any) => {
        element.titulos.forEach((titulo: any) => {
            titulo.items = titulo.items.filter((item: any) => {
                //Editar Observaciones con map
                // console.log(item.nota.id);
                if(item.nota){
                    if(item.nota.id === id){
                        console.log(item.nota.id);
                        item.nota.recomendaciones = data;
                    }
                }
                return item
            });
        });
    });
}

onMounted(() => {
    btnPdfWeb();
});

</script>

<template>
    <HeaderBack titulo="Informa de Mantenimiento Preventivo" color="orange" :id="id" />
    <ion-content :fullscreen="true" color="white">
    <div class="ion-padding" v-for="rpt in rporte">
        <fieldset>
            <legend></legend>

            <div class="image-container" v-if="!rpt.portada">
                <ion-img class="portada" src="/assets/images/Service_Konecranes.jpg">
                </ion-img>
            </div>

            <div class="image-container" v-if="rpt.portada">
                <ion-img class="portada" :src="images + rpt.portada">
                </ion-img>
            </div>

            <ion-text color="dark-a" class="ion-text-center">
                <h1 class="negrita">INFORME DE MANTENIMIENTO {{ rpt.datos.Frecuencia }}</h1>
            </ion-text>
            <br>
            <ion-text color="dark-a" class="ion-text-center">
                <h1 class="negrita">{{ rpt.datos.Nombres }}</h1>
                <h1 class="negrita">TAG: {{ rpt.datos.Tag }}</h1>
                <h2 class="negrita">Area: {{ rpt.datos.Area }}</h2>
            </ion-text>
            <br>
            <ion-text color="dark-a" class="ion-text-center">
                <h2>N° REPORTE: {{ rpt.datos.numreporte }}</h2>
                <h2>REALIZADO POR: KONECRANES PERÚ S. R. L</h2>
                <h2>FECHA: {{ rpt.datos.Fecha }}</h2>
            </ion-text>
            <br>
        </fieldset>

        <fieldset>
            <legend>Datos Grua</legend>
            <div v-if="rpt.datosGrua">
                <ion-text color="primary" class="ion-text-center">
                    <h2 class="negrita">DATOS ESPECÍFICOS DEL EQUIPO DE LEVANTE</h2>
                </ion-text>
                <ion-text color="dark-a" class="ion-text-center">
                    <h4> <span class="negrita"> TAG / IDENTIFICACION DE GRUA:</span> <span>{{ rpt.datosGrua.Tag }}</span>
                    </h4>
                    <h4><span class="negrita">SERIE:</span> {{ rpt.datosGrua.Serie }} </h4>
                    <h4><span class="negrita">MARCA:</span> {{ rpt.datosGrua.Marca }} </h4>
                    <h4><span class="negrita">CAPACIDAD DE LEVANTE:</span> {{ rpt.datosGrua.CapLev }} </h4>
                    <h4><span class="negrita">AREA:</span> {{ rpt.datosGrua.Area }} </h4>
                </ion-text>
                <br>
                <ion-grid>
                    <ion-row>
                        <ion-col size="3">
                            <ion-item class="equipoLevante" lines="none">
                                <ion-checkbox labelPlacement="end" justify="start" name="Portal"
                                    :checked="rpt.datosGrua.Portal !== '0'">Portal</ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="3">
                            <ion-item class="equipoLevante" lines="none">
                                <ion-checkbox labelPlacement="end" justify="start" name="Semi Portal"
                                    :checked="rpt.datosGrua.SemiPortal !== '0'">Semi Portal</ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="3">
                            <ion-item class="equipoLevante" lines="none">
                                <ion-checkbox labelPlacement="end" justify="start" name="Una Viga"
                                    :checked="rpt.datosGrua.Monoviga !== '0'">Una Viga</ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="3">
                            <ion-item class="equipoLevante" lines="none">
                                <ion-checkbox labelPlacement="end" justify="start" name="Biviga"
                                    :checked="rpt.datosGrua.Biviga !== '0'">Biviga</ion-checkbox>
                            </ion-item>
                        </ion-col>

                        <ion-col size="3">
                            <ion-item class="equipoLevante" lines="none">
                                <ion-checkbox labelPlacement="end" justify="start" name="Un Carro"
                                    :checked="rpt.datosGrua.Carroi !== '0'">Un Carro</ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="3">
                            <ion-item class="equipoLevante" lines="none">
                                <ion-checkbox labelPlacement="end" justify="start" name="Dos Carro"
                                    :checked="rpt.datosGrua.Carroii !== '0'">Dos Carro</ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="3">
                            <ion-item class="equipoLevante" lines="none">
                                <ion-checkbox labelPlacement="end" justify="start" name="res Carro">Tres
                                    Carro</ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="3">
                            <ion-item class="equipoLevante" lines="none">
                                <ion-checkbox labelPlacement="end" justify="start" name="Monorriel Aux"
                                    :checked="rpt.datosGrua.MonorrielAux !== '0'">Monorriel Aux</ion-checkbox>
                            </ion-item>
                        </ion-col>

                        <ion-col size="3">
                            <ion-item class="equipoLevante" lines="none">
                                <ion-checkbox labelPlacement="end" justify="start" name="Monorriel"
                                    :checked="rpt.datosGrua.Monorriel !== '0'">Monorriel</ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="3">
                            <ion-item class="equipoLevante" lines="none">
                                <ion-checkbox labelPlacement="end" justify="start" name="Grua Jib"
                                    :checked="rpt.datosGrua.Jib !== '0'">Grua Jib</ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="4">
                            <ion-item class="equipoLevante" lines="none">
                                <ion-checkbox labelPlacement="end" justify="start" name="Grua Pedestal"
                                    :checked="rpt.datosGrua.Pedestal !== '0'">Grua Pedestal</ion-checkbox>
                            </ion-item>
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <br>
                <!-- inicio tabla de Equipo de Levante -->
                <table>
                    <tr>
                        <th scope="row" style="border: none; background-color: #EFF1F3;"></th>
                        <th>
                            <ion-text class="borderTable">
                                Cap. U.S Ton.
                            </ion-text>
                        </th>
                        <th>
                            <ion-text class="borderTable">
                                Altura levante Aproximada
                            </ion-text>
                        </th>
                    </tr>
                    <tr>
                        <th class="capacidaLevante">
                            <ion-text class="textAprox">
                                Main Hoist
                            </ion-text>
                        </th>
                        <td>
                            <ion-text class="itemInput ion-text-center" lines="none">
                                {{ rpt.datosGrua.capi }}
                            </ion-text>
                        </td>
                        <td>
                            <ion-text class="itemInput" lines="none">
                                {{ rpt.datosGrua.alti }}
                            </ion-text>
                        </td>
                    </tr>
                    <tr>
                        <th class="capacidaLevante">
                            <ion-text class="textAprox">
                                Aux. Hoist
                            </ion-text>
                        </th>
                        <td>
                            <ion-text class="itemInput" lines="none">
                                {{ rpt.datosGrua.capii }}
                            </ion-text>
                        </td>
                        <td>
                            <ion-text class="itemInput" lines="none">
                                {{ rpt.datosGrua.altii }}
                            </ion-text>
                        </td>
                    </tr>
                    <tr>
                        <th class="capacidaLevante">
                            <ion-text class="textAprox">
                                Main Hoist #2
                            </ion-text>
                        </th>
                        <td>
                            <ion-text class="itemInput" lines="none">
                                {{ rpt.datosGrua.capiii }}
                            </ion-text>
                        </td>
                        <td>
                            <ion-text class="itemInput" lines="none">
                                {{ rpt.datosGrua.altiii }}
                            </ion-text>
                        </td>
                    </tr>
                    <tr>
                        <th class="capacidaLevante">
                            <ion-text class="textAprox">
                                Aux. Hoist #2
                            </ion-text>
                        </th>
                        <td>
                            <ion-text class="itemInput" lines="none">
                                {{ rpt.datosGrua.capiv }}
                            </ion-text>
                        </td>
                        <td>
                            <ion-text class="itemInput" lines="none">
                                {{ rpt.datosGrua.altiv }}
                            </ion-text>
                        </td>
                    </tr>
                    <tr>
                        <th class="capacidaLevante">
                            <ion-text class="textAprox">
                                Mono Aux.
                            </ion-text>
                        </th>
                        <td>
                            <ion-text class="itemInput" lines="none">
                                {{ rpt.datosGrua.capv }}
                            </ion-text>
                        </td>
                        <td>
                            <ion-text class="itemInput" lines="none">
                                {{ rpt.datosGrua.altv }}
                            </ion-text>
                        </td>
                    </tr>
                </table>
                <!-- Fin tabla de Equipo de Levante -->
                <br>
                <ion-text>
                    <h5 class="negrita">DIMENSIONES APROXIMADAS:</h5>
                </ion-text>
                <table>
                    <tr>
                        <th>
                            <ion-text class="borderTable">
                                Recorrido Puente Grúa (Mts)
                            </ion-text>
                        </th>
                        <td>
                            <ion-text class="itemInput" lines="none">
                                {{ rpt.datosGrua.Recorrido }}
                            </ion-text>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <ion-text class="borderTable">
                                Luz Puente Grúa (Mts)
                            </ion-text>
                        </th>
                        <td>
                            <ion-text class="itemInput" lines="none">
                                {{ rpt.datosGrua.LuzPuente }}
                            </ion-text>
                        </td>
                        <th scope="row" style="border: none; background-color: #FFFFFF;"></th>
                    </tr>
                </table>
                <br>
            </div>
            <div v-if="rpt.datosElectrico">
                <fieldset>
                    <legend>Electrico:</legend>
                    <ion-item class="equipoLevante" lines="none">
                        <ion-checkbox labelPlacement="end" justify="start" name="240 Vac/3/60 Hz"
                            :checked="rpt.datosElectrico.t1 !== '0'">240 Vac/3/60 Hz
                        </ion-checkbox>
                    </ion-item>
                    <ion-item class="equipoLevante" lines="none">
                        <ion-checkbox labelPlacement="end" justify="start" name="380 Vac/3/60 Hz"
                            :checked="rpt.datosElectrico.t2 !== '0'">380 Vac/3/60 Hz
                        </ion-checkbox>
                    </ion-item>
                    <ion-item class="equipoLevante" lines="none">
                        <ion-checkbox labelPlacement="end" justify="start" name="440 Vac/3/60 Hz"
                            :checked="rpt.datosElectrico.t3 !== '0'">440 Vac/3/60 Hz
                        </ion-checkbox>
                    </ion-item>
                    <ion-item class="equipoLevante" lines="none">
                        <ion-checkbox labelPlacement="end" justify="start" name="460 Vac/3/60 Hz"
                            :checked="rpt.datosElectrico.t4 !== '0'">460 Vac/3/60 Hz
                        </ion-checkbox>
                    </ion-item>
                    <ion-item class="equipoLevante" lines="none">
                        <ion-checkbox labelPlacement="end" justify="start" name="480 Vac/3/60 Hz"
                            :checked="rpt.datosElectrico.t5 !== '0'">480 Vac/3/60 Hz
                        </ion-checkbox>
                    </ion-item>
                    <ion-item class="equipoLevante" lines="none">
                        <ion-checkbox labelPlacement="end" justify="start" name="24 V"
                            :checked="rpt.datosElectrico.t6 !== '0'">24 V
                        </ion-checkbox>
                    </ion-item>
                    <ion-item class="equipoLevante" lines="none">
                        <ion-checkbox labelPlacement="end" justify="start" name="48 V"
                            :checked="rpt.datosElectrico.t7 !== '0'">48 V
                        </ion-checkbox>
                    </ion-item>
                    <ion-item class="equipoLevante" lines="none">
                        <ion-checkbox labelPlacement="end" justify="start" name="110 V"
                            :checked="rpt.datosElectrico.t8 !== '0'">110 V
                        </ion-checkbox>
                    </ion-item>
                    <ion-item class="equipoLevante" lines="none">
                        <ion-checkbox labelPlacement="end" justify="start" name="220 V"
                            :checked="rpt.datosElectrico.t9 !== '0'">220 V
                        </ion-checkbox>
                    </ion-item>
                </fieldset>
                <fieldset>
                    <legend>Control desde:</legend>
                    <ion-grid>
                        <ion-row>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Cab"
                                        :checked="rpt.datosElectrico.cab !== '0'">Cab
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Armazón Cab"
                                        :checked="rpt.datosElectrico.armazon !== '0'">Armazón Cab
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4"></ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Abierta"
                                        :checked="rpt.datosElectrico.abierta !== '0'">Abierta
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Aislada"
                                        :checked="rpt.datosElectrico.aislada !== '0'">Aislada
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4"></ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Extremo"
                                        :checked="rpt.datosElectrico.extremo !== '0'">Extremo
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Centro"
                                        :checked="rpt.datosElectrico.centro !== '0'">Centro
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Carro"
                                        :checked="rpt.datosElectrico.carro !== '0'">Carro
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="En carro"
                                        :checked="rpt.datosElectrico.encarro !== '0'">En carro
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Palanca"
                                        :checked="rpt.datosElectrico.palaca !== '0'">Palanca
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4"></ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Joystick"
                                        :checked="rpt.datosElectrico.joystick !== '0'">Joystick
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="aire acondic."
                                        :checked="rpt.datosElectrico.aireacond !== '0'">aire acondic.
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4"></ion-col>
                            <ion-col size="12">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="BOTONERA INDEPENDIENTE"
                                        :checked="rpt.datosElectrico.botonera !== '0'">BOTONERA INDEPENDIENTE
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Pendiente"
                                        :checked="rpt.datosElectrico.pendiente !== '0'">Pendiente
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Fijo puente"
                                        :checked="rpt.datosElectrico.ptefijo !== '0'">Fijo puente
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Puente mensajero"
                                        :checked="rpt.datosElectrico.ptemensajero !== '0'">Puente mensajero
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Del carro"
                                        :checked="rpt.datosElectrico.delcarro !== '0'">Del carro
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="púlpito"
                                        :checked="rpt.datosElectrico.pulpito !== '0'">púlpito
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4"></ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Palanca"
                                        :checked="rpt.datosElectrico.palanca !== '0'">Palanca
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Joystick"
                                        :checked="rpt.datosElectrico.joystick2 !== '0'">Joystick
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4"></ion-col>
                            <ion-col size="12">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Silla"
                                        :checked="rpt.datosElectrico.silla !== '0'">Silla
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Infra rojo"
                                        :checked="rpt.datosElectrico.infrarojo !== '0'">Infra rojo
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Automático"
                                        :checked="rpt.datosElectrico.automatico !== '0'">Automático
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                            <ion-col size="4"></ion-col>
                            <ion-col size="6">
                                <ion-item class="equipoLevante" lines="none">
                                    <ion-checkbox labelPlacement="end" justify="start" name="Radio control"
                                        :checked="rpt.datosElectrico.radio !== '0'">Radio control
                                    </ion-checkbox>
                                </ion-item>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </fieldset>
                <fieldset>
                    <legend>MECANICO:</legend>
                    <fieldset>
                        <legend>Amortiguadores puente:</legend>
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox labelPlacement="end" justify="start" name="Poly"
                                :checked="rpt.datosElectrico.poly !== '0'">Poly
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="Resorte"
                                :checked="rpt.datosElectrico.resorte !== '0'">Resorte
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="Hyd 100%"
                                :checked="rpt.datosElectrico.hyd !== '0'">Hyd 100%
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="Goma"
                                :checked="rpt.datosElectrico.goma !== '0'">Goma
                            </ion-checkbox>
                        </ion-item>
                    </fieldset>
                    <fieldset>
                        <legend>Amortiguadores carro:</legend>
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox labelPlacement="end" justify="start" name="Poly"
                                :checked="rpt.datosElectrico.poly_carro !== '0'">Poly
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="Resorte"
                                :checked="rpt.datosElectrico.resorte_carro !== '0'">Resorte
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="Hyd 100%"
                                :checked="rpt.datosElectrico.hyd_carro !== '0'">Hyd 100%
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="Goma"
                                :checked="rpt.datosElectrico.goma_carro !== '0'">Goma
                            </ion-checkbox>
                        </ion-item>
                    </fieldset>
                    <fieldset>
                        <legend>Plataforma:</legend>
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox labelPlacement="end" justify="start" name="No"
                                :checked="rpt.datosElectrico.no !== '0'">No
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="1 Corta"
                                :checked="rpt.datosElectrico.corta1 !== '0'">1 Corta
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="2 Cortas"
                                :checked="rpt.datosElectrico.corta2 !== '0'">2 Cortas
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="2 Med"
                                :checked="rpt.datosElectrico.med2 !== '0'">2 Med
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="Total"
                                :checked="rpt.datosElectrico.total !== '0'">Total
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="1 Pasa mano"
                                :checked="rpt.datosElectrico.pasamano !== '0'">1 Pasa mano
                            </ion-checkbox>
                        </ion-item>
                    </fieldset>
                    <fieldset>
                        <legend>AMBIENTE DE TRABAJO:</legend>
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox labelPlacement="end" justify="start" name="Bajo Techo"
                                :checked="rpt.datosElectrico.bajo !== '0'">Bajo Techo
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="Intemperie"
                                :checked="rpt.datosElectrico.interp !== '0'">Intemperie
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="Polvo"
                                :checked="rpt.datosElectrico.polvo !== '0'">Polvo
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="Gases"
                                :checked="rpt.datosElectrico.gases !== '0'">Gases
                            </ion-checkbox>
                            <ion-checkbox labelPlacement="end" justify="start" name="Humedad"
                                :checked="rpt.datosElectrico.hume !== '0'">Humedad
                            </ion-checkbox>
                        </ion-item>
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox labelPlacement="end" justify="start" aria-label="dato Electrico">
                                {{ rpt.datosElectrico.areatrabajo }}
                            </ion-checkbox>
                        </ion-item>
                    </fieldset>
                </fieldset>
            </div>
        </fieldset>

        <fieldset>
            <legend></legend>
            <ion-text color="dark-a" class="ion-text-center">
                <h2>MANTENIMIENTO DE PUENTE GRUA</h2>
            </ion-text>

            <table>
                <tr>
                    <th class="wide-column">MANTENIMIENTO DE PUENTE GRUA</th>
                    <th class="rotate-text">PRIORIDAD</th>
                    <th class="rotate-text">CONDICIÓN</th>
                    <th class="rotate-text">ACCIONES</th>
                </tr>
                <tbody v-for="(titulos, index) in rpt.titulos">
                    <tr>
                        <td class="titulos" colspan="4">{{ index + 1 }}. {{ titulos.titulo }}</td>
                    </tr>
                    <tr v-for="(items, indexItem) in titulos.items">
                        <td class="wide-column tdItems"> <b>{{ index + 1 }}.{{ indexItem + 1 }}</b> {{ items.item }}</td>
                        <td class="priodadColor"
                            :class="{ 'priodad3': items.prioridad === '3', 'prioridad1': items.prioridad === '1', 'prioridad2': items.prioridad === '2' }">
                            {{ items.prioridad }}</td>
                        <td class="tdItems">{{ items.condicion }}</td>
                        <td><ion-icon @click="alertDelete(items.idPC, items.item)" size="large" color="danger"
                                :icon="trashSharp"></ion-icon></td>
                    </tr>
                </tbody>
            </table>

        </fieldset>
        <fieldset>
            <legend class="colorMantemiento">MANTENIMIENTO/INSPECCIÓN {{ rpt.datos.Frecuencia }}</legend>
            <div v-for="(titulos, index) in rpt.titulos">
                <div v-for="(items, indexItem) in titulos.items">
                    <ion-card class="" color="white" v-if="items.prioridad !== '0' && items.condicion !== '3'">
                        <ion-card-header>
                            <ion-card-title> <b>{{ index + 1 }}.{{ indexItem + 1 }}.- {{ titulos.titulo }}</b>
                            </ion-card-title>
                            <ion-card-subtitle>{{ items.item }}</ion-card-subtitle>
                        </ion-card-header>
                        <ion-list class="fondoTareas">
                            <ion-item-sliding>
                                <ion-item lines="none" class="ionItem">
                                    <ion-label class="ion-text-wrap"><b>Obervaciones:</b> {{ items.nota.observaciones
                                    }}</ion-label>
                                </ion-item>

                                <ion-item-options>
                                    <ion-item-option @click="alertObs(items.nota.id, items.nota.observaciones, 'Observaciones')">Editar</ion-item-option>
                                </ion-item-options>
                            </ion-item-sliding>

                            <ion-item-sliding>
                                <ion-item lines="none" class="ionItem">
                                    <ion-label class="ion-text-wrap"><b>Recomendaciones:</b> {{ items.nota.recomendaciones
                                    }}</ion-label>
                                </ion-item>

                                <ion-item-options>
                                    <ion-item-option @click="alertObs(items.nota.id, items.nota.recomendaciones, 'Recomendaciones')">Editar</ion-item-option>
                                </ion-item-options>
                            </ion-item-sliding>

                        </ion-list>

                        <ion-card-header>

                            <ion-row>
                                <ion-col size-md="6" size-sm="6" size-xs="12" v-for="image in items.fotos">
                                    <div class="image-anexo">
                                        <ion-img :src="images + image.img" alt=""
                                            @click="showActionSheet(image.id)"></ion-img>
                                    </div>
                                </ion-col>
                            </ion-row>

                        </ion-card-header>
                    </ion-card>
                </div>
            </div>
        </fieldset>

        <fieldset>
            <legend class="colorMantemiento">ANEXOS</legend>
            <div v-for="(anexo, index) in rpt.anexos">
                <!-- <ion-text color="dark-a">
                    <h5>{{ index + 1 }}. {{ anexo.notaEscrita }}</h5>
                </ion-text> -->
                <ion-item-sliding>
                    <ion-item lines="none" class="ionItem">
                        <ion-label class="ion-text-wrap"><h5>{{ index + 1 }}. {{ anexo.notaEscrita }}</h5></ion-label>
                    </ion-item>

                    <ion-item-options>
                        <ion-item-option color="danger">Eliminar</ion-item-option>
                        <ion-item-option>Editar</ion-item-option>
                    </ion-item-options>
                </ion-item-sliding>
                <ion-row>
                    <ion-col size-md="6" size-sm="6" size-xs="12" v-for="image in anexo.fotos">
                        <div class="image-anexo">
                            <ion-img :src="images + image.img" alt="" @click="showActionSheet(image.id)"></ion-img>
                        </div>
                    </ion-col>
                </ion-row>
            </div>
        </fieldset>


    </div>
</ion-content>
</template>


<style scoped>
.image-container {
    width: 100%;
    /* Opcional: Ajusta el ancho del contenedor según tus necesidades */
    height: 0;
    /* Inicialmente establecemos la altura en 0 */
    padding-bottom: 50%;
    /* Ajusta el valor para obtener la forma deseada (ejemplo: 140%) */
    position: relative;
    /* Necesario para posicionar la imagen de forma correcta */
}

.image-container ion-img {
    position: absolute;
    /* Posicionamos la imagen de forma absoluta dentro del contenedor */
    width: 100%;
    /* La imagen ocupará el 100% del ancho del contenedor */
    height: 100%;
    /* La imagen ocupará el 100% de la altura del contenedor */
    object-fit: fill;
    /* Ajusta la imagen para cubrir completamente el contenedor */
}

.image-anexo {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    position: relative;
}

.image-anexo ion-img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: fill;
}

fieldset {
    border: 1px solid #003249;
    border-radius: 10px;
    margin-bottom: 20px;
}

legend {
    color: #003249;
    font-size: large;
}

.negrita {
    font-weight: bold;
    color: #333333;
}

.equipoLevante {
    --background: white;
    --color: #003249;
    margin: -10px;
}

ion-checkbox {
    --background: white;
    --color: #003249;
    --border-color: #003249;
}

table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    text-align: center;
    padding: 8px;
    border: 2px solid #6b6b6b;
}

tr {
    background-color: #fefefe;
    display: table-row;
    /* Establece la visualización como fila de tabla */
    height: auto;
}

th {
    background-color: #303F9F;
    color: white;
    padding: 7px;
}

.input {
    --padding-start: 0px;
    --padding-end: 0px;
    --background: white;
    --color: #333333;
}

.itemInput {
    --background: white;
    color: #333333;
    font-weight: bold;
    font-size: 1.1rem;
}

.wide-column {
    width: 81%;
    /* Ajusta el valor según el ancho deseado */
}

.rotate-text {
    writing-mode: vertical-lr;
    transform: rotate(-180deg);
    white-space: nowrap;
}

.tdItems {
    text-align: left;
    padding-left: 10px;
    color: #333333;
}

.titulos {
    font-weight: bold;
    font-size: 1.1rem;
    padding-left: 10px;
    color: #333333;
}

.priodadColor {
    color: #ffffff;
    font-weight: bold;
    background-color: #333333;
}

.prioridad1 {
    background-color: #ff0000;
}

.prioridad2 {
    background-color: #0000FF;
}

.prioridad3 {
    background-color: #FFFF00;
    color: #333333;
}

.colorMantemiento {
    color: #FF0000;
    font-weight: bold;
    font-size: 1.1rem;
}

.ionItem {
    --background: #D9D9D9;
    --color: black;
}

.fondoTareas {
    background: #D9D9D9;
    padding-bottom: 10px;
}
</style>