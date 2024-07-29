import { AppContext } from "@/context/AppContext";
import { AppContextType, Post, User } from "@/types";
import { SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import blankAvatarImg from "../assets/blankAvatarImg.png";
import { Image } from "lucide-react";
import axios from "axios";
import { backendUrl } from "@/App";
import { useToast } from "./ui/use-toast";
import { RxCross1 } from "react-icons/rx";
import Loader from "./Loader";

type CreatePostProps = {
  parentId?: string;
  isInModal?: boolean;
  onModalClose?: () => void;
  onAddPost?:(newUser:Post) => void;
};

const CreatePost = ({
  parentId,
  isInModal = false,
  onModalClose,
  onAddPost,
}: CreatePostProps) => {
  const { toast } = useToast();
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  const [postText, setPostText] = useState<string>("");
  const [postImages, setPostImages] = useState<FileList | null>(null);
  const [postImagesUrl, setPostImagesUrl] = useState<string[]>([]);
  const [isImagesLoading, setIsImagesLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addPost = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/post/create?parent_id=${
          parentId !== undefined ? parentId : ""
        }`,
        {
          post_text: postText,
          post_images: postImagesUrl,
        },
        { withCredentials: true }
      );
      if (onAddPost) onAddPost(response.data.newPost as  Post);
      if (parentId !== undefined) {
        toast({
          title: "Replied to post",
          variant: "default",
        });
      } else {
        toast({
          title: "post created",
          variant: "default",
        });
      }
      if (isInModal && onModalClose) {
        onModalClose();
      }
      setPostText("");
      setPostImagesUrl([]);
      setPostImages(null);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Create post error",
        description: "Please try again",
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...postImagesUrl];
    newImages.splice(index, 1);
    setPostImagesUrl(newImages);
  };

  useEffect(() => {
    const getImagesUrl = async () => {
      try {
        if (postImages === null) return;
        setIsImagesLoading(true);
        const formData = new FormData();
        Array.from(postImages).forEach((file) => {
          formData.append("postImages", file);
        });
        const response = await axios.post(
          `${backendUrl}/api/file/files/upload`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
        setPostImagesUrl((prevImages) => [
          ...prevImages,
          ...response.data.urls,
        ]);
        setPostImages(null);
        fileInputRef.current!.value = "";
      } catch (error) {
        console.log(error);
        toast({
          title: "Image upload failed.",
          description: " Try again please",
          variant: "destructive",
        });
      } finally {
        setIsImagesLoading(false);
      }
    };
    getImagesUrl();
  }, [postImages]);

  return (
    <>
      <div className="flex flex-col border rounded-lg p-4">
        <div className="flex gap-2 border-b p-2">
          {loggedInUser?.profile_picture !== null ? (
            <img
              className="aspect-auto object-cover rounded-full"
              src={loggedInUser?.profile_picture}
            />
          ) : (
            <>
              <img
                className="h-12 aspect-auto rounded-full"
                src={blankAvatarImg}
                alt=""
              />
            </>
          )}
          <div className="flex flex-1 flex-col mx-4">
            <div className="flex items-center my-2 gap-2">
              {postImagesUrl?.map((imageUrl, index) => {
                return (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => removeImage(index)}
                        className="border p-2 rounded-full hover:bg-gray-500 hover:text-white hover:duration-300"
                      >
                        <RxCross1 />
                      </button>
                    </div>
                    <img
                      className="w-24 md:w-36 lg:w-44 rounded-lg"
                      src={imageUrl}
                      alt=""
                    />
                  </div>
                );
              })}
              {isImagesLoading && (
                <Loader width="60" height="60" color="#3b82f6" />
              )}
            </div>
            <div className="flex p-2 flex-1">
              <Textarea
                placeholder={
                  parentId !== undefined
                    ? "Post your reply"
                    : "What's happening?"
                }
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="border-0"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between my-2">
          <div className="flex items-center gap-2">
            <label htmlFor="postImages">
              <Image />
            </label>
            <input
              onChange={(e) =>
                setPostImages(e.target.files !== null ? e.target.files : null)
              }
              ref={fileInputRef}
              type="file"
              hidden
              name="postImages"
              id="postImages"
              accept=".jpg,.png"
              multiple
            />
          </div>
          <Button
            onClick={addPost}
            disabled={postText === "" || isImagesLoading}
            className="bg-blue-500 text-white hover:bg-blue-600 hover:duration-300"
          >
            Post
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
