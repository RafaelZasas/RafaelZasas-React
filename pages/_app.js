import '../styles/globals.css'
import '../styles/main.css';
import {Navbar} from '../components/Navbar'
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <main>
    <Navbar />
    <Component {...pageProps} />
      <Footer />
    </main>
  );
}

export default MyApp
