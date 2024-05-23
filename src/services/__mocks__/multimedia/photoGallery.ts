import { ref, onMounted, watch } from 'vue';
import { Capacitor } from '@capacitor/core';
import {
    Camera,
    CameraSource,
    CameraResultType,
    Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { isPlatform } from '@ionic/vue';
import { Storage, Drivers } from '@ionic/storage';

export interface UserPhoto {
    fileName: string;
    filepath: string;
    webviewPath?: string;
}

const db = new Storage({
    name: '__mydb',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
});

export const usePhotoGallery = () => {
    const PHOTO_STORAGE = 'multimedia_photos';
    const photos = ref<UserPhoto[]>([]);
  
    const convertBlobToBase64 = (blob: Blob): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      });
  
    const cachePhotos = async () => {
        await db.set(PHOTO_STORAGE, JSON.stringify(photos.value));
    };
  
    const loadSaved = async () => {
      const photoList = await db.get(PHOTO_STORAGE);
      const photosInPreferences = photoList ? JSON.parse(photoList) : [];
  
      // If running on the web...
      if (!isPlatform('hybrid')) {
        for (const photo of photosInPreferences) {
          const file = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data,
          });
          // Web platform only: Load the photo as base64 data
          photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        }
      }
  
      photos.value = photosInPreferences;
    };

    const base64Convert = async (photo:string|undefined, web:string|undefined) => {
      let base64Data: string | Blob = '';
      // "hybrid" will detect mobile - iOS or Android
      if (isPlatform('hybrid')) {
        const file = await Filesystem.readFile({
          path: photo!,
        });
        base64Data = file.data;
      } else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(web!);
        const blob = await response.blob();
        const base64String  = await convertBlobToBase64(blob);
        const base64Parts = base64String.split(';base64,');
        if (base64Parts.length === 2) {
          base64Data = base64Parts[1]; // Toma solo la parte codificada en base64
        } else {
          // Si la cadena no tiene el formato esperado, maneja el error o la cadena incorrecta aquí
          console.error('Formato de cadena base64 no válido');
        }
      }
      return base64Data;
    }
  
    const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
      let base64Data: string | Blob;
      // "hybrid" will detect mobile - iOS or Android
      if (isPlatform('hybrid')) {
        const file = await Filesystem.readFile({
          path: photo.path!,
        });
        base64Data = file.data;
      } else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();
        base64Data = (await convertBlobToBase64(blob));
      }

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
      });
  
      if (isPlatform('hybrid')) {
        // Display the new image by rewriting the 'file://' path to HTTP
        // Details: https://ionicframework.com/docs/building/webview#file-protocol
        return {
          fileName: fileName,
          filepath: savedFile.uri,
          webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        };
      } else {
        // Use webPath to display the new image instead of base64 since it's
        // already loaded into memory
        return {
          fileName: fileName,
          filepath: fileName,
          webviewPath: photo.webPath,
        };
      }
    };
  
    const deletePhoto = async (photo: UserPhoto) => {
      // Remove this photo from the Photos reference data array
      photos.value = photos.value.filter((p) => p.filepath !== photo.filepath);
  
      // delete photo file from filesystem
      const filename = photo.filepath.substring(photo.filepath.lastIndexOf('/') + 1);
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data,
      });
    };
  
    const takePhoto = async () => {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        promptLabelPicture: 'Tomar Foto',
        promptLabelPhoto: 'Selecione Foto',
        allowEditing: true,
        saveToGallery: true,
        correctOrientation: true,
        quality: 95,
      });
  
      const fileName = 'Cam' + new Date().getTime() + '.jpeg';
      const savedFileImage = await savePicture(photo, fileName);
      photos.value = [savedFileImage, ...photos.value];
    };

    //pick a photo from the gallery
    const pickPhoto = async () => {
        const cameraPhoto = await Camera.getPhoto({
            source: CameraSource.Photos,
            resultType: CameraResultType.Uri,
            correctOrientation: true,
            quality: 95,
        });
        const fileName = 'Gam' + new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(cameraPhoto, fileName);
        photos.value = [savedFileImage, ...photos.value];
    };
  
    onMounted(async () => {
        await db.create();
        await loadSaved();
    });
    watch(photos, cachePhotos);
  
    return {
      photos,
      deletePhoto,
      takePhoto,
      pickPhoto,
      base64Convert,
    };
  };