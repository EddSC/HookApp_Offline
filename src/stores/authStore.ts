import { defineStore } from 'pinia'
import { LoginInterface } from '@/interfaces/loginInterface';
import { authenticate } from '@/services/__mocks__/auth/authenticate';
import { showToast } from '@/helpers/showToast';
import { presentLoading, dismissLoading } from '@/helpers/loading';
import { Preferences } from '@capacitor/preferences';
import { computed, ref } from 'vue';

interface AuthInterface {
    Status: string;
    idtuser: string;
    tcorreo: string;
    tnombres: string;
    tusertipo: string;
}

export const useAuthStore = defineStore('authStore', () => {

    // computed user
    const authData = ref({} as AuthInterface);

    const authCorreo = computed(() => authData.value.tcorreo);
    const authNombres = computed(() => authData.value.tnombres);
    const authId = computed(() => authData.value.idtuser);
    const isAuthenticated = computed(() => {
        return !!authData.value.idtuser
    });


    const signIn = async (dataLogin: LoginInterface) => {
        //validaciones
        if (!dataLogin.correo) {
            await showToast('Ingrese su correo', 'danger')
            return
        }
        if (!dataLogin.password) {
            await showToast('Ingrese su contraseña', 'danger')
            return
        }
        //llamada al servicio
        await presentLoading('Iniciando sesión...')
        const res = await authenticate(dataLogin)
        if (res) {
            await setAuth(res)
            await dismissLoading()
            await showToast(`Bienvenido ${res.tnombres.toUpperCase()}`, 'success')
            authData.value = res
            return res
        } else {
            await dismissLoading()
            await showToast('Credenciales incorrectas', 'danger')
        }
    }

    const signOut = () => {
        console.log('signOut');
    }

    const setAuth = async (data: any) => {
        await Preferences.set({
            key: 'auth',
            value: JSON.stringify(data)
        });
    }
    const checkAuth = async () => {
        const data = await Preferences.get({ key: 'auth' });
        if (data.value) {
            authData.value = JSON.parse(data.value)
        }
    };

    return {
        signIn,
        signOut,
        checkAuth,
        authData,
        authCorreo,
        authNombres,
        authId,
        isAuthenticated
    }
})