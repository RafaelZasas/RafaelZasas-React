import '../styles/globals.css';
import '../styles/main.css';
import {Navbar} from '../components/Navbar';
import Footer from '../components/Footer';
import {ToastContext, UserContext} from '../lib/context';
import {useToast, useUserData} from '../lib/hooks';
import {FirebaseTrackingProvider} from '../lib/FirebaseTrackingProvider';
import {Toast} from '../components/toast';
import {useEffect, useState} from 'react';
import {fetchFCMToken, onMessageListener} from '../lib/firebase';
import {isSupported} from 'firebase/messaging';

function MyApp({Component, pageProps}) {
  const userData = useUserData();
  const {showToast, setShowToast, toastData, setToastData} = useToast();
  const [browserIsSupported, setBrowserSupported] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const firebaseConfig = encodeURIComponent(
        JSON.stringify({
          apiKey: process.env.NEXT_PUBLIC_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
          databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_APP_ID,
          measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
        })
      );
      navigator.serviceWorker
        .register(`../public/firebase-messaging-sw.js?firebaseConfig=${firebaseConfig}`)
        .then(function (registration) {
          console.log('Registration successful, scope is:', registration.scope);
        })
        .catch(function (err) {
          console.log('Service worker registration failed, error:', err);
        });
    }
    isSupported().then((res) => {
      setBrowserSupported(res);
    });

    if (browserIsSupported && typeof window !== 'undefined') {
      fetchFCMToken(userData.userData);
      onMessageListener()
        .then((payload) => {
          setToastData({
            type: 'success',
            heading: payload.notification.title,
            body: payload.notification.body,
          });
          setShowToast(true);
        })
        .catch((err) => console.log('failed: ', err));
    } else {
      isSupported().then((res) => {
        console.log('browser supported:', res);
      });
      console.log('Window Type:', typeof window);
    }
  }, [browserIsSupported, setShowToast, setToastData]);

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
