import { createContext, useState, useEffect, ReactNode } from 'react';
import firebase from 'firebase/app';
import { useRouter } from 'next/router';
import 'firebase/analytics';

export const FirebaseContext = createContext(null);

export const FirebaseTrackingProvider = (props: { children: ReactNode }) => {
    const router = useRouter();
    const [tracking, setTracking] = useState<firebase.analytics.Analytics | null>(null);

    useEffect(() => {
        setTracking(firebase.analytics());

        const handleRouteChange = (url: string) => {
            if (!tracking) {
                return;
            }

            tracking.logEvent('page_view', {
                page_location: url,
                page_title: document?.title,
            });
        };

        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [tracking]);

    return (
        <FirebaseContext.Provider value={tracking}>
            {props.children}
        </FirebaseContext.Provider>
    );
};
