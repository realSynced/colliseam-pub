import ProjectCard from "./ProjectCard";

export default function ProjectsGrid({ projects, projectMembers }) {
  console.log(projectMembers);
  return (
    <div className="grid w-full gap-8 px-12 pb-5 text-white md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {projects.map((project) => {
        const projectMembersData = projectMembers.filter((m) => m.project_id === project.id);
        return (
          <ProjectCard
            key={project.id}
            name={project.name}
            owner={project.profiles}
            description={project.description}
            userMembers={projectMembersData}
            tags={project.tags}
            budget={project.budget || "0.00"}
            createdAt={project.created_at}
            thumbnail_url={project.thumbnail_url}
          />
        );
      })}
    </div>
  );
}
