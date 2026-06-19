"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  FolderOpen,
  AlertCircle,
  Save,
  X,
  Settings,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { useFileExplorer } from "@/features/playground/components/hooks/useFileExplorer";
import { UsePlayground } from "@/features/playground/components/hooks/UsePlayground";
import TemplateFileTree from "@/features/playground/components/template-file-tree";
import { useParams } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import { TemplateFile } from "@/features/playground/lib/path-to-json";
import { PlaygroundEditor } from "@/features/playground/components/playground-editor";

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
    closeFile,
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

  useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId]);

  useEffect(() => {
    if (templateData && !openFiles.length) {
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length]);

  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);

  const handleFileSelect = (file: TemplateFile) => {
    openFile(file);
  };

  return (
    <TooltipProvider>
      <>
        <TemplateFileTree
          data={templateData!}
          onFileSelect={handleFileSelect}
          selectedFile={activeFile}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex flex-1 items-center gap-2">
              <div className="flex flex-col flex-1">
                <h1 className="text-sm font-medium">
                  {playgroundData?.title || "Untitled Playground"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {openFiles.length} File(s) open
                  {hasUnsavedChanges && " * Unsaved Changes"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {}}
                      disabled={!activeFile || !activeFile.hasUnsavedChanges}
                    >
                      <Save className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save(Ctrl + S)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {}}
                      disabled={!hasUnsavedChanges}
                    >
                      <Save className="size-4" /> All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save All(Ctrl+Shift+S)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {}}
                      disabled={!activeFile || !activeFile.hasUnsavedChanges}
                    >
                      <Bot className="size-4" />
                      Toggle AI
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle AI</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"sm"} variant={"outline"}>
                      <Settings className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                    >
                      {isPreviewVisible ? "Hide" : "Show"} Preview
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={closeAllFiles}>
                      Close All Files
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div className="h-[calc(100vh-4rem)]">
            {openFiles.length > 0 ? (
              <div className="h-full flex flex-col">
                {/* File Tabs */}
                <div className="border-b bg-muted/30">
                  <Tabs
                    value={activeFileId || ""}
                    onValueChange={setActiveFileId}
                  >
                    <div className="flex items-center justify-between px-4 py-2">
                      <TabsList className="h-8 bg-transparent p-0">
                        {openFiles.map((file) => (
                          <TabsTrigger
                            key={file.id}
                            value={file.id}
                            className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3" />
                              <span>
                                {file.filename}.{file.fileExtension}
                              </span>
                              {file.hasUnsavedChanges && (
                                <span className="h-2 w-2 rounded-full bg-orange-500" />
                              )}
                              <span
                                className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeFile(file.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </span>
                            </div>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {openFiles.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={closeAllFiles}
                          className="h-6 px-2 text-xs"
                        >
                          Close All
                        </Button>
                      )}
                    </div>
                  </Tabs>
                </div>

                {/* Editor and Preview */}
                <div className="flex-1">
                  <ResizablePanelGroup
                    // direction="horizontal"
                    className="h-full"
                  >

                    {/* Agent code from here to */}
                    <ResizablePanel
                      defaultSize={isPreviewVisible ? 50 : 100}
                      className="flex flex-col h-full"
                    >
                      <PlaygroundEditor
                      activeFile={activeFile}
                      content={activeFile?.content || ""}
                      onContentChange={(value)=>activeFileId && updateFileContent(activeFileId, value)}/>
                      {/* <div className="h-full flex flex-col gap-2 p-4 bg-slate-950 text-slate-100">
                        <div className="flex items-center justify-between text-sm font-medium">
                          <span>
                            {activeFile
                              ? `${activeFile.filename}.${activeFile.fileExtension}`
                              : "Editor"}
                          </span>
                          {activeFile?.hasUnsavedChanges && (
                            <span className="text-orange-300">Unsaved</span>
                          )}
                        </div>
                        {activeFile ? (
                          <textarea
                            value={activeFile.content}
                            onChange={(e) =>
                              activeFileId &&
                              updateFileContent(activeFileId, e.target.value)
                            }
                            className="h-full w-full resize-none rounded-md border border-slate-700 bg-slate-900 p-3 text-xs font-mono text-slate-100 focus:border-slate-500 focus:outline-none"
                            spellCheck={false}
                          />
                        ) : (
                          <div className="flex-1 rounded-md border border-slate-700 bg-slate-900 p-4 text-sm text-slate-400">
                            Select a file from the sidebar to start editing.
                          </div>
                        )}
                      </div> */}
                    </ResizablePanel>

                    {isPreviewVisible && (
                      <>
                        <ResizableHandle />
                        <ResizablePanel
                          defaultSize={50}
                          className="overflow-hidden"
                        >
                          <div className="h-full flex flex-col p-4 gap-3 bg-slate-950 text-slate-100">
                            <div className="text-sm font-medium">Preview</div>
                            <div className="flex-1 overflow-auto rounded-md border border-slate-700 bg-slate-900 p-3 text-xs font-mono whitespace-pre-wrap break-words">
                              {activeFile?.content ||
                                "No file content available."}
                            </div>
                          </div>
                        </ResizablePanel>
                      </>
                    )}

                    {/* to here */}
                  </ResizablePanelGroup>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                <FileText className="h-16 w-16 text-gray-300" />
                <div className="text-center">
                  <p className="text-lg font-medium">No files open</p>
                  <p className="text-sm text-gray-500">
                    Select a file from the sidebar to start editing
                  </p>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </>
    </TooltipProvider>
  );
};

export default Page;
