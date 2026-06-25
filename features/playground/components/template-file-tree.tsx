"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { FilePlus2, FolderPlus, PlusCircle } from "lucide-react";
import TemplateNode from "./template-node";
import { FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@base-ui/react";
import { Button } from "@/components/ui/button";

interface TemplateFile {
  filename: string;
  fileExtension: string;
  content: string;
}

interface TemplateFolder {
  folderName: string;
  items: (TemplateFile | TemplateFolder)[];
}

type TemplateItem = TemplateFile | TemplateFolder;

interface TemplateFileTreeProps {
  data: TemplateItem;
  onFileSelect?: (file: TemplateFile) => void;
  selectedFile?: TemplateFile;
  title?: string;
  onAddFile?: (file: TemplateFile, parentPath: string) => void;
  onAddFolder?: (folder: TemplateFolder, parentPath: string) => void;
  onDeleteFile?: (file: TemplateFile, parentPath: string) => void;
  onDeleteFolder?: (folder: TemplateFolder, parentPath: string) => void;
  onRenameFile?: (
    file: TemplateFile,
    newFileName: string,
    newExtension: string,
    parentPath: string,
  ) => void;
  onRenameFolder?: (
    folder: TemplateFolder,
    newFolderName: string,
    parentPath: string,
  ) => void;
}

const TemplateFileTree = ({
  data,
  onFileSelect,
  selectedFile,
  title = "file explorer",
  onAddFile,
  onAddFolder,
  onDeleteFile,
  onDeleteFolder,
  onRenameFile,
  onRenameFolder,
}: TemplateFileTreeProps) => {
  const isRootFolder = data && typeof data === "object" && "folderName" in data;
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);

  const handleAddRootFile = () => {
    setIsNewFileDialogOpen(true);
  };

  const handleAddRootFolder = () => {
    setIsNewFolderDialogOpen(true);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{title}</SidebarGroupLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarGroupAction>
                <PlusCircle className="h-4 w-4" />
              </SidebarGroupAction>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent
                align="end"
                className="z-50 bg-background border shadow-md"
              >
                <DropdownMenuItem onClick={() => {handleAddRootFile()}}>
                  <FilePlus2 className="h-4 w-4 mr-2" />
                  New File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {handleAddRootFolder()}}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>

                <SidebarGroupContent>
                  <SidebarMenu>
                    {isRootFolder ? (
                      (data as TemplateFolder).items.map((child, index) => (
                        <TemplateNode
                          key={index}
                          item={child}
                          onFileSelect={onFileSelect}
                          selectedFile={selectedFile}
                          level={0}
                          path=""
                          onAddFile={onAddFile}
                          onAddFolder={onAddFolder}
                          onDeleteFile={onDeleteFile}
                          onDeleteFolder={onDeleteFolder}
                          onRenameFile={onRenameFile}
                          onRenameFolder={onRenameFolder}
                        />
                      ))
                    ) : (
                      <TemplateNode
                        item={data}
                        onFileSelect={onFileSelect}
                        selectedFile={selectedFile}
                        level={0}
                        path=""
                        onAddFile={onAddFile}
                        onAddFolder={onAddFolder}
                        onDeleteFile={onDeleteFile}
                        onDeleteFolder={onDeleteFolder}
                        onRenameFile={onRenameFile}
                        onRenameFolder={onRenameFolder}
                      />
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
            <NewFileDialog
              isOpen={isNewFileDialogOpen}
              onClose={() => {
                setIsNewFileDialogOpen(false);
              }}
              onCreateFile={() => {}}
            />

            <NewFolderDialog
              isOpen={isNewFolderDialogOpen}
              onClose={() => {
                setIsNewFolderDialogOpen(false);
              }}
              onCreateFolder={() => {}}
            />
          </Sidebar>
  );
};

export default TemplateFileTree;

interface NewFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFile: (filename: string, extension: string) => void;
}

export function NewFileDialog({ isOpen, onClose, onCreateFile }: NewFileDialogProps) {
  const [filename, setFilename] = useState("");
  const [extension, setExtension] = useState("js");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (filename.trim()) {
      onCreateFile(filename.trim(), extension.trim() || "js");
      setFilename("");
      setExtension("js");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
          <DialogDescription>
            Enter a name for the new file& select its extension
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="filename" className="text-right">
                FileName
              </Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="col-span-2"
                autoFocus
                placeholder="main"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="extension" className="text-right">
                Extension
              </Label>
              <Input
                id="extension"
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
                className="col-span-2"
                placeholder="js"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" disabled={!filename.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface NewFolderDialogProps{
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string) => void;
}

export function NewFolderDialog({ isOpen, onClose, onCreateFolder }: NewFolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreateFolder(folderName.trim());
      setFolderName("");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Enter a name for the new folder
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="folderName" className="text-right">
                Folder Name
              </Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="col-span-2"
                autoFocus
                placeholder="my-folder"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" disabled={!folderName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface RenameFileDialogProps{
  isOpen: boolean;
  onClose: () => void;
  file: TemplateFile;
  onRenameFile: (newFileName: string, newExtension: string) => void;
  currentFolderName: string
}

export function RenameFileDialog({ isOpen, onClose, file, onRenameFile , currentFolderName}: RenameFileDialogProps) {
  const [filename, setFilename] = useState(file.filename);
  const [extension, setExtension] = useState(file.fileExtension);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (filename.trim()) {
      onRenameFile(filename.trim(), extension.trim() || "js");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
          <DialogDescription>
            Update the file name and extension
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="filename" className="text-right">
                FileName
              </Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="col-span-2"
                autoFocus
                placeholder="main"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="extension" className="text-right">
                Extension
              </Label>
              <Input
                id="extension"
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
                className="col-span-2"
                placeholder="js"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" disabled={!filename.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface RenameFolderDialogProps{
  isOpen: boolean;
  onClose: () => void;
  onRename: (newFolderName: string) => void;
  currentFolder: string;
}

export function RenameFolderDialog({ isOpen, onClose, currentFolder, onRename }: RenameFolderDialogProps) {
  const [folderName, setFolderName] = useState(currentFolder);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onRename(folderName.trim());
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
          <DialogDescription>
            Update the folder name
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="folderName" className="text-right">
                Folder Name
              </Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="col-span-2"
                autoFocus
                placeholder="my-folder"
              />
            </div>
          </div>
           <DialogFooter>
             <Button type="button" variant="outline" onClick={onClose}>
               Cancel
             </Button>
             <Button type="button" disabled={!folderName.trim()}>
               Rename
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

