import { backendUrl } from "@/App";
import { User } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"

export const useAuthenticatedUser = () => {
    const [user,setUser] = useState<User | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        
        const fetchLoggedInUser = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/user/current`,{
                    withCredentials:true,
                });
                setUser(response.data.user);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchLoggedInUser();
    },[])

    return {isLoading,user,setUser}
}