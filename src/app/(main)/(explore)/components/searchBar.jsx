import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { SearchIcon } from "@/app/(main)/ui/components/miscIcons";
import { IoIosSearch } from "react-icons/io";
import { BiX } from "react-icons/bi";
import Image from "next/image";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchBar({ initialSelection = [], initialValue = "", onSearch, onTagSelectionChange, newTag, setNewTag }) {
  const [search, setSearch] = useState(initialValue);
  const debouncedSearch = useDebounce(search, 500);
  const supabase = createClient();
  const [selectedTags, setSelectedTags] = useState([]);

  let list = useAsyncList({
    async load({ signal, filterText }) {
      const { data, error } = await supabase.rpc("search_data", { filter_text: filterText });
      if (error) console.error(error);

      return {
        items: data,
      };
    },
  });

  useEffect(() => {
    list.setFilterText(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    console.log(initialSelection);
    initialSelection.forEach(async (tag) => {
      const { data, error } = await supabase.from("tags").select("*").eq("slug", tag).single();
      if (error) console.error(error);
      console.log(data);
      setSelectedTags([...selectedTags, data]);
    });
  }, []);

  useEffect(() => {
    if (newTag) {
      handleSelectionChange(newTag);
      setNewTag(null);
    }
  }, [newTag]);

  const handleSelectionChange = (key) => {
    if (!key) return;

    if (selectedTags.find((tag) => tag.name === key)) {
      setSelectedTags(selectedTags.filter((tag) => tag.name !== key));
      setSearch("");
      onTagSelectionChange(selectedTags.filter((tag) => tag.name !== key).map((tag) => tag.slug));
    } else {
      supabase
        .from("tags")
        .select("*")
        .eq("name", key)
        .single()
        .then(({ data, error }) => {
          if (!error) {
            setSelectedTags([...selectedTags, data]);
            setSearch("");
            onTagSelectionChange([...selectedTags, data].map((tag) => tag.slug));
          }
        });
    }
  };

  return (
    <Autocomplete
      aria-label="Search"
      placeholder={selectedTags.length ? "" : "Explore"}
      value={search}
      onChange={setSearch}
      onInputChange={(value) => setSearch(value)}
      onSelectionChange={handleSelectionChange}
      inputValue={search}
      isLoading={list.isLoading}
      items={list.items}
      disabledKeys={selectedTags.map((tag) => tag.name)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSearch(search);
      }}
      listboxProps={{
        className: "w-full bg-black text-white rounded-2xl p-5 border border-blackLight",
        classNames: {
          list: "grid grid-cols-2 gap-4",
        },
      }}
      inputProps={{
        classNames: {
          inputWrapper: "rounded-full",
        },
      }}
      popoverProps={{
        classNames: {
          content: "p-0",
        },
      }}
      className="rounded-full bg-blackLight"
      classNames={{ listboxWrapper: "max-h-full" }}
      selectorButtonProps={{
        className: "hidden",
      }}
      clearButtonProps={{
        className: "hidden",
      }}
      startContent={
        <div className="flex items-center justify-center gap-1 py-2">
          <button onClick={() => onSearch(search)}>
            {/* <SearchIcon size="28" /> */}
            <IoIosSearch className="text-2xl opacity-75" />
          </button>
          {selectedTags.map((tag) => (
            <button
              key={tag.slug}
              onClick={() => handleSelectionChange(tag.name)}
              className="flex items-center justify-center whitespace-nowrap text-nowrap rounded-full bg-blackLighter px-2 py-1 text-sm text-white"
            >
              {tag.name}
              <BiX className="ml-1" />
            </button>
          ))}
        </div>
      }
      allowsCustomValue
      onClick={(e) => e.target.focus()}
    >
      <AutocompleteSection title="In Tags:" className="font-bold" classNames={{ group: "grid grid-cols-2 gap-4" }} hideSelectedIcon>
        {list.items
          .filter((item) => item.table === "tags")
          .map(({ data }) => (
            <AutocompleteItem
              key={data.name}
              className="rounded-lg border border-blackLight text-white hover:bg-white hover:text-black"
              textValue={data.name}
            >
              <div className="p-1">
                <p className="text-sm">{data.name}</p>
                <p className="text-xs font-medium opacity-75">{data.num_posts} posts</p>
              </div>
            </AutocompleteItem>
          ))}
      </AutocompleteSection>
      <AutocompleteSection title="In Users:" className="font-bold" classNames={{ group: "grid grid-cols-2 gap-4" }} hideSelectedIcon>
        {list.items
          .filter((item) => item.table === "profiles")
          .map(({ data }) => (
            <AutocompleteItem
              key={`_${data.username}`}
              className="rounded-lg border border-blackLight text-white hover:bg-white hover:text-black"
              textValue={data.username}
              href={`/profile/${data.username}`}
            >
              <div className="flex items-center p-1">
                <Image
                  src={`https://yerinlyysexrpzplasnt.supabase.co/storage/v1/object/public/avatars/${data.avatar_url}`}
                  width={64}
                  height={64}
                  alt={data.full_name}
                  className="h-8 w-8 rounded-full"
                />
                <div className="ml-2 flex flex-col text-sm">
                  <p className="text-sm">{data.full_name}</p>
                  <p className="text-xs font-medium opacity-75">@{data.username}</p>
                </div>
              </div>
            </AutocompleteItem>
          ))}
      </AutocompleteSection>
      <AutocompleteSection title="In Projects:" className="col-span-2 font-bold" classNames={{ group: "grid grid-cols-4 gap-4" }} hideSelectedIcon>
        {list.items
          .filter((item) => item.table === "projects")
          .map(({ data }) => (
            <AutocompleteItem
              key={`_${data.name}`}
              className="rounded-lg border border-blackLight text-white hover:bg-white hover:text-black"
              textValue={data.name}
              href={`/project/${data.name}`}
            >
              <div className="p-1 text-sm">
                <p>{data.name}</p>
                <p className="mb-4 text-xs font-medium opacity-75">{data.full_name}</p>
                <p className="text-xs">${data.budget}</p>
                <div className="flex items-center">
                  <ul className="flex gap-1"></ul>
                </div>
              </div>
            </AutocompleteItem>
          ))}
      </AutocompleteSection>
    </Autocomplete>
  );
}
