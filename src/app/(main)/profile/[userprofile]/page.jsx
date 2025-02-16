import { redirect } from "next/navigation";

import ProfileDNE from "./ProfileDNE";
import BannerCard from "../components/bannerCard";
import BioCard from "../components/bioCard";
import ProfileActivity from "../components/profileActivity";
import { createClient } from "@/utils/supabase/server";
// import { Metadata } from "next";

export default async function ProfileDetails({ params }) {
  let profileExists = true;

  let userInfo = {
    username: params.userprofile,
    fullname: "",
    id: "",
    aboutme: "",
    website: "",
    avatarUrl: "",
    bannerUrl: "",
    points: 0,
    connections: [],
    top3Communities: [],
    postIDs: [],
    postsUpvoted: [],
    postsDownvoted: [],
    postsSaved: [],
    skills: [],
    availability: "",
    usersFollowing: [],
    followedBy: [],
    hours: 0,
    dateCreated: "",
  };

  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  try {
    // setLoading(true)

    const { data, error, status } = await supabase
      .from("profiles")
      .select(`id, full_name, website, avatar_url, banner_url, aboutme, connections, list_posts, skills, availability, points, created_at`)
      .eq("username", params.userprofile)
      .single();

    const { data: followedUsers, error: userFollowError } = await supabase.from("user_follows").select("followed_id").eq("follower_id", data.id);

    if (userFollowError) {
      console.log("Error fetching follow data: ", userFollowError.message);
    }

    const { data: followerUsers, error: userFollowedByError } = await supabase.from("user_follows").select("follower_id").eq("followed_id", data.id);

    if (userFollowedByError) {
      console.log("Error fetching followed by data: ", userFollowedByError.message);
    }

    if (error) {
      console.log("Error fetching user data: ", error.message);
      profileExists = false;
    }
    if (error && status !== 406) {
      throw error;
    }

    const {
      data: [personalPostData],
    } = await supabase.rpc("get_personal_post_ids", {
      target_user: data.id,
      result_limit: 1000,
    });

    if (data) {
      userInfo.fullname = data.full_name;
      userInfo.id = data.id;
      userInfo.aboutme = data.aboutme;
      userInfo.website = data.website;
      userInfo.avatarUrl = data.avatar_url;
      userInfo.bannerUrl = data.banner_url;
      userInfo.connections = data.connections;
      userInfo.postIDs = data.list_posts;
      userInfo.skills = data.skills;
      userInfo.usersFollowing = followedUsers;
      userInfo.followedBy = followerUsers;
      userInfo.points = data.points;
      userInfo.postsUpvoted = personalPostData.posts_upvoted;
      userInfo.postsDownvoted = personalPostData.posts_downvoted;
      userInfo.postsSaved = personalPostData.posts_saved;
      userInfo.dateCreated = data.created_at;

      if (data.availability) {
        userInfo.availability = data.availability.role;
        userInfo.hours = data.availability.hours;
      }

      if (data.comm_in) {
        data.comm_in.sort((a, b) => b.posts - a.posts);
        const top3CommunityIDs = data.comm_in.slice(0, 3);
        for (let i = 0; i < top3CommunityIDs.length; i++) {
          const { data: communityData, error: communityError } = await supabase
            .from("communities")
            .select("name, icon_image")
            .eq("id", top3CommunityIDs[i].id)
            .single();
          if (communityError) console.log("Error fetching community info: ", communityError.message);

          userInfo.top3Communities.push({
            name: communityData.name,
            icon: `https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/community_icon/${communityData.icon_image}`,
            numPosts: top3CommunityIDs[i].posts,
          });
        }
      }

      console.log("User data loaded successfully!");
    }
  } catch (error) {
    console.log("Error loading user data! " + error.message);
  }

  if (params.userprofile === "undefinied") {
    redirect("/accounts/login");
  }

  return (
    <>
      {profileExists ? (
        <div className="mx-auto flex flex-col gap-5 px-5 py-5 md:px-8">
          <BannerCard
            bannerUrl={userInfo.bannerUrl}
            username={userInfo.username}
            fullname={userInfo.fullname}
            avatarUrl={`https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/avatars/${userInfo.avatarUrl}`}
            initialFollowing={userInfo.followedBy.some((follower) => follower.follower_id === user.id)}
            isFollowedBy={userInfo.usersFollowing.some((followed) => followed.followed_id === user.id)}
            isSelf={userInfo.id === user.id}
          />
          <section className="flex min-h-screen gap-5">
            <BioCard
              name={userInfo.fullname}
              title={userInfo.aboutme.title}
              subtitle={userInfo.aboutme.subtitle}
              bio={userInfo.aboutme.bio}
              numFollowers={userInfo.followedBy.length}
              numFollowing={userInfo.usersFollowing.length}
              nexPoints={userInfo.points}
              views="0"
              reached="0"
              answers="0"
              questions="0"
              skills={userInfo.skills}
              availability={userInfo.availability}
              hours={userInfo.hours}
              topCommunities={userInfo.top3Communities}
              connections={userInfo.connections}
              dateCreated={userInfo.dateCreated}
            />
            <ProfileActivity userInfo={userInfo} />
          </section>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ProfileDNE />
        </div>
      )}
    </>
  );
}
