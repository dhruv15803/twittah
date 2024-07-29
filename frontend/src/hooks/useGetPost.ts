import { backendUrl } from "@/App";
import { Post } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react"



export const useGetPost = (postId:string) => {
    const [post,setPost] = useState<Post | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/post/${postId}`,{
                    withCredentials:true,
                });
                setPost(response.data.post);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPost();
    },[postId]);
    
    return {isLoading,post,setPost}
}