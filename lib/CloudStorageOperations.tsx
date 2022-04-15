import {getDownloadURL, ref, uploadString} from 'firebase/storage';
import {storage} from './firebase';

export const GetImage = async (path: string) => {
  const gsReference = ref(storage, `gs://rafael-zasas.appspot.com/${path}`);

  try {
    let imageUrl = await getDownloadURL(gsReference);
    return imageUrl;
  } catch (error) {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        console.log('Image Not Found');
        // File doesn't exist
        break;
      case 'storage/unauthorized':
        console.log('Unauthorized');

        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        console.log('Cancelled');

        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        console.log('Unknown Error');

        break;
    }
    return '/notfound.png';
  }
};

export const uploadImage = async (path: string, image: string): Promise<string | null> => {
  const gsReference = ref(storage, `gs://rafael-zasas.appspot.com/${path}`);

  try {
    const uploadTask = await uploadString(gsReference, image, 'data_url');

    //than get the url
    const url = await getDownloadURL(uploadTask.ref);

    return url;
  } catch (error) {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        console.log('Image Not Found');
        // File doesn't exist
        return null;
      case 'storage/unauthorized':
        console.log('Unauthorized');

        // User doesn't have permission to access the object
        return null;
      case 'storage/canceled':
        console.log('Cancelled');

        // User canceled the upload
        return null;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        console.log('Unknown Error');

        return null;

      default:
        console.log('Unknown Error');
        return null;
    }
  }
};
