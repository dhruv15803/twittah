import { AppContext } from '@/context/AppContext'
import { AppContextType } from '@/types'
import {useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import blankAvatarImg from '../assets/blankAvatarImg.png';
import { Button } from './ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import axios from 'axios'
import { backendUrl } from '@/App'

const Header = () => {
    const navigate = useNavigate();
    const {loggedInUser,setLoggedInUser} = useContext(AppContext) as AppContextType;

    const logoutUser = async () => {
        try {
            await axios.get(`${backendUrl}/api/user/logout`,{
                withCredentials:true,
            });
            setLoggedInUser(null);
        } catch (error) {
            console.log(error);
        }
    }

    return (
    <>
    <div className='flex items-center border-b p-4 justify-between'>
        <div className='text-2xl font-semibold'>
            <Link to="/">Twittah</Link>
        </div>
        {loggedInUser!=null ?  <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
                <img className='rounded-full w-14' src={loggedInUser.profile_picture!==null ? loggedInUser.profile_picture : blankAvatarImg} alt="" />
                <span onClick={() => navigate('/profile')} className='font-semibold cursor-pointer'>{loggedInUser.username}</span>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button>Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                        <AlertDialogDescription></AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={logoutUser}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div> : <>
            <div className='flex items-center gap-2'>
                <Button onClick={() => navigate('/login')}>Login</Button>
            </div>
        </>}
    </div>
    </>
  )
}

export default Header