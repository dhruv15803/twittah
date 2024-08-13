import { AppContext } from "@/context/AppContext";
import { AppContextType } from "@/types";
import { getDateFromDateString } from "@/utils";
import React, { useContext } from "react";
import { Button } from "./ui/button";
import blankAvatarImg from '../assets/blankAvatarImg.png';
import { Calendar, MapPin } from 'lucide-react';

const UserProfile = () => {
    const {loggedInUser,setLoggedInUser} = useContext(AppContext) as AppContextType;

  return (
    <>
      <div className="m-10 flex p-2 flex-col border rounded-lg my-4">
        <div className="flex items-center my-2 justify-between">
          <img
            className="rounded-full w-16"
            src={
              loggedInUser?.profile_picture !== null
                ? loggedInUser?.profile_picture
                : blankAvatarImg
            }
            alt=""
          />
          <Button>Edit profile</Button>
        </div>
        <div className="flex flex-col gap-2    ">
          <span className="text-2xl font-semibold">
            {loggedInUser?.firstName}
          </span>
          <span className="text-gray-700">@{loggedInUser?.username}</span>
        </div>
        <div className="my-2">
          {loggedInUser?.bio ? loggedInUser.bio : "bio"}
        </div>
        <div className="flex items-center justify-between my-2">
          <div className="flex items-center gap-1">
            <div className="text-2xl">
              <MapPin />
            </div>
            <span>
              {loggedInUser?.location ? loggedInUser.location : "location"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-2xl">
              <Calendar />
            </div>
            <span>
              Born {getDateFromDateString(loggedInUser?.Date_of_birth!)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>
              Joined {getDateFromDateString(loggedInUser?.createdAt!)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
