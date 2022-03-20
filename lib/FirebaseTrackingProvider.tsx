import {createContext, useState, useEffect, ReactNode} from 'react';
import {useRouter} from 'next/router';
import {firebaseApp} from './firebase';
import {getAnalytics, logEvent, setAnalyticsCollectionEnabled, setCurrentScreen} from 'firebase/analytics';

export const FirebaseContext = createContext(null);

export const FirebaseTrackingProvider = (props: {children: ReactNode}) => {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    setAnalytics(getAnalytics(firebaseApp));
    if (analytics) {
      setAnalyticsCollectionEnabled(analytics, true);
      console.log('collection enabled');
    }

    const handleRouteChange = (url: string) => {
      if (!analytics) {
        return;
      }
      logEvent(analytics, 'page_view', {
        page_location: url,
        page_title: document?.title,
      });
      setCurrentScreen(analytics, document.title ?? 'Undefined');
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [analytics, router.events]);

  return <FirebaseContext.Provider value={analytics}>{props.children}</FirebaseContext.Provider>;
};
