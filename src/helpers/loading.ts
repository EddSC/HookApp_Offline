import { loadingController } from '@ionic/vue';

export const presentLoading = async (msg?: string) => {
    const loading = await loadingController.create({
        cssClass: 'normal',
        message: msg,
    });
    await loading.present();
}

export const dismissLoading = async () => {
    await loadingController.dismiss();
}