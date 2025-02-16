"use client";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Search from "@/app/(main)/home/components/search";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import FindUsersModal from "./findUsersModal";
import MessagesLeftPanelSkeleton from "./MessagesLeftPanelSkeleton";
import usePresenceStore from "@/lib/store/usePresenceStore";
import useChatStore from "@/lib/store/useChatStore";

// Icons
import MessagePlus from "../../../../../../public/icons/messages-square_plus.svg";

export default function MessagesLeftPanel() {
  const supabase = createClient();
  let pathname = usePathname();
  const { isUserOnline, initializePresence } = usePresenceStore();
  const { getTypingUsers, getUnreadCount, incrementUnread, clearUnread, initializeTypingChannel } = useChatStore();

  const [selectedFilter, setSelectedFilter] = useState(0);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastClickedChatId, setLastClickedChatId] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // get the users you have sent messages to
  const getDMs = async () => {
    try {
      // console.log("[Client] Starting to fetch DMs");
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.log("[Client] No user found");
        return;
      }
      // console.log("[Client] Current user:", user.id);

      // console.log("[Client] Fetching messages from API...");
      const response = await fetch(`/api/messages?userId=${user.id}`);
      const data = await response.json();
      // console.log("[Client] API Response:", data);

      if (data.error) {
        console.error("[Client] Error fetching messages:", data.error);
        return;
      }

      // console.log("[Client] Setting chats data:", data.chats);
      setUsersData(data.chats);
      // console.log("[Client] Finished setting chats data", data.chats);
    } catch (error) {
      console.error("[Client] Error in getDMs:", error);
    } finally {
      setLoading(false);
      // console.log("[Client] Finished loading DMs");
    }
  };

  useEffect(() => {
    getDMs();

    const {
      data: { subscription: presenceSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const cleanup = await initializePresence(session.user.id);
        return () => cleanup && cleanup();
      }
    });

    // Get current user
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    };

    // Subscribe to chat messages changes
    const channel = supabase
      .channel("chat_updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        async (payload) => {
          const user = await getCurrentUser();
          // Update the latest message for the corresponding chat
          setUsersData((prevData) => {
            return prevData.map((chat) => {
              if (chat.id === payload.new.chat_id) {
                // Increment unread count if the message is not from current user
                if (payload.new.sender_id !== user?.id) {
                  incrementUnread(chat.id);
                }
                return {
                  ...chat,
                  latestMessage: payload.new,
                };
              }
              return chat;
            });
          });
        },
      )
      .subscribe();

    // Initialize typing channels for all chats
    let typingCleanups = [];
    const initializeTyping = async () => {
      const user = await getCurrentUser();
      if (user) {
        usersData.forEach((chat) => {
          const cleanup = initializeTypingChannel(chat.id, user.id);
          typingCleanups.push(cleanup);
        });
      }
    };
    initializeTyping();

    return () => {
      presenceSubscription?.unsubscribe();
      channel.unsubscribe();
      typingCleanups.forEach((cleanup) => cleanup());
    };
  }, [usersData.length]);

  const handleChatClick = (chatId) => {
    setLastClickedChatId(chatId);
    clearUnread(chatId);
  };

  // Sort chats whenever usersData or lastClickedChatId changes
  const sortedChats = useMemo(() => {
    return [...usersData].sort((a, b) => {
      // First priority: last clicked chat
      if (a.id === lastClickedChatId) return -1;
      if (b.id === lastClickedChatId) return 1;

      // Second priority: latest message time
      const aTime = a.latestMessage?.created_at || a.created_at;
      const bTime = b.latestMessage?.created_at || b.created_at;
      return new Date(bTime) - new Date(aTime);
    });
  }, [usersData, lastClickedChatId]);

  if (loading) return <MessagesLeftPanelSkeleton />;

  return (
    <>
      <nav className="sticky top-0 z-0 flex h-screen w-96 flex-shrink-0 flex-col items-center border-r border-r-blackLight bg-black text-white">
        <div className="flex w-full flex-col text-white">
          <div className="w-full border-b border-white/10 p-5 pr-5">
            <Search />
          </div>
          <div className="border-b border-white/10 p-5">
            <h1 className="px-3 text-xl font-bold">Friends</h1>
          </div>

          <div className="flex w-full p-5 px-8">
            <h1 className="text-xl font-bold">Messages</h1>
            <button className="ml-auto" onClick={onOpen}>
              <Image src={MessagePlus} width={23} height={23} alt="messageIcon" className="ml-auto" />
            </button>
          </div>

          <div className="flex flex-col px-5">
            {/* Filter Messages */}
            <div className="flex gap-2 px-3 pb-5">
              {["All", "Unread", "Groups", "Users"].map((item, i) => (
                <button
                  key={item}
                  onClick={() => setSelectedFilter(i)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${i === selectedFilter ? "bg-primary" : "bg-blackLight hover:bg-white hover:text-black"}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div style={{ height: "calc(100vh - 280px)" }} className="scrollbar-thin flex flex-col space-y-2 overflow-y-auto">
              <div className="mt-4 flex flex-col gap-2">
                {loading ? (
                  <MessagesLeftPanelSkeleton />
                ) : (
                  sortedChats.map((chat) => {
                    // Get the first participant for direct messages
                    const otherParticipant = chat.participants[0];

                    return (
                      <Link
                        key={chat.id}
                        href={`/messages/u/${otherParticipant?.username || chat.id}?type=${chat.type}&id=${btoa(chat.id)}`}
                        onClick={() => handleChatClick(chat.id)}
                        className={`flex items-center gap-3 rounded-lg p-2 hover:bg-blackLighter dark:hover:bg-zinc-800 ${
                          pathname === `/messages/u/${otherParticipant?.username || chat.id}` ? "bg-blackLighter dark:bg-zinc-800" : ""
                        }`}
                      >
                        <div className="relative">
                          <Image
                            src={
                              otherParticipant?.avatar_url
                                ? `https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/avatars/${otherParticipant.avatar_url}`
                                : "/images/default-avatar.png"
                            }
                            alt={otherParticipant ? `${otherParticipant.username}'s avatar` : "Chat avatar"}
                            width={40}
                            height={40}
                            className="size-10 rounded-full"
                          />
                          <div
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                              isUserOnline(otherParticipant?.id) ? "bg-green-500" : "bg-gray-500"
                            }`}
                          ></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">
                              {chat.type === "direct_message"
                                ? otherParticipant?.full_name || otherParticipant?.username
                                : `Group Chat (${chat.participants.length} members)`}
                            </p>
                            {getUnreadCount(chat.id) > 0 && (
                              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold">
                                {getUnreadCount(chat.id)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <p className="line-clamp-1 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
                              {getTypingUsers(chat.id).size > 0
                                ? `${Array.from(getTypingUsers(chat.id)).length} typing...`
                                : chat.latestMessage?.content || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="opaque" size="xs" hideCloseButton scrollBehavior="inside">
        <ModalContent>{(onClose) => <FindUsersModal onClose={onClose} />}</ModalContent>
      </Modal>
    </>
  );
}
