import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { TagFollowButton } from "../../ui/components/followButtons";

export default function TagDescriptionSection({ tag }: { tag: string }) {
  const [tagData, setTagData] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTagData() {
      const {
        // @ts-expect-error
        data: [tagDetails],
        error,
      } = await supabase.rpc("get_tag_details", { tag_identifier: tag });
      if (error) console.error(error);
      console.log(tagDetails);
      setTagData(tagDetails);
    }
    fetchTagData();
  }, [tag]);

  return tagData ? (
    <section className="flex flex-col gap-2 border-b border-blackLight p-5">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{tagData?.tag_name}</h2>
        <TagFollowButton targetTag={tag} initialIsFollowing={tagData?.is_followed} classNames={{ base: "px-4 py-2" }} />
      </header>
      <p className="text-sm font-medium">{tagData?.tag_description}</p>
      <footer className="flex items-center justify-between text-sm font-medium text-white/75">
        <summary className="flex gap-4">
          <data>
            <strong className="text-white">{tagData?.followers_count}</strong> followers
          </data>
          <data>
            <strong className="text-white">{tagData?.posts_count}</strong> posts
          </data>
        </summary>
        <button className="hover:text-white">Improve Tag Info</button>
      </footer>
    </section>
  ) : (
    <div className="border-b border-blackLight p-5">Loading...</div>
  );
}
