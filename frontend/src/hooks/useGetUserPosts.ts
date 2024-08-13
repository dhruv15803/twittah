import { backendUrl } from "@/App";
import { Post } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"

export const useGetUserPosts = () => {
    const [posts,setPosts] = useState<Post[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/post/userPosts`,{
                    withCredentials:true,
                });
                setPosts(response.data.posts);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUserPosts();
    },[]);

    return {posts,isLoading};
}