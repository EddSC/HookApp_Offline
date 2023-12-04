import { defineStore } from 'pinia'
import { LoginInterface } from '@/interfaces/loginInterface';
import { authenticate } from '@/services/__mocks__/auth/authenticate';
import { showToast } from '@/helpers/showToast';
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
    const authStatus = computed(() => authData.value.Status);
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
        const res = await authenticate(dataLogin)
        if (res) {
            await setAuth(res)
            await showToast(`Bienvenido ${res.tnombres.toUpperCase()}`, 'success')
            authData.value = res
            return res
        } else {
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
        authStatus,
        authData,
        authCorreo,
        authNombres,
        authId,
        isAuthenticated
    }
})