import { Device } from '@capacitor/device';
import { isPlatform } from '@ionic/vue';

export const getDeviceInfo = async () => {
  const info = await Device.getInfo();
  return info;
};

export const isAndroid = () => {
  return isPlatform('android');
};



