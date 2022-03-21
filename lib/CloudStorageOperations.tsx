import {getDownloadURL, ref} from 'firebase/storage';
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
