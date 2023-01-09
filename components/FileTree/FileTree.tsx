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

import { cn, get } from "@/utils";

import { NextPage } from "next";

import { MouseEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";

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

const fetchRepoBlobFileContents = (
  repositoryId: number,
  fileBlobId: number | null
) => {
  if (!fileBlobId) return Promise.resolve(null);

  return get(`/repositories/${repositoryId}/contents/${fileBlobId}`);
};

type FileTreeProps = {
  data: RepoContent[];
  expanded: boolean;
  repo: Repo;
};

const FileTree: NextPage<FileTreeProps> = ({ data, expanded, repo }) => {
  const { default_branch: branchName, description, id: repoId, name } = repo;
  const folderName = name.split("/")[1];
  const [directoryStatusMap, setDirectoryStatusMap] = useState(
    new Map<string, boolean>()
  );
  const [fileBlobId, setFileBlobId] = useState<number | null>(null);

  useQuery(
    ["repoBlobFileContents", fileBlobId],
    () => fetchRepoBlobFileContents(repoId, fileBlobId),
    {
      onSuccess: (res) => {
        console.log((res as any).data.content);
      },
      enabled: Boolean(fileBlobId),
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
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
    const fileBlobId = (evt.target as HTMLElement).dataset.blobId;

    if (!fileBlobId) return;

    setFileBlobId(+fileBlobId);
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
