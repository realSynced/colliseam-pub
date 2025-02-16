"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Autocomplete, AutocompleteItem, Avatar, Button } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useProfilesList } from "./useProfilesList";
// import { createChat } from "@/utils/processes/messageFunctions";
import { useUser } from "@/lib/store/user";
import { createNotification } from "@/utils/notifications";

async function handleMessageRequestNotification(userID: string, recipientID: string) {
  await createNotification({
    type: "message",
    title: "New Message",
    content: "Someone sent you a message",
    receiverId: recipientID,
    creatorId: userID,
    entityType: "user",
    entityId: recipientID,
    priority: "medium",
    actionUrl: `/messages`,
  });
}

export default function FindUsersModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { items, hasMore, isLoading, onLoadMore } = useProfilesList({ fetchDelay: 1500 });

  const user = useUser((state) => state.user);

  async function createChat(participants: any, type: string) {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participants, type }),
      });

      const data = await response.json();
      console.log("Data:", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const goToCreateMessages = async (user_id: any, username: string) => {
    console.log("clicked");
    try {
      let participants = [user?.id, user_id];
      let messageUser = await createChat(participants, "direct_message");
      console.log("Message user result:", messageUser);

      console.log("Username", username);
      console.log("Chat id:", messageUser?.chat?.id);
      router.push(`/messages/u/${username}?type=direct_message&id=${btoa(messageUser?.chat?.id)}`);
      await handleMessageRequestNotification(user?.id!, user_id);
      onClose(); // Close the modal after successful navigation
      router.refresh();
    } catch (error) {
      console.error("Error in goToCreateMessages:", error);
      // You could show an error message to the user here
    }
  };

  const [, scrollerRef] = useInfiniteScroll({
    hasMore,
    isEnabled: isOpen,
    shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
    onLoadMore,
  });

  return (
    <>
      <div className={`no-scrollbar top-0 flex h-full w-full items-center justify-center overflow-hidden`}>
        <div className="w-100 h-[23.5rem] overflow-hidden rounded-2xl border border-blackLight bg-black p-5">
          <div className="h-full w-full overflow-y-clip">
            {/* <input type="text" 
                            className="h-5 w-full text-white rounded-3xl bg-blackLight focus:outline-none border border-gray2  p-4 "
                        /> */}
            <Autocomplete
              className="no-scrollbar"
              scrollRef={scrollerRef}
              isLoading={isLoading}
              onOpenChange={setIsOpen}
              // selectionMode="single"
              classNames={{
                listboxWrapper: "h-full text-white no-scrollbar",
                selectorButton: "text-default-500",
              }}
              // @ts-expect-error
              color="white"
              defaultItems={items}
              inputProps={{
                // @ts-expect-error
                color: "white",
                className: "text-white bg-blackLight rounded-full",
              }}
              listboxProps={{
                hideSelectedIcon: true,
              }}
              aria-label="Select a username"
              placeholder="Search for a user"
              radius="full"
              variant="bordered"
            >
              {(item) => (
                // @ts-expect-error
                <AutocompleteItem key={item.id} textValue={item.username}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Avatar
                        // @ts-expect-error
                        alt={item.username}
                        className="size-10 flex-shrink-0 rounded-full" // @ts-expect-error
                        src={`https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/avatars/${item.avatar_url}`}
                      />
                      <div className="flex flex-col">
                        {/* @ts-expect-error */}
                        <span className="text-base font-bold">{item.username}</span> {/* @ts-expect-error */}
                        <span className="text-sm font-semibold opacity-75">{item.aboutme.title}</span>
                      </div>
                    </div>
                    <Button
                      // @ts-expect-error
                      onPress={() => goToCreateMessages(item.id, item.username)}
                      className="mr-0.5 rounded-full border-2 border-blackLight text-sm font-medium text-white hover:bg-blackLight"
                    >
                      Message
                    </Button>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
          <div>{/* Results */}</div>
        </div>
      </div>
    </>
  );
}
