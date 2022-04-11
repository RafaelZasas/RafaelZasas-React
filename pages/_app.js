import '../styles/globals.css';
import '../styles/main.css';
import {Navbar} from '../components/Navbar';
import Footer from '../components/Footer';
import {ToastContext, UserContext} from '../lib/context';
import {useToast, useUserData} from '../lib/hooks';
import {FirebaseTrackingProvider} from '../lib/FirebaseTrackingProvider';
import {Toast} from '../components/toast';
import {useState} from 'react';
import {fetchFCMToken, onMessageListener} from '../lib/firebase';
import {isSupported} from 'firebase/messaging';

function MyApp({Component, pageProps}) {
  const userData = useUserData();
  const {showToast, setShowToast, toastData, setToastData} = useToast();
  const [browserIsSupported, setBrowserSupported] = useState(false);
  const [isTokenFound, setTokenFound] = useState(false);
  isSupported().then((res) => {
    setBrowserSupported(res);
  });
  if (browserIsSupported && typeof window !== 'undefined') {
    fetchFCMToken(setTokenFound);
    onMessageListener()
      .then((payload) => {
        setToastData({
          type: 'success',
          heading: 'Success',
          body: 'baby we done it',
        });
        setShowToast(true);
        console.log(payload);
      })
      .catch((err) => console.log('failed: ', err));
  } else {
    isSupported().then((res) => {
      console.log('browser supported:', res);
    });
    console.log('Window Type:', typeof window);
  }

  const onShowNotificationClicked = () => {
    setNotification({title: 'Notification', body: 'This is a test notification'});
    setShow(true);
  };

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
