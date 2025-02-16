import AllChats from "@/app/(main)/(chat)/components/AllChats";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return {
    title: `Colliseam | Messages with ${params.username}`,
    // description: `${params.username} `,
  };
}

export default function Messages({ params, searchParams }: { params: number; searchParams: any }) {
  const encodedId = searchParams?.id;
  // console.log("Search Params:", searchParams);
  console.log("Encoded Chat ID:", encodedId);
  const decodedId = encodedId ? atob(encodedId) : null;
  console.log("Decoded Chat ID:", decodedId);

  // console.log("Search Params:", params);

  // console.log("Decoded Chat ID:", decodedId);
  // @ts-expect-error
  return <AllChats chat_id={decodedId} isDiscussion={false} />;
}
