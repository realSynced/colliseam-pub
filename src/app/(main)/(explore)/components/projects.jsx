import ProjectItem from "./project-item";
import { createClient } from "@/utils/supabase/server";

export default async function Projects() {
  const supabase = createClient();
  const { data: projectsData, error } = await supabase.rpc("get_projects_by_member_count", { result_limit: 4 });
  if (error) {
    console.error(error);
    return;
  }

  return (
    <>
      <nav className="flex items-center justify-between border-t-[1px] border-t-blackLight px-3 pt-5">
        <h1 className={`text-xl font-bold`}>Projects for You</h1>
        <button className="text-sm opacity-50">View More</button>
      </nav>
      <div className={`flex flex-col`}>
        {projectsData.map((project) => {
          return (
            <ProjectItem
              key={project.id}
              title={project.name}
              description={project.description}
              image={project.image}
              link={`/project/${project.name}`}
              source={project.owner}
              date={project.created_at}
            />
          );
        })}
      </div>
    </>
  );
}
