import '../styles/globals.css';
import '../styles/main.css';
import {Navbar} from '../components/Navbar';
import Footer from '../components/Footer';
import {ToastContext, UserContext} from '../lib/context';
import {useToast, useUserData} from '../lib/hooks';
import {FirebaseTrackingProvider} from '../lib/FirebaseTrackingProvider';
import {Toast} from '../components/toast';
import {onMessage} from 'firebase/messaging';
import {firebaseApp} from '../lib/firebase';

function MyApp({Component, pageProps}) {
  const userData = useUserData();
  const {showToast, setShowToast, toastData, setToastData} = useToast();

  if (typeof window !== 'undefined' && !!firebaseApp) {
    // FCM Init
    const messaging = getMessaging(firebaseApp);
    getToken(messaging, {vapidKey: process.env.NEXT_PUBLIC_FCM_KEY})
      .then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // ...
          console.log('Got Token for FCM');
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
  }

  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    setToastData({
      heading: 'Message Recieved',
      body: 'FCM message recieved',
      type: 'success',
    });
    setShowToast(true);
    // ...
  });

  return (
    <UserContext.Provider value={userData}>
      <FirebaseTrackingProvider>
        <ToastContext.Provider value={{showToast, setShowToast, toastData, setToastData}}>
          <div
            className="flex min-h-screen flex-col
            bg-gradient-to-tl from-blue-100 to-white md:from-blue-200 md:via-blue-100 md:to-transparent"
          >
            <Navbar />
            <main className="flex-grow">
              <Component {...pageProps} userProps={userData} />
            </main>
            <Footer />
          </div>
        </ToastContext.Provider>
      </FirebaseTrackingProvider>
      <Toast setShow={setShowToast} toastData={toastData} show={showToast} />
    </UserContext.Provider>
  );
}

export default MyApp;
