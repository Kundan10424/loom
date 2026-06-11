"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useFileExplorer } from "@/features/playground/components/hooks/useFileExplorer";
import { UsePlayground } from "@/features/playground/components/hooks/UsePlayground";
import TemplateFileTree from "@/features/playground/components/template-file-tree";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const {
    playgroundData,
    templateData,
    isLoading,
    error,
    loadPlayground,
    saveTemplateData,
  } = UsePlayground(id);
  const {
    activeFileId,
    closeAllFiles,
    openFile,
    editorContent,
    updateFileContent,
    handleAddFile,
    handleDeleteFile,
    handleAddFolder,
    handleDeleteFolder,
    handleRenameFile,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();

  return (
    <div>
      <>
        <TemplateFileTree data={templateData!} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex flex-1 items-center gap-2">
              <div className="flex flex-col flex-1">
                {playgroundData?.title || "Untitled Playground"}
              </div>
            </div>
          </header>
        </SidebarInset>
      </>
    </div>
  );
};

export default Page;
