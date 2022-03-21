import '../styles/globals.css';
import '../styles/main.css';
import {Navbar} from '../components/Navbar';
import Footer from '../components/Footer';
import {UserContext} from '../lib/context';
import {useUserData} from '../lib/hooks';
import {FirebaseTrackingProvider} from '../lib/FirebaseTrackingProvider';

function MyApp({Component, pageProps}) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <FirebaseTrackingProvider>
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
      </FirebaseTrackingProvider>
    </UserContext.Provider>
  );
}

export default MyApp;
