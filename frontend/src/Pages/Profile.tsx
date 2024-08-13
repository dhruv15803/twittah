import Loader from '@/components/Loader';
import PostCard from '@/components/PostCard';
import UserProfile from '@/components/UserProfile';
import { useGetUserPosts } from '@/hooks/useGetUserPosts';


const Profile = () => {
    const {posts,isLoading} = useGetUserPosts();

    return (
    <>
        <UserProfile/>
        <div className='flex flex-col mx-10 my-4 gap-2'>
            {isLoading ? <>
                <Loader color='black' height='80' width='80'/>
            </> : <>
                {posts.map((post) => {
                    return <PostCard post={post} key={post.id}/>
                })}
            </>}
        </div>
    </>
  );
}

export default Profile