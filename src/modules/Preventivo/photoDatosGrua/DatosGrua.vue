<script setup lang="ts">
import {
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
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { DatosGrua, TaskDetails } from '@/interfaces/mantenimientoInterface';
import { genUniqueId } from '@/helpers/uniqueId';
import { showToast } from '@/helpers/showToast';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { useStorage } from '@/services/__mocks__/sqlite/storage';
import { useAuthStore } from '@/stores/authStore';
import { usePreventivoStore } from '@/stores/mPreventivoStore';

const route = useRoute()
const authStore = useAuthStore();
const { obtenerElemento, insertarElemento } = useStorage();
const preventivoStore = usePreventivoStore();

type datoPortal = {
    portal: boolean
    semiportal: boolean
    monoviga: boolean
    biviga: boolean
    carroi: boolean
    carroii: boolean
    monorielaux: boolean
    monorriel: boolean
    jib: boolean
    pedestal: boolean
}

const datosGruas = ref({} as datoPortal)

const datosGrua = ref({
    tecnico: 0,
    mant: 0,

    serie: "",
    marca: "",
    tag: "",
    capLe: "",
    area: "",

    portal: 0,
    semiportal: 0,
    monoviga: 0,
    biviga: 0,
    carroi: 0,
    carroii: 0,
    monorielaux: 0,
    monorriel: 0,
    jib: 0,
    pedestal: 0,

    capi: "",
    capii: "",
    capiii: "",
    capiv: "",
    capv: "",

    alti: "",
    altii: "",
    altiii: "",
    altiv: "",
    altv: "",

    recorrido: "",
    luzpuente: ""
} as DatosGrua)

let setDatoGrua: TaskDetails = {
    id: '',
    idTaskDetail: '',
    idMantenimiento: 0,
    idTitulo: 0,
    idOrden: 0,
    idItem: 0,
    tipo: 'Datos de Grua',
    fechaHora: '',
    status: 'pending',
    datosGrua: datosGrua.value,
}

const limpiarForm = () => {
    datosGrua.value = {
        tecnico: 0,
        mant: 0,

        serie: "",
        marca: "",
        tag: "",
        capLe: "",
        area: "",

        portal: 0,
        semiportal: 0,
        monoviga: 0,
        biviga: 0,
        carroi: 0,
        carroii: 0,
        monorielaux: 0,
        monorriel: 0,
        jib: 0,
        pedestal: 0,

        capi: "",
        capii: "",
        capiii: "",
        capiv: "",
        capv: "",

        alti: "",
        altii: "",
        altiii: "",
        altiv: "",
        altv: "",

        recorrido: "",
        luzpuente: ""
    }

    setDatoGrua = {
        id: '',
        idTaskDetail: '',
        idMantenimiento: 0,
        idTitulo: 0,
        idOrden: 0,
        idItem: 0,
        tipo: 'Datos de Grúa',
        fechaHora: '',
        status: 'pending',
        datosGrua: datosGrua.value,
    }
}


const regDatoGrua = () => {
    datosGrua.value.tecnico = Number(route.params.user)
    datosGrua.value.mant = Number(route.params.id)
    datosGrua.value.portal = datosGruas.value.portal ? 1 : 0
    datosGrua.value.semiportal = datosGruas.value.semiportal ? 1 : 0
    datosGrua.value.monoviga = datosGruas.value.monoviga ? 1 : 0
    datosGrua.value.biviga = datosGruas.value.biviga ? 1 : 0
    datosGrua.value.carroi = datosGruas.value.carroi ? 1 : 0
    datosGrua.value.carroii = datosGruas.value.carroii ? 1 : 0
    datosGrua.value.monorielaux = datosGruas.value.monorielaux ? 1 : 0
    datosGrua.value.monorriel = datosGruas.value.monorriel ? 1 : 0
    datosGrua.value.jib = datosGruas.value.jib ? 1 : 0
    datosGrua.value.pedestal = datosGruas.value.pedestal ? 1 : 0
    datosGrua.value.alti = datosGrua.value.alti !== '' ? Number(datosGrua.value.alti) : 0
    datosGrua.value.altii = datosGrua.value.altii !== '' ? Number(datosGrua.value.altii) : 0
    datosGrua.value.altiii = datosGrua.value.altiii !== '' ? Number(datosGrua.value.altiii) : 0
    datosGrua.value.altiv = datosGrua.value.altiv !== '' ? Number(datosGrua.value.altiv) : 0
    datosGrua.value.altv = datosGrua.value.altv !== '' ? Number(datosGrua.value.altv) : 0

    const id = genUniqueId()
    setDatoGrua.id = id
    setDatoGrua.idTaskDetail = id
    setDatoGrua.idMantenimiento = Number(route.params.id)
    setDatoGrua.fechaHora = new Date().toLocaleString()
}


const submitFrmdatoGrua = async () => {
    try {
        await presentLoading('Registrando datos de la grua...');

        if (datosGrua.value.serie === "" || datosGrua.value.marca === "" || datosGrua.value.tag === "" || datosGrua.value.capLe === "" || datosGrua.value.area === "") {
            await showToast('Todos los campos son obligatorios', 'danger');
            return;
        }
        regDatoGrua();
        await insertarElemento(preventivoStore.nameStorage, setDatoGrua.id, setDatoGrua);
        limpiarForm();
        datosGruas.value = {} as datoPortal
        await showToast('Registrado correctamente', 'success');
    } catch (error) {
        await showToast('Error al registrar', 'danger');
    } finally {
        await dismissLoading();
    }
}

const isNumber = (evt: any) => {
    let charCode = (evt.which) ? evt.which : evt.keyCode;
    if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
        evt.preventDefault();
    } else {
        return true;
    }
}

const obtenerDatosMantenimiento = async () => {
    const dbData = await obtenerElemento('mPreventivo', String(authStore.authId));
    const mPreventivo = dbData.find((objeto: any) => objeto.idMantenimiento === String(route.params.id));
    datosGrua.value.marca = mPreventivo.Marcas;
    datosGrua.value.tag = mPreventivo.TagGrua;
    datosGrua.value.capLe = mPreventivo.Capacidad;
    datosGrua.value.area = mPreventivo.Area;
}

onMounted(() => {
    obtenerDatosMantenimiento()
})


</script>

<template>
    <ion-label>
        <ion-text color="light">
            <h1>Especificaciones Para Equipo de Levante</h1>
        </ion-text>
    </ion-label>
    <form @submit.prevent="submitFrmdatoGrua">
        <fieldset>
            <legend>Dato datosGrua</legend>
            <ion-item color="darkgreen">
                <ion-input label="Serie:" labelPlacement="floating" v-model.trim="datosGrua.serie" :clear-input="true"
                    placeholder="Serie"></ion-input>
            </ion-item>
            <ion-item color="darkgreen">
                <ion-input label="Marca:" labelPlacement="floating" v-model.trim="datosGrua.marca" :clear-input="true"
                    color="darkgreen" placeholder="Marca"></ion-input>
            </ion-item>
            <ion-item color="darkgreen">
                <ion-input label="Tag:" labelPlacement="floating" v-model.trim="datosGrua.tag" :clear-input="true"
                    color="darkgreen" placeholder="Tag"></ion-input>
            </ion-item>
            <ion-item color="darkgreen">
                <ion-input label="Cap de Levante:" labelPlacement="floating" v-model.trim="datosGrua.capLe"
                    :clear-input="true" :maxlength="10" color="darkgreen" placeholder="Cap de Levante"></ion-input>
            </ion-item>
            <ion-item color="darkgreen">
                <ion-input label="Area:" labelPlacement="floating" v-model.trim="datosGrua.area" :clear-input="true"
                    color="darkgreen" placeholder="Area"></ion-input>
            </ion-item>
        </fieldset>
        <fieldset>
            <legend>Equipo de Levante</legend>
            <ion-grid>
                <ion-row>
                    <ion-col size="6">
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox slot="start"  labelPlacement="end" justify="start" name="Portal"
                                v-model="datosGruas.portal">Portal</ion-checkbox>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox slot="start"  labelPlacement="end" justify="start" name="Semi Portal"
                                v-model="datosGruas.semiportal">
                                Semi Portal
                            </ion-checkbox>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox slot="start"  labelPlacement="end" justify="start" value="Mono Viga"
                                v-model="datosGruas.monoviga">
                                Mono Viga
                            </ion-checkbox>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox slot="start"  labelPlacement="end" justify="start" value="Biviga" v-model="datosGruas.biviga">
                                Biviga
                            </ion-checkbox>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox slot="start" 
                                :disabled="!datosGruas.portal && !datosGruas.semiportal && !datosGruas.monoviga && !datosGruas.biviga"
                                labelPlacement="end" justify="start" value="Carro 1" v-model="datosGruas.carroi">
                                Carro 1
                            </ion-checkbox>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox slot="start" 
                                :disabled="!datosGruas.portal && !datosGruas.semiportal && !datosGruas.monoviga && !datosGruas.biviga"
                                labelPlacement="end" justify="start" value="Carro 2" v-model="datosGruas.carroii">
                                Carro 2
                            </ion-checkbox>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox slot="start" 
                                :disabled="!datosGruas.portal && !datosGruas.semiportal && !datosGruas.monoviga && !datosGruas.biviga"
                                labelPlacement="end" justify="start" value="Monorriel Aux" v-model="datosGruas.monorielaux">
                                Monorriel Aux
                            </ion-checkbox>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox slot="start"  labelPlacement="end" justify="start" value="Monorriel"
                                v-model="datosGruas.monorriel">
                                Monorriel
                            </ion-checkbox>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox slot="start"  labelPlacement="end" justify="start" value="Grúa Jib" v-model="datosGruas.jib">
                                Grúa Jib
                            </ion-checkbox>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item class="equipoLevante" lines="none">
                            <ion-checkbox slot="start"  labelPlacement="end" justify="start" value="Grúa Pedestal"
                                v-model="datosGruas.pedestal">
                                Grúa Pedestal
                            </ion-checkbox>
                        </ion-item>
                    </ion-col>
                </ion-row>
            </ion-grid>

            <!-- inicio tabla de Equipo de Levante -->
            <table>
                <tr>
                    <th scope="row" style="border: none; background-color: #EFF1F3;"></th>
                    <th>
                        <ion-text class="borderTable">
                            MH1
                        </ion-text>
                    </th>
                    <th>
                        <ion-text class="borderTable">
                            AH1
                        </ion-text>
                    </th>
                    <th>
                        <ion-text class="borderTable">
                            MH2
                        </ion-text>
                    </th>
                    <th>
                        <ion-text class="borderTable">
                            AH2
                        </ion-text>
                    </th>
                    <th>
                        <ion-text class="borderTable">
                            Mon Aux
                        </ion-text>
                    </th>
                </tr>
                <tr>
                    <th class="capacidaLevante">
                        <ion-text class="textAprox">
                            Cap U.S Ton
                        </ion-text>
                    </th>
                    <td>
                        <ion-item class="itemInput" lines="none">
                            <ion-input label="" type="number" step="0.001" inputmode="decimal" class="input"
                                v-model="datosGrua.capi" placeholder="0.0">
                            </ion-input>
                        </ion-item>
                    </td>
                    <td>
                        <ion-item class="itemInput" lines="none">
                            <ion-input label="" type="number" step="0.001" inputmode="decimal" class="input"
                                v-model="datosGrua.capii" placeholder="0.0">
                            </ion-input>
                        </ion-item>
                    </td>
                    <td>
                        <ion-item class="itemInput" lines="none">
                            <ion-input label="" type="number" step="0.001" inputmode="decimal" class="input"
                                v-model="datosGrua.capiii" placeholder="0.0">
                            </ion-input>
                        </ion-item>
                    </td>
                    <td>
                        <ion-item class="itemInput" lines="none">
                            <ion-input label="" type="number" step="0.001" inputmode="decimal" class="input"
                                v-model="datosGrua.capiv" placeholder="0.0">
                            </ion-input>
                        </ion-item>
                    </td>
                    <td>
                        <ion-item class="itemInput" lines="none">
                            <ion-input label="" type="number" step="0.001" inputmode="decimal" class="input"
                                v-model="datosGrua.capv" placeholder="0.0">
                            </ion-input>
                        </ion-item>
                    </td>
                </tr>
                <tr>
                    <th class="capacidaLevante">
                        <ion-text class="textAprox">
                            Altura Levante
                            Aprox (Mts)
                        </ion-text>
                    </th>
                    <td>
                        <ion-item class="itemInput" lines="none">
                            <ion-input label="" type="number" class="input" v-on:keypress="isNumber($event)"
                                v-model="datosGrua.alti" placeholder="0">
                            </ion-input>
                        </ion-item>
                    </td>
                    <td>
                        <ion-item class="itemInput" lines="none">
                            <ion-input label="" type="number" class="input" v-on:keypress="isNumber($event)"
                                v-model="datosGrua.altii" placeholder="0">
                            </ion-input>
                        </ion-item>
                    </td>
                    <td>
                        <ion-item class="itemInput" lines="none">
                            <ion-input label="" type="number" class="input" v-on:keypress="isNumber($event)"
                                v-model="datosGrua.altiii" placeholder="0">
                            </ion-input>
                        </ion-item>
                    </td>
                    <td>
                        <ion-item class="itemInput" lines="none">
                            <ion-input label="" type="number" class="input" v-on:keypress="isNumber($event)"
                                v-model="datosGrua.altiv" placeholder="0">
                            </ion-input>
                        </ion-item>
                    </td>
                    <td>
                        <ion-item class="itemInput" lines="none">
                            <ion-input label="" type="number" class="input" v-on:keypress="isNumber($event)"
                                v-model="datosGrua.altv" placeholder="0">
                            </ion-input>
                        </ion-item>
                    </td>
                </tr>
            </table>
            <!-- Fin tabla de Equipo de Levante -->

        </fieldset>

        <fieldset>
            <legend>Dimensiones Aproximadas</legend>
            <ion-item class="equipoLevante">
                <ion-input label="Recorrido Puente Grúa (Mts)" labelPlacement="floating" inputmode="decimal"
                    v-model="datosGrua.recorrido"></ion-input>
            </ion-item>
            <ion-item class="equipoLevante">
                <ion-input label="Luz Puente Grúa (Mts)" labelPlacement="floating" inputmode="decimal"
                    v-model="datosGrua.luzpuente"></ion-input>
            </ion-item>
        </fieldset>

        <ion-button type="submit" expand="block" fill="clear">
            Registrar Datos de la Grua
        </ion-button>
    </form>
</template>


<style scoped>
ion-button {
    --background: #ff4d00;
    --color: white;
    --border-radius: 10px;
    margin-bottom: 60px;
}

.datodatosGrua {
    --background: white;
    --color: #E76507;
}

.equipoLevante {
    --background: white;
    --color: #003249;
}

ion-checkbox {
    --background: white;
    --color: #003249;
    --border-color: #003249;

}

/* spacing */

table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    text-align: center;
    padding: 8px;
    border: 2px solid #F2F2F2;
}

tr {
    background-color: #fefefe;
}

th {
    background-color: #E2E2E2;
    color: white;
    padding: 7px;
}

.capacidaLevante {
    text-align: left;
    padding: 0px 8px;
    color: #1B4353;
}

.borderTable {
    text-align: center;
    color: #1B4353;
}

.textAprox {
    color: #1B4353;
}

.input {
    --padding-start: 0px;
    --padding-end: 0px;
    --background: white;
    --color: #333333;
}

.itemInput {
    --background: white;
    --color: #333333;
    font-weight: bold;
    font-size: 1.1rem;
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

h1 {
    text-align: center;
    font-weight: bold;
}
</style>