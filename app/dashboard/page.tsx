import {
  deleteProjectById,
  duplicateProjectById,
  editProjectById,
  getAllPlayground,
} from "@/features/dashboard/actions";
import AddNewButton from "@/features/dashboard/components/add-new-button";
import AddRepoButton from "@/features/dashboard/components/add-repo-button";
import ProjectTable from "@/features/dashboard/components/project-table";
import Image from "next/image";

interface Props {
  title: string;
  description: string;
  imageSrc: string;
}

const EmptyState = ({ title, description, imageSrc }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Image
        src={imageSrc}
        alt={title}
        height={220}
        width={220}
        className="mb-4"
      />
      <h2 className="text-xl font-semibold text-gray-500">{title}</h2>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

const Page = async () => {
  const playgrounds = (await getAllPlayground()) ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Section */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AddNewButton />
          <AddRepoButton />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 justify-center">
        <div className="w-full max-w-4xl px-4">
          {playgrounds.length === 0 ? (
            <EmptyState
              title="No projects found"
              description="Create your first project or open a repository."
              imageSrc="/empty-state.svg"
            />
          ) : (
            <ProjectTable
              projects={playgrounds || []}
              onDeleteProject={deleteProjectById}
              onDuplicateProject={duplicateProjectById}
              onUpdateProject={editProjectById}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
