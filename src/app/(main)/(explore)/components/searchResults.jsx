import { Tabs, Tab } from "@nextui-org/react";
import { UserFollowButton, TagFollowButton } from "@/app/(main)/ui/components/followButtons";
import Link from "next/link";

export default function SearchResults({ searchResults, onTagResultClick }) {
  return (
    <div className="border-b border-blackLight">
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Explore"
          variant="underlined"
          classNames={{
            base: "border-b border-blackLight w-full text-white/50",
            tabList: "overflow-x-hidden py-0 px-5",
            tab: "py-2 h-12 font-semibold",
            tabContent: "group-data-[selected=true]:text-white",
            panel: "p-0",
          }}
          color="white"
        >
          <Tab key="tags" title="Tags">
            <div className="flex flex-col">
              {searchResults.filter((result) => result.table === "tags").length > 0 ? (
                searchResults
                  .filter((result) => result.table === "tags")
                  .map(({ data }) => (
                    <div key={data.slug} className="flex w-full items-center hover:bg-blackLight">
                      <button className="flex-grow py-3 pl-8 text-start font-semibold" onClick={() => onTagResultClick(data.name)}>
                        <p>{data.name}</p>
                        <p className="text-sm font-semibold opacity-75">{data.num_posts} posts</p>
                      </button>
                      <TagFollowButton
                        targetTag={data.slug}
                        initialIsFollowing={data.is_followed}
                        classNames={{
                          base: "mr-8",
                        }}
                      />
                    </div>
                  ))
              ) : (
                <div className="flex h-32 w-full items-center justify-center">
                  <p className="text-2xl font-bold">No Tags Found</p>
                </div>
              )}
            </div>
          </Tab>
          <Tab key="projects" title="Projects">
            <div className="flex flex-col">
              {searchResults.filter((result) => result.table === "projects").length > 0 ? (
                searchResults
                  .filter((result) => result.table === "projects")
                  .map(({ data }) => (
                    <div key={data.id} className="flex w-full items-center hover:bg-blackLight">
                      <Link href={`/projects/${data.name.toLowerCase().replace(/ /g, "-")}`} className="flex-grow py-3 pl-8 text-start font-semibold">
                        <p>{data.name}</p>
                        <p className="text-sm font-semibold opacity-75">{data.full_name}</p>
                      </Link>
                    </div>
                  ))
              ) : (
                <div className="flex h-32 w-full items-center justify-center">
                  <p className="text-2xl font-bold">No Projects Found</p>
                </div>
              )}
            </div>
          </Tab>

          <Tab key="users" title="Users">
            <div className="flex flex-col">
              {searchResults.filter((result) => result.table === "profiles").length > 0 ? (
                searchResults
                  .filter((result) => result.table === "profiles")
                  .map(({ data }) => (
                    <div key={data.username} className="flex w-full items-center hover:bg-blackLight">
                      <Link href={`/profile/${data.username}`} className="flex-grow py-3 pl-8 text-start font-semibold">
                        <p>{data.full_name}</p>
                        <p className="text-sm font-semibold opacity-75">{data.num_followers} followers</p>
                      </Link>
                      <UserFollowButton
                        targetUsername={data.username}
                        initialIsFollowing={data.is_following_self}
                        initialIsFollowed={data.is_followed_by_self}
                        classNames={{
                          base: "mr-8",
                        }}
                      />
                    </div>
                  ))
              ) : (
                <div className="flex h-32 w-full items-center justify-center">
                  <p className="text-2xl font-bold">No Users Found</p>
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
