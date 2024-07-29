import { AppContextType, Like, Post } from "@/types";
import blankAvatarImg from "../assets/blankAvatarImg.png";
import { getPostDate } from "@/utils";
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { useContext, useEffect, useMemo, useState } from "react";
import ReplyPostModal from "./ReplyPostModal";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { backendUrl } from "@/App";

type PostCardProps = {
  post: Post;
};

const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post._count.Likes);

  const likeOrUnlikePost = async () => {
    // api request
    try {
      await axios.post(
        `${backendUrl}/api/post/like`,
        {
          post_id: post.id,
        },
        { withCredentials: true }
      );
      isLiked
        ? setLikeCount((prevCount) => prevCount - 1)
        : setLikeCount((prevCount) => prevCount + 1);
      setIsLiked((prevIsLiked) => !prevIsLiked);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (() => {
      let isPostLiked = false;
      const usersLikes = loggedInUser?.Likes;
      const likedPost = usersLikes?.find(
        (userLike: Like) => userLike.liked_post_id === post.id
      );
      if (likedPost) {
        isPostLiked = true;
      }
      setIsLiked(isPostLiked);
    })();
  }, []);

  return (
    <>
      {isReplyModalOpen && (
        <ReplyPostModal
          onModalClose={() => setIsReplyModalOpen(false)}
          postId={post.id}
        />
      )}
      <div className={`flex flex-col p-4 border rounded-lg`}>
        <div className="flex justify-between items-center pb-2">
          <div className="flex items-center gap-2">
            {" "}
            {post.post_author.profile_picture !== null ? (
              <>
                <img src={post.post_author.profile_picture} alt="" />
              </>
            ) : (
              <>
                <img
                  className="w-14 rounded-full"
                  src={blankAvatarImg}
                  alt=""
                />
              </>
            )}
            <span className="font-semibold">{post.post_author.username}</span>
          </div>
          <div className="text-gray-500">
            {getPostDate(new Date(post.createdAt))}
          </div>
        </div>
        <div
          onClick={() => navigate(`/post/${post.id}`)}
          className="flex flex-col gap-2 p-4 border-b"
        >
          <div className="flex flex-wrap text-lg">{post.post_text}</div>
          {post.post_images.length !== 0 && (
            <div className="flex items-center flex-wrap gap-2">
              {post.post_images.map((postImage, idx) => {
                return (
                  <img
                    className="w-24 md:w-44 lg:w-56 rounded-lg"
                    key={idx}
                    src={postImage}
                    alt=""
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mx-10 my-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReplyModalOpen(true)}
              className="text-xl hover:text-blue-400 hover:duration-300"
            >
              <FaRegComment />
            </button>
            <span>{post._count.Post}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={likeOrUnlikePost}>
              {isLiked ? (
                <>
                  <FaHeart />
                </>
              ) : (
                <>
                  <FaRegHeart />
                </>
              )}
            </button>
            <span>{likeCount}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
