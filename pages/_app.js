import '../styles/globals.css'
import '../styles/main.css';
import {Navbar} from '../components/Navbar'
import Footer from "../components/Footer";
import {UserContext} from "../lib/context";
import {useUserData} from "../lib/hooks";
import {FirebaseTrackingProvider} from "../lib/FirebaseTrackingProvider";

function MyApp({Component, pageProps}) {

    const userData = useUserData();

    return (
        <UserContext.Provider
            value={userData}>
            <FirebaseTrackingProvider>
                <div className='flex flex-col min-h-screen
            bg-gradient-to-tl from-blue-100 md:from-blue-200 md:via-blue-100 to-white md:to-transparent'>
                    <Navbar/>
                    <main className='flex-grow'>
                        <Component {...pageProps} />
                    </main>
                    <Footer/>
                </div>
            </FirebaseTrackingProvider>
        </UserContext.Provider>
    );
}

export default MyApp
