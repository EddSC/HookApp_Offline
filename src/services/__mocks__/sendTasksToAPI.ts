import { makeRequestPost } from './http';
import { TaskDetails } from '@/interfaces/mantenimientoInterface';
import { inicializarDB, updateActividad } from '@/services/__mocks__/sqlite/storage';
import { useSynchronize } from '@/stores/synchronize';
import { onMounted } from 'vue';

interface ObjetoParams {
    api: string;
    dato: TaskDetails | null;
    response: string;
    id: string;
}

const synStore = useSynchronize();

export const syncronizeTasks = () => {

    enum ApiRoutes {
        prioridadCondicion = '/v3/rcaseii',
        noAplica = '/v3/update_itemtitulo_apl',
        nota = '/v3/rcaseiiivii',
        image = '/v3/guardar_ii',
        cotizacion = '/v3/savecotii',
        audio = '/v3/audio_viiii',
        datosGrua = '/v3/r_dg_general',
        electrico = '/v3/r_dg_electrico',
        trabajoRealizado = '/v3/donejobs',
        imageDone = '/v3/guardar_w_done',
        pruebasPreOperacionales = '/v3/r_tb_ppreope',
        tomaParametro = '/v3/rparam',
        messageEmail = '/api/sendemail',
        correctivoObs = '/api/correctivoObs',
        notaObs = '/api/notaObservaciones',
    }


    const MAX_CONCURRENT_REQUESTS = 2;

    const enviarObjetos = async (objetos: ObjetoParams[]): Promise<void> => {
        const requests: Promise<void>[] = [];
        for (const objeto of objetos) {

            if (requests.length >= MAX_CONCURRENT_REQUESTS) {
                await Promise.race(requests);
                requests.splice(requests.findIndex((p: any) => p.status === 'pending'), 1);
            }
            const requestPromise = makeRequestPost(objeto.api, objeto.dato).then(async (response: any) => {
                if (response) {
                    const res = await updateActividad('gruas', objeto.id);
                    if (res) {
                        await synStore.procesarEstado(objeto.id)
                    }
                }
            });
            requests.push(requestPromise);

        }
        await Promise.all(requests);

    }

    const mapTaskToParams = (task: any): ObjetoParams => {
        const params: ObjetoParams = {
            api: '',
            dato: null,
            response: '',
            id: task.id,
        };

        switch (true) {
            case task.prioridadCondicion !== undefined:
                params.api = ApiRoutes.prioridadCondicion;
                params.dato = task.prioridadCondicion;
                break;
            case task.noAplica !== undefined:
                params.api = ApiRoutes.noAplica;
                params.dato = task.noAplica;
                break;
            case task.nota !== undefined:
                params.api = ApiRoutes.nota;
                params.dato = task.nota;
                break;
            case task.image !== undefined:
                params.api = ApiRoutes.image;
                params.dato = task.image;
                break;
            case task.cotizacion !== undefined:
                params.api = ApiRoutes.cotizacion;
                params.dato = task.cotizacion;
                break;
            case task.audio !== undefined:
                params.api = ApiRoutes.audio;
                params.dato = task.audio;
                break;
            case task.datosGrua !== undefined:
                params.api = ApiRoutes.datosGrua;
                params.dato = task.datosGrua;
                break;
            case task.electrico !== undefined:
                params.api = ApiRoutes.electrico;
                params.dato = task.electrico;
                break;
            case task.trabajoRealizado !== undefined:
                params.api = ApiRoutes.trabajoRealizado;
                params.dato = task.trabajoRealizado;
                break;
            case task.imageDone !== undefined:
                params.api = ApiRoutes.imageDone;
                params.dato = task.imageDone;
                break;
            case task.pruebasPreOperacionales !== undefined:
                params.api = ApiRoutes.pruebasPreOperacionales;
                params.dato = task.pruebasPreOperacionales;
                break;
            case task.tomaParametro !== undefined:
                params.api = ApiRoutes.tomaParametro;
                params.dato = task.tomaParametro;
                break;
            case task.messageEmail !== undefined:
                params.api = ApiRoutes.messageEmail;
                params.dato = task.messageEmail;
                break;
            case task.correctivoObs !== undefined:
                params.api = ApiRoutes.correctivoObs;
                params.dato = task.correctivoObs;
                break;
            case task.notaObs !== undefined:
                params.api = ApiRoutes.notaObs;
                params.dato = task.notaObs;
                break;
            default:
                break;
        }

        return params;
    }

    const procesarEstado = async (data: TaskDetails[]) => {
        if (data.length === 0) return;
        const objetos: ObjetoParams[] = data.map(mapTaskToParams);
        await enviarObjetos(objetos);
    };

    onMounted(async () => {
        await inicializarDB();
    });

    return {
        procesarEstado,
    }
}