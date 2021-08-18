import '../styles/globals.css'
import '../styles/main.css';
import {Navbar} from '../components/Navbar'
import Footer from "../components/Footer";
import {UserContext} from "../lib/context";

function MyApp({Component, pageProps}) {
    return (
        <UserContext.Provider
            value={{user:{}, username: 'raff'}}>
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
