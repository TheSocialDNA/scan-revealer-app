import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export const captureImage = async (): Promise<string | null> => {
  // إذا كان على الويب، استخدم input file العادي
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    if (photo.base64String) {
      return `data:image/${photo.format};base64,${photo.base64String}`;
    }

    return null;
  } catch (error) {
    console.error('Error capturing image:', error);
    throw error;
  }
};

export const selectImage = async (): Promise<string | null> => {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });

    if (photo.base64String) {
      return `data:image/${photo.format};base64,${photo.base64String}`;
    }

    return null;
  } catch (error) {
    console.error('Error selecting image:', error);
    throw error;
  }
};
