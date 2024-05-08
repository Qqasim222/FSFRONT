"use client";
import React, { Suspense } from "react";
import ProfileTabs from "@/components/users/profile/profile-tabs";

const ProfilePage = () => {
  return (
    <div>
      <div className="w-full flex flex-col md:flex-row gap-5"></div>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ProfileTabs />
        </Suspense>
      </div>
    </div>
  );
};

export default ProfilePage;
