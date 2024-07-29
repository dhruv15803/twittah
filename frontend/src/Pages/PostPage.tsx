import CreatePost from "@/components/CreatePost";
import Loader from "@/components/Loader";
import PostCard from "@/components/PostCard";
import { useGetPost } from "@/hooks/useGetPost";
import { useGetPosts } from "@/hooks/useGetPosts";
import { Post } from "@/types";
import { useState } from "react";
import { useParams } from "react-router-dom";

const PostPage = () => {
  const { postId } = useParams();
  const { post, isLoading } = useGetPost(postId !== undefined ? postId : "");
  const [page, setPage] = useState<number>(1);
  const pageLimit = 10;
  const { posts,setPosts,isLoading: isRepliesLoading } = useGetPosts(
    page,
    pageLimit,
    post !== null ? post.id : ""
  );

  if (isLoading)
    return (
      <>
        <div className="flex items-center my-8 justify-center">
          <Loader height="80" width="80" color="#3b82f6" />
        </div>
      </>
    );

  if (!post && !isLoading)
    return (
      <>
        <div className="my-8 flex justify-center text-gray-500 text-xl">
          No post found
        </div>
      </>
    );

  return (
    <>
      <PostCard post={post!} />
      <CreatePost parentId={post?.id} onAddPost={(newPost:Post) => setPosts((prevPosts) => [newPost,...prevPosts])}/>
      {isRepliesLoading ? <>
        <div className="my-4 flex justify-center">
            <Loader width="60" height="60" color="#3b82f6"/>
        </div>
      </>:<>
        {posts.map((post) => {
            return <PostCard key={post.id} post={post}/>
        })}
      </>}
    </>
  );
};

export default PostPage;
