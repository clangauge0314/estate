"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";

export default function ChannelTalk() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    ChannelService.loadScript();

    if (isLoaded) {
      const bootConfig = {
        pluginKey: process.env.NEXT_PUBLIC_CHANNELTALK_KEY,
      };

      if (isSignedIn && user) {
        console.log("User is signed in:", {
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          email: user.primaryEmailAddress?.emailAddress,
          phone: user.primaryPhoneNumber?.phoneNumber,
        });

        bootConfig.memberId = user.id;
        bootConfig.profile = {
          name: user.fullName || user.username || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          mobileNumber: user.primaryPhoneNumber?.phoneNumber || "",
        };
      } else {
        console.log("User not signed in or user data not available");
      }

      try {
        ChannelService.boot(bootConfig);
        console.log("ChannelIO boot called successfully");
      } catch (error) {
        console.error("Error during ChannelIO boot:", error);
      }
    } else {
      console.log("Clerk user not loaded yet");
    }

    return () => {
      console.log("ChannelTalk component unmounting");
      try {
        ChannelService.shutdown();
        console.log("ChannelIO shutdown called");
      } catch (error) {
        console.error("Error during ChannelIO shutdown:", error);
      }
    };
  }, [isLoaded, isSignedIn, user]);

  return null;
}
