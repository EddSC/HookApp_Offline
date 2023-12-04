<script setup lang="ts">
import {
    IonContent,
    IonLabel,
    IonText,
    IonItem,
    IonInput,
    IonRow,
    IonCol,
    IonGrid,
    IonCheckbox,
    IonButton,
} from '@ionic/vue';
import {  ref } from 'vue';
import { useRoute } from 'vue-router';
import { Electrico, TaskDetails } from '@/interfaces/mantenimientoInterface';
import { genUniqueId } from '@/helpers/uniqueId';
import { showToast } from '@/helpers/showToast';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { usePreventivoStore } from '@/stores/mPreventivoStore';
import { presentLoading, dismissLoading } from '@/helpers/loading';

const route = useRoute()
const preventivoStore = usePreventivoStore();
const { obtenerElemento, insertarElemento } = useStorage();
const ambienteTrabajo = ref(0 as any);

const electrico = ref({
    t1: 0,
    t2: 0,
    t3: 0,
    t4: 0,
    t5: 0,
    t6: 0,
    t7: 0,
    t8: 0,
    t9: 0,

    varcab: 0,
    armazon: 0,
    abierta: 0,
    aislada: 0,

    extremo: 0,
    centro: 0,
    carro: 0,

    encarro: 0,
    palaca: 0,
    joystick: 0,
    aireacond: 0,

    botonera: 0,
    pendiente: 0,
    ptefijo: 0,
    ptemensajero: 0,

    delcarro: 0,
    pulpito: 0,
    palanca: 0,
    joystick2: 0,

    silla: 0,
    infrarojo: 0,
    automatico: 0,
    radio: 0,

    poly: 0,
    resorte: 0,
    hyd: 0,
    goma: 0,

    polyCarro: 0,
    resorteCarro: 0,
    hydCarro: 0,
    gomaCarro: 0,

    no: 0,
    corta1: 0,
    corta2: 0,
    med2: 0,
    total: 0,
    pasamano: 0,

    bajo: 0,
    interp: 0,
    polvo: 0,
    gases: 0,
    hume: 0,

    areatrabajo: "",
    tecnico: 0,
    mant: 0,
} as Electrico);

let setElectrico: TaskDetails = {
    id: '',
    idTaskDetail: '',
    idMantenimiento: 0,
    idTitulo: 0,
    idOrden: 0,
    idItem: 0,
    tipo: 'Grúa Electrico',
    fechaHora: '',
    status: 'pending',
    electrico: electrico.value,
}

const limpiarForm = () => {
    electrico.value = {
        t1: 0,
        t2: 0,
        t3: 0,
        t4: 0,
        t5: 0,
        t6: 0,
        t7: 0,
        t8: 0,
        t9: 0,

        varcab: 0,
        armazon: 0,
        abierta: 0,
        aislada: 0,

        extremo: 0,
        centro: 0,
        carro: 0,

        encarro: 0,
        palaca: 0,
        joystick: 0,
        aireacond: 0,

        botonera: 0,
        pendiente: 0,
        ptefijo: 0,
        ptemensajero: 0,

        delcarro: 0,
        pulpito: 0,
        palanca: 0,
        joystick2: 0,

        silla: 0,
        infrarojo: 0,
        automatico: 0,
        radio: 0,

        poly: 0,
        resorte: 0,
        hyd: 0,
        goma: 0,

        polyCarro: 0,
        resorteCarro: 0,
        hydCarro: 0,
        gomaCarro: 0,

        no: 0,
        corta1: 0,
        corta2: 0,
        med2: 0,
        total: 0,
        pasamano: 0,

        bajo: 0,
        interp: 0,
        polvo: 0,
        gases: 0,
        hume: 0,

        areatrabajo: "",
        tecnico: 0,
        mant: 0,
    }

    setElectrico = {
        id: '',
        idTaskDetail: '',
        idMantenimiento: 0,
        idTitulo: 0,
        idOrden: 0,
        idItem: 0,
        tipo: 'Electrico',
        fechaHora: '',
        status: 'pending',
        electrico: electrico.value,
    }
}

const regElectrico = () => {

    electrico.value.tecnico = Number(route.params.user)
    electrico.value.mant = Number(route.params.id)
    electrico.value.t1 = electrico.value.t1 ? 1: 0
    electrico.value.t2 = electrico.value.t2 ? 1: 0
    electrico.value.t3 = electrico.value.t3 ? 1: 0
    electrico.value.t4 = electrico.value.t4 ? 1: 0
    electrico.value.t5 = electrico.value.t5 ? 1: 0
    electrico.value.t6 = electrico.value.t6 ? 1: 0
    electrico.value.t7 = electrico.value.t7 ? 1: 0
    electrico.value.t8 = electrico.value.t8 ? 1: 0
    electrico.value.t9 = electrico.value.t9 ? 1: 0

    electrico.value.varcab = electrico.value.varcab ? 1: 0
    electrico.value.armazon = electrico.value.armazon ? 1: 0
    electrico.value.abierta = electrico.value.abierta ? 1: 0
    electrico.value.aislada = electrico.value.aislada ? 1: 0

    electrico.value.extremo = electrico.value.extremo ? 1: 0
    electrico.value.centro = electrico.value.centro ? 1: 0
    electrico.value.carro = electrico.value.carro ? 1: 0

    electrico.value.encarro = electrico.value.encarro ? 1: 0
    electrico.value.palaca = electrico.value.palaca ? 1: 0
    electrico.value.joystick = electrico.value.joystick ? 1: 0
    electrico.value.aireacond = electrico.value.aireacond ? 1: 0

    electrico.value.botonera = electrico.value.botonera ? 1: 0
    electrico.value.pendiente = electrico.value.pendiente ? 1: 0
    electrico.value.ptefijo = electrico.value.ptefijo ? 1: 0
    electrico.value.ptemensajero = electrico.value.ptemensajero ? 1: 0

    electrico.value.delcarro = electrico.value.delcarro ? 1: 0
    electrico.value.pulpito = electrico.value.pulpito ? 1: 0
    electrico.value.palanca = electrico.value.palanca ? 1: 0
    electrico.value.joystick2 = electrico.value.joystick2 ? 1: 0

    electrico.value.silla = electrico.value.silla ? 1: 0
    electrico.value.infrarojo = electrico.value.infrarojo ? 1: 0
    electrico.value.automatico = electrico.value.automatico ? 1: 0
    electrico.value.radio = electrico.value.radio ? 1: 0

    electrico.value.poly = electrico.value.poly ? 1: 0
    electrico.value.resorte = electrico.value.resorte ? 1: 0
    electrico.value.hyd = electrico.value.hyd ? 1: 0
    electrico.value.goma = electrico.value.goma ? 1: 0

    electrico.value.polyCarro = electrico.value.polyCarro ? 1: 0
    electrico.value.resorteCarro = electrico.value.resorteCarro ? 1: 0
    electrico.value.hydCarro = electrico.value.hydCarro ? 1: 0
    electrico.value.gomaCarro = electrico.value.gomaCarro ? 1: 0

    electrico.value.no = electrico.value.no ? 1: 0
    electrico.value.corta1 = electrico.value.corta1 ? 1: 0
    electrico.value.corta2 = electrico.value.corta2 ? 1: 0
    electrico.value.med2 = electrico.value.med2 ? 1: 0
    electrico.value.total = electrico.value.total ? 1: 0
    electrico.value.pasamano = electrico.value.pasamano ? 1: 0

    electrico.value.bajo = electrico.value.bajo ? 1: 0
    electrico.value.interp = electrico.value.interp ? 1: 0
    electrico.value.polvo = electrico.value.polvo ? 1: 0
    electrico.value.gases = electrico.value.gases ? 1: 0
    electrico.value.hume = electrico.value.hume ? 1: 0

    const id = genUniqueId();
    setElectrico.id = id;
    setElectrico.idTaskDetail = id;
    setElectrico.idMantenimiento = Number(route.params.id);
    setElectrico.fechaHora = new Date().toLocaleString();
}



const electricoReg = async() => {
    try {
        await presentLoading('Registrando Electrico...')
    regElectrico();
    await insertarElemento(preventivoStore.nameStorage, setElectrico.id, setElectrico);
    await showToast('Registrado correctamente', 'success');
    limpiarForm();
    ambienteTrabajo.value = 0;
    } catch (error) {
        await showToast('Error al registrar', 'danger');
    }finally{
        await dismissLoading();
    }
    
}

</script>

<template>
    <ion-content class="ion-padding">
        <ion-label>
            <ion-text color="light">
                <h1>Electrico</h1>
            </ion-text>
        </ion-label>
        <form @submit.prevent="electricoReg" >
            <fieldset>
                <legend>Auto Manufactures</legend>
                <ion-grid>
                    <ion-row>
                        <ion-col size="12">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" name="240 Vac/3/60 Hz" v-model="electrico.t1">240 Vac/3/60 Hz</ion-checkbox>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" name="380 Vac/3/60 Hz" v-model="electrico.t2">380 Vac/3/60 Hz</ion-checkbox>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" name="440 Vac/3/60 Hz" v-model="electrico.t3">440 Vac/3/60 Hz</ion-checkbox>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" name="460 Vac/3/60 Hz" v-model="electrico.t4">460 Vac/3/60 Hz</ion-checkbox>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" name="480 Vac/3/60 Hz" v-model="electrico.t5">480 Vac/3/60 Hz</ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="12">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" name="24 V" v-model="electrico.t6">24 V</ion-checkbox>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" name="48 V" v-model="electrico.t7">48 V</ion-checkbox>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" name="110 V" v-model="electrico.t8">110 V</ion-checkbox>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" name="220 V" v-model="electrico.t9">220 V</ion-checkbox>
                            </ion-item>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </fieldset>

            <fieldset>
                <legend>Control desde</legend>
                <ion-grid>
                    <ion-row>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.varcab">Cab</ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.armazon">
                                    Armazon cab
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.abierta">
                                    Abierta
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.aislada">
                                    Aislada
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.extremo">
                                    Extremo
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.centro">
                                    Centro
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.carro">
                                    Carro
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.palaca">
                                    Palanca
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.joystick">
                                    Joystick
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.aireacond">
                                    Aire Acondicionado
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.botonera">
                                    Botonera
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.ptefijo">
                                    Puente Fijo
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.ptemensajero">
                                    Pte. Mensajero
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.radio">
                                    Radio Control
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </fieldset>
            <ion-label>
                <ion-text color="light">
                    <h1>Mecanico</h1>
                </ion-text>
            </ion-label>
            <fieldset>
                <legend>Amortiguadores</legend>
                <ion-grid fixed>
                    <ion-row>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.poly">
                                    Poly
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.resorte">
                                    Resorte
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.hyd">
                                    Hyd 100%
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.goma">
                                    Goma
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </fieldset>
            <fieldset>
                <legend>Amortiguadores Carro</legend>
                <ion-grid fixed>
                    <ion-row>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.polyCarro">
                                    Poly
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.resorteCarro">
                                    Resorte
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.hydCarro">
                                    Hyd 100%
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.gomaCarro">
                                    Goma
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </fieldset>
            <fieldset>
                <legend>Plataforma</legend>
                <ion-grid fixed>
                    <ion-row>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.no">
                                    No
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.corta1">
                                    1 Corta
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.corta2">
                                    2 Corta
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.med2">
                                    2 Med
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.total">
                                    Total
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.pasamano">
                                    1 Pasa Mano
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </fieldset>

            <fieldset>
                <legend>Ambiente de Trabajo</legend>
                <ion-grid fixed>
                    <ion-row>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.bajo">
                                    Bajo Techo
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.interp">
                                    Intemperie
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.polvo">
                                    Polvo
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.gases">
                                    Gases
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  labelPlacement="end" justify="start" v-model="electrico.hume">
                                    Humedad
                                </ion-checkbox>
                            </ion-item>
                        </ion-col>
                        <ion-col size="12">
                            <ion-item lines="none">
                                <ion-checkbox slot="start"  v-model="ambienteTrabajo" labelPlacement="end" justify="start">
                                    Otro
                                </ion-checkbox>
                            </ion-item>
                            <ion-item v-if="ambienteTrabajo">
                                <ion-input type="text" placeholder="Ingrese Dato"
                                    v-model.trim="electrico.areatrabajo" label="" ></ion-input>
                            </ion-item>
                        </ion-col>

                    </ion-row>
                </ion-grid>
            </fieldset>

            <ion-button type="submit" expand="block" fill="clear">
                Registrar Electrico
            </ion-button>
        </form>
    </ion-content>
</template>

<style scoped>


ion-checkbox {
    --background: white;
    --color: #003249;
    --border-color: #003249;

}

ion-item {
    --background: white;
    --color: #003249;
    font-weight: bold;
    font-size: 1.05rem;
}

ion-button {
    --background: #ff4d00;
    --color: white;
    --border-radius: 10px;
    margin-bottom: 30px;
}
fieldset{
    border: 1px solid #003249;
    border-radius: 10px;
    margin-bottom: 20px;
}
legend {
    color: #003249;
    font-size: large;
}

h1{
    text-align: center;
    font-weight: bold;
}
</style>