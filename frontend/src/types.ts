import { SetStateAction } from "react";

export type AppContextType = {
    loggedInUser:User | null;
    setLoggedInUser:React.Dispatch<SetStateAction<User | null>>;
}

export type User = {
    id:string;
    email:string;
    username:string;
    firstName?:string;
    lastName?:string;
    password?:string;
    profile_picture?:string;
    Date_of_birth:string;
    bio?:string;
    location?:string;
    createdAt:string;
    Likes:Like[];
}

export type Post = {
    id:string;
    post_text:string;
    post_author_id:string;
    post_images:string[];
    parent_post_id:string | null;
    post_author:User;
    createdAt:Date;
    _count:{Post:number,Likes:number};
}

export type Like = {
    liked_by_id:string;
    liked_post_id:string;
}