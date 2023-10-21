import React from 'react'
import {GoogleAuthProvider,getAuth,signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../Redux/User/userSlice';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_BASE_URL;
function OAuth() {
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)

             const res = await fetch(`${apiUrl}/api/auth/google`, {
               method: "POST",
               headers: {
                 "Content-Type": "application/json",
               },
               body: JSON.stringify({username:result.user.displayName,email:result.user.email,photo:result.user.photoURL}),
             });
        
            const data = await res.json();
               dispatch(signInSuccess(data));
             Navigate("/")
        } catch (error) {
            console.log('could not sign in with google',error)
       }
   }

  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>continue with google</button>
  )
}

export default OAuth