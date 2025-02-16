"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

import SearchBar from "../components/searchBar";
import PersonalizedFeed from "../components/personalizedFeed";
import ProjectItem from "../components/project-item";

import TagDescriptionSection from "../components/tagDescriptionSection";
import SearchResults from "../components/searchResults";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function ProjectExplore() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedTags, setSelectedTags] = useState(searchParams.get("t") ? searchParams.get("t").split("_") : []);
  const [searchResults, setSearchResults] = useState([]);
  const [newTag, setNewTag] = useState(null);
  const [projectsData, setProjectsData] = useState([]);

  async function fetchProjects() {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setProjectsData(data);
  }

  async function fetchTags() {
    const { data, error } = await supabase.from("tags").select("*").limit(12).order("num_posts", { ascending: false });
    if (error) console.error(error);
    else setTags(data);
  }

  function handleSearch(value) {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value) params.set("search", value);
    else params.delete("search");

    replace(`${pathname}?${params.toString()}`);

    if (value) fetchSearchResults(value);
  }

  async function fetchSearchResults(value) {
    const { data, error } = await supabase.rpc("search_data_strict", { filter_text: value, result_limit: 5 });
    if (error) console.error(error);
    else setSearchResults(data);
    console.log(data);
  }

  function handleTagSelectionChange(selectedTags) {
    console.log("tag selection change", selectedTags);
    if (selectedTags.length > 5) selectedTags = selectedTags.slice(0, 5);

    const params = new URLSearchParams(searchParams);
    if (selectedTags.length) {
      params.set("t", selectedTags.join("_"));
    } else {
      params.delete("t");
    }

    if (selectedTags.length === 1) {
      setSearchQuery("");
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);

    setSelectedTags(selectedTags);
  }

  function handleTagResultClick(tag) {
    setNewTag(tag);
  }

  const staticProjectsData = [
    {
      id: 1,
      name: "Project 1",
      description: "This is the description for Project 1.",
      image: "https://via.placeholder.com/80",
      owner: "Owner 1",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Project 2",
      description: "This is the description for Project 2.",
      image: "https://via.placeholder.com/80",
      owner: "Owner 2",
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Project 3",
      description: "This is the description for Project 3.",
      image: "https://via.placeholder.com/80",
      owner: "Owner 3",
      created_at: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    fetchTags();

    setProjectsData(staticProjectsData);

    if (searchQuery) fetchSearchResults(searchQuery);
    // Uncomment the line below to fetch projects from Supabase when not testing
    // Why can't we just fetch them from Supabase even when testing? Uncommenting this for now - Don
    fetchProjects();
  }, []);

  async function fetchTags() {
    const { data, error } = await supabase.from("tags").select("*").limit(12).order("num_posts", { ascending: false });
    if (error) console.error(error);
    else setTags(data);
  }

  async function fetchSearchResults(value) {
    const { data, error } = await supabase.rpc("search_data_strict", { filter_text: value, result_limit: 5 });
    if (error) console.error(error);
    else setSearchResults(data);
  }

  function handleSearch(value) {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value) params.set("search", value);
    else params.delete("search");

    replace(`${pathname}?${params.toString()}`);

    if (value) fetchSearchResults(value);
  }

  function handleTagSelectionChange(selectedTags) {
    console.log("tag selection change", selectedTags);
    if (selectedTags.length > 5) selectedTags = selectedTags.slice(0, 5);

    const params = new URLSearchParams(searchParams);
    if (selectedTags.length) {
      params.set("t", selectedTags.join("_"));
    } else {
      params.delete("t");
    }

    if (selectedTags.length === 1) {
      setSearchQuery("");
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);

    setSelectedTags(selectedTags);
  }

  return (
    <div className="flex flex-grow justify-center overflow-x-hidden text-white">
      <section className="flex w-[750px] flex-shrink-0 flex-col border-x border-blackLight">
        <div className="border-b border-blackLight p-5">
          <SearchBar
            initialSelection={selectedTags}
            initialValue={searchQuery}
            onSearch={handleSearch}
            onTagSelectionChange={handleTagSelectionChange}
            newTag={newTag}
            setNewTag={setNewTag}
          />
        </div>
        {!searchQuery && selectedTags.length === 1 && <TagDescriptionSection tag={selectedTags[0]} />}
        {searchQuery && searchResults && searchResults.length > 0 && (
          <SearchResults searchResults={searchResults} onTagResultClick={handleTagResultClick} />
        )}
        {!searchQuery && selectedTags.length === 0 && (
          <div className="border-b border-blackLight p-5">
            <h1 className="mb-4 text-2xl font-bold">Popular Tags</h1>
            <div className="grid grid-cols-4 grid-rows-3 gap-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <button
                    key={tag.name}
                    className="flex flex-col items-center rounded-lg border border-blackLight bg-blackLight py-12 text-base font-semibold hover:border-white/50"
                    onClick={() => handleTagResultClick(tag.name)}
                  >
                    <p className="w-28 overflow-hidden text-ellipsis whitespace-nowrap text-nowrap">{tag.name}</p>
                    <p className="text-sm font-semibold opacity-75">{tag.num_posts} Posts</p>
                  </button>
                ))
              ) : (
                <>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="shimmer flex h-[8.5rem] flex-col items-center rounded-lg border border-blackLight bg-blackLight"></div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
        <div className="pt-5">
          <h1 className="pb-5 pl-5 text-2xl font-bold">{searchQuery ? `Posts with "${searchQuery}"` : "You Might Like"}</h1>
          <PersonalizedFeed searchQuery={searchQuery} includesAllTags={selectedTags} />
        </div>
      </section>
      <section className="hidden max-w-[300px] flex-shrink flex-col border-r border-blackLight md:flex">
        <>
          <nav className="flex items-center justify-between border-t-[1px] border-t-blackLight px-3 pt-5">
            <h1 className={`text-xl font-bold`}>Projects for You</h1>
          </nav>
          <div className={`flex flex-col`}>
            {projectsData.map((project) => {
              return (
                <ProjectItem
                  key={project.id}
                  title={project.name}
                  description={project.description}
                  link={`/project/${project.name}`}
                  source={project.owner}
                  date={project.created_at}
                />
              );
            })}
          </div>
        </>
      </section>
    </div>
  );
}
