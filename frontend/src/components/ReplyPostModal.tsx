import { useGetPost } from "@/hooks/useGetPost";
import Loader from "./Loader";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import { RxCross1 } from "react-icons/rx";

const ReplyPostModal = ({
  postId,
  onModalClose,
}: {
  postId: string;
  onModalClose: () => void;
}) => {
  const { post, isLoading } = useGetPost(postId);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        aria-modal="true"
        role="dialog"
      >
        <div
          className="bg-white rounded-lg shadow-lg p-4 w-full max-w-lg mx-auto"
          role="document"
        >
          <button
            onClick={onModalClose}
            className="self-end text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <RxCross1 size={24} />
          </button>
          {isLoading || post === null ? (
            <div className="flex justify-center items-center h-full">
              <Loader width="60" height="60" color="#3b82f6" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <PostCard post={post}/>
              <CreatePost isInModal={true} onModalClose={onModalClose} parentId={post.id} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReplyPostModal;
