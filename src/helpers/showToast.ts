import { toastController } from '@ionic/vue';

export const showToast = async (msg: string, color: string, icono?: string) => {
    const toast = await toastController.create({
        message: msg,
        icon: icono,
        cssClass: 'normal',
        color: color,
        position: 'bottom',
        positionAnchor: 'tabs',
        duration: 2000
    });
    await toast.present();
}