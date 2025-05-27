import React from 'react'
import { useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';


function IsSignedIn({ children }) {

    const { isSignedIn, isLoaded } = useAuth();
    const { user } = useUser();
    const router = useRouter();


    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/sign-in');
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            />
        </div>)
    }

    if (!isSignedIn) {
        router.push('/sign-in');
        return null;
    }

    return (
        <>{children}</>
    );
}

export default IsSignedIn