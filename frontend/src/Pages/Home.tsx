import CreatePost from "@/components/CreatePost";
import Loader from "@/components/Loader";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { useGetPosts } from "@/hooks/useGetPosts";
import { Post, User } from "@/types";
import React, { useState } from "react";

const Home = () => {
  const [page, setPage] = useState<number>(1);
  const pageLimit = 5;
  const { posts, isLoading,setPosts} = useGetPosts(page, pageLimit);

  return (
    <>
      <div className="m-10">
        <CreatePost onAddPost={(newPost:Post) => setPosts((prevPosts) => [newPost,...prevPosts]) }  />
      </div>
      {isLoading ? (
        <>
          <div className="flex items-center justify-center my-4">
            <Loader color="#3b82f6" width="60" height="60" />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {posts.map((post, idx) => {
              return (
                <div key={post.id}>
                  <PostCard key={post.id} post={post} />
                  {posts.length - 1 === idx && (
                    <div className="flex justify-center">
                      <Button
                        onClick={() => setPage((prevPage) => prevPage + 1)}
                      >
                        Load more
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
