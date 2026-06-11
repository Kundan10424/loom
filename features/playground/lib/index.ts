import { TemplateFile , TemplateFolder} from "../types";

export function findFilePath(
    file: TemplateFile,
    folder: TemplateFolder,
    pathSoFar: string[] =[]
): string | null {
    for (const item of folder.items){
        if('folderName' in item){
            const res = findFilePath(file, item, [...pathSoFar, item.folderName]);
            if(res) return res;
        } else {
            if(
                item.fileName=== file.fileName && 
                item.fileExtension === file.fileExtension
            ){
                return [
                    ...pathSoFar,
                    item.fileName + (item.fileExtension ? "." + item.fileExtension : ""),
                ].join('/')
            }
        }
    }
    return null
}

export const generateFileId = (file: TemplateFile, rootFolder: TemplateFolder): string => {
    const path = findFilePath(file, rootFolder)?.replace(/^\/+/, '') || '';

    const extension = file.fileExtension?.trim();
    const extensionSuffix = extension ? `.${extension}` : '';

    return path
        ? `${path}/${file.fileName}${extensionSuffix}`
        : `${file.fileName}${extensionSuffix}`;
}