import { backendUrl } from "@/App";
import { Post } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useGetPosts = (page = 1, pageLimit = 10,parentId="") => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/post/posts/${parentId}?page=${page}&pageLimit=${pageLimit}`,
          {
            withCredentials: true,
          }
        );
        setPosts(response.data.posts);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [page, pageLimit,parentId]);

  return { isLoading, setPosts, posts };
};
