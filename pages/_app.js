import '../styles/globals.css'
import '../styles/main.css';
import {Navbar} from '../components/Navbar'
import Footer from "../components/Footer";
import {UserContext} from "../lib/context";
import {useUserData} from "../lib/hooks";

function MyApp({Component, pageProps}) {

    const userData = useUserData();

    return (
        <UserContext.Provider
            value={userData}>
            <div className='flex flex-col min-h-screen'>
                <Navbar/>
                <main className='flex-grow' >
                    <Component {...pageProps} />
                </main>
                <Footer/>
            </div>
        </UserContext.Provider>
    );
}

export default MyApp
