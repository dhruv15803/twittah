import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { AppContextType} from "@/types";
import { createContext} from "react";

export const AppContext = createContext<AppContextType | null>(null);


const AppContextProvider = ({children}:{children:React.ReactNode}) => {
    const {user,setUser,isLoading} = useAuthenticatedUser();

    if (isLoading) return <>Loading...</>

    return (
        <>
        <AppContext.Provider value={{
            loggedInUser:user,
            setLoggedInUser:setUser,
        }}>
            {children}
        </AppContext.Provider>
        </>
    )
}

export default AppContextProvider;
