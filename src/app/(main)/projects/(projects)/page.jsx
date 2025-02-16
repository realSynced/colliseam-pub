import { createClient } from "@/utils/supabase/server";
import ProjectsGrid from "@/app/(main)/projects/components/ProjectsGrid";
import availableTagsJson from "@/utils/data/availableTags.json";
import { IoFilter } from "react-icons/io5";
import { BiX, BiSearch } from "react-icons/bi";

export default async function Projects() {
  const supabase = createClient();
  let projects = [];
  let projectMembers = [];
  try {
    const { data: projectsData, error: projectsError } = await supabase.from("projects").select("*, profiles (id, username, avatar_url)");
    const { data: projectMembersData, error: projectMembersError } = await supabase.from("project_members").select("user_id, project_id");
    if (projectsError) throw projectsError;
    if (projectMembersError) throw projectMembersError;
    projects = projectsData;
    projectMembers = projectMembersData;
  } catch (error) {
    console.error(error);
  }

  return (
    <div className={`w-full overflow-hidden border border-red-950`}>
      <label
        htmlFor="search"
        className="group mx-auto mt-5 flex w-2/5 cursor-text items-center justify-center rounded-full border border-blackLight bg-blackLight pl-2.5 text-white duration-300 focus-within:border-white/50"
      >
        <BiSearch className="text-xl text-white/50 duration-300 group-focus-within:text-white" />
        <input type="text" name="search" id="search" className="flex-1 bg-transparent py-2.5 pl-2.5 outline-none placeholder:text-white/50" />
      </label>

      <div className="mb-8 mt-5 flex w-full items-center overflow-hidden px-12">
        <button className="mr-2 flex items-center gap-2 rounded-full border border-white/50 px-4 py-2 text-sm font-semibold text-white">
          <IoFilter className="text-xl" /> Filter
        </button>

        <div className="flex items-center gap-2">
          {/* Selected tags */}
          <div className="flex items-center gap-1 rounded-full bg-primary p-4 py-2 text-sm text-white">
            <span>CSS</span> <BiX className="cursor-pointer text-xl" />
          </div>
          <div className="flex items-center gap-1 rounded-full bg-primary p-4 py-2 text-sm text-white">
            <span>React</span> <BiX className="cursor-pointer text-xl" />
          </div>

          {availableTagsJson.tags.map((tag, i) => {
            if (i > 6) return;
            // Normal Tags
            return (
              <div className="flex items-center gap-1 rounded-full bg-blackLight p-4 py-2 text-sm text-white">
                <span>{tag}</span>
              </div>
            );
          })}
        </div>
      </div>

      <ProjectsGrid projects={projects} projectMembers={projectMembers} />
    </div>
  );
}
