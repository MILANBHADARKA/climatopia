"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth, useUser } from '@clerk/nextjs';

const UserCreditConext = createContext();
export  function UserCreditContextProvider({ children }) {

  const [userCredits, setUserCredits] = useState(0)

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserCredits()
    }
  }, [isSignedIn, user])

  const fetchUserCredits = async () => {
    try {
      const res = await fetch('/api/user/credits')
      if (res.ok) {
        const data = await res.json()
        setUserCredits(data.credits)
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error)
    }
  }
  return (
    <UserCreditConext.Provider value={{userCredits, setUserCredits}}>
      {children}
    </UserCreditConext.Provider>
  )
}


export default function useCredit(){
  return useContext(UserCreditConext)
}