import styles from "./FileTree.module.css";

import {
  AngleDownIcon,
  AngleRightIcon,
  BookmarkIcon,
  CodeBranchIcon,
  FileIcon,
  FolderClosedIcon,
  FolderOpenedIcon,
} from "@/components/Icons";

import { Repo, RepoContent } from "@/types";

import { cn } from "@/utils";

import { MouseEvent, useState } from "react";

const generateFileTree = (
  content: RepoContent,
  directoryStatus: Map<string, boolean>
) => {
  const { id, type, path } = content;
  const segments = path.split("/");
  const name = segments[segments.length - 1];

  if (type === "blob") {
    return (
      <p
        className={styles.directoryContent}
        key={id}
        title={path}
        data-blob-id={id}
      >
        <FileIcon className={styles.icon} />
        {name}
      </p>
    );
  }
  const { contents } = content;
  const isExpanded = Boolean(directoryStatus.get(path));

  return (
    <div
      className={cn(styles, {
        directory: true,
        expanded: isExpanded,
      })}
      key={id}
      title={path}
    >
      <p className={styles.directoryName} data-directory-path={path}>
        {isExpanded ? (
          <>
            <AngleDownIcon className={styles.icon} />
            <FolderOpenedIcon className={styles.icon} />
          </>
        ) : (
          <>
            <AngleRightIcon className={styles.icon} />
            <FolderClosedIcon className={styles.icon} />
          </>
        )}
        {name}
      </p>
      {contents.map((content) => generateFileTree(content, directoryStatus))}
    </div>
  );
};

const getDirectoryPath = (elem: HTMLElement | null) => {
  while (elem) {
    if (elem.dataset.directoryPath) return elem.dataset.directoryPath;

    elem = elem.parentElement;
  }

  return "";
};

type FileTreeProps = {
  data: RepoContent[];
  expanded: boolean;
  repo: Repo;
  onFileSelection: (fileBlobId: number, path: string) => void;
};

const FileTree = ({
  data,
  expanded,
  repo,
  onFileSelection,
}: FileTreeProps): JSX.Element => {
  const { default_branch: branchName, description, id: repoId, name } = repo;
  const folderName = name.split("/")[1];
  const [directoryStatusMap, setDirectoryStatusMap] = useState(
    new Map<string, boolean>()
  );

  const handleToggleDirectoryStatus = (evt: MouseEvent) => {
    evt.stopPropagation();

    let directoryPath = (evt.target as HTMLDivElement).dataset.directoryPath;

    if (!directoryPath) {
      directoryPath = getDirectoryPath(evt.target as HTMLElement);
    }

    const directoryStatusMapCopy = new Map(directoryStatusMap);

    if (directoryStatusMapCopy.has(directoryPath)) {
      const val = directoryStatusMapCopy.get(directoryPath);
      directoryStatusMapCopy.set(directoryPath, !val);
    } else {
      directoryStatusMapCopy.set(directoryPath, true);
    }

    setDirectoryStatusMap(directoryStatusMapCopy);
  };

  const handleDisplayFileBlobContents = (evt: MouseEvent) => {
    const elem = evt.target as HTMLElement;
    const fileBlobId = elem.dataset.blobId;
    const path = elem.title;

    if (!fileBlobId) return;

    onFileSelection(+fileBlobId, path);
  };

  return (
    <div
      className={cn(styles, {
        fileTree: true,
        isFileTreeShowing: expanded,
      })}
      onClick={handleToggleDirectoryStatus}
    >
      <h3 className={styles.title}>
        <span>
          <BookmarkIcon className={styles.icon} />
          {folderName}
        </span>

        <span className={styles.branchName}>
          <CodeBranchIcon className={styles.icon} /> {branchName}
        </span>

        <span className={styles.description}>{description}</span>
      </h3>

      <div onClick={handleDisplayFileBlobContents}>
        {data.map((repositoryContent) =>
          generateFileTree(repositoryContent, directoryStatusMap)
        )}
      </div>
    </div>
  );
};

export default FileTree;
