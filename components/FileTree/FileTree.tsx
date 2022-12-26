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

import { RepoContent } from "@/types";

import { cn } from "@/utils";

import { NextPage } from "next";

import { MouseEvent, useState } from "react";

const sampleRepositoryContentsRes: RepoContent[] = [
  {
    id: 2,
    path: ".github",
    type: "tree",
    contents: [
      {
        id: 4,
        path: ".github/workflows",
        type: "tree",
        contents: [
          {
            id: 5,
            path: ".github/workflows/codeql-analysis.yml",
            type: "blob",
          },
          {
            id: 6,
            path: ".github/workflows/main.yml",
            type: "blob",
          },
        ],
      },
      {
        id: 3,
        path: ".github/dependabot.yml",
        type: "blob",
      },
    ],
  },
  {
    id: 10,
    path: "__tests__",
    type: "tree",
    contents: [
      {
        id: 11,
        path: "__tests__/signup.spec.ts",
        type: "blob",
      },
    ],
  },
  {
    id: 12,
    path: "db",
    type: "tree",
    contents: [
      {
        id: 13,
        path: "db/index.ts",
        type: "blob",
      },
    ],
  },
  {
    id: 15,
    path: "migrations",
    type: "tree",
    contents: [
      {
        id: 16,
        path: "migrations/20220707070815_create_users.ts",
        type: "blob",
      },
      {
        id: 17,
        path: "migrations/20220907074617_user_auth_tokens.ts",
        type: "blob",
      },
      {
        id: 18,
        path: "migrations/20221005060124_create_repositories.ts",
        type: "blob",
      },
      {
        id: 19,
        path: "migrations/20221005063856_create_repository_branches.ts",
        type: "blob",
      },
      {
        id: 20,
        path: "migrations/20221114203456_create_repository_contents.ts",
        type: "blob",
      },
      {
        id: 21,
        path: "migrations/20221116085227_create_repository_blobs.ts",
        type: "blob",
      },
    ],
  },
  {
    id: 24,
    path: "src",
    type: "tree",
    contents: [
      {
        id: 29,
        path: "src/auth",
        type: "tree",
        contents: [
          {
            id: 33,
            path: "src/auth/dto",
            type: "tree",
            contents: [
              {
                id: 34,
                path: "src/auth/dto/create-oauth-state-dto.ts",
                type: "blob",
              },
              {
                id: 35,
                path: "src/auth/dto/create-user-from-oauth-dto.ts",
                type: "blob",
              },
              {
                id: 36,
                path: "src/auth/dto/user-credentials-dto.ts",
                type: "blob",
              },
            ],
          },
          {
            id: 37,
            path: "src/auth/validators",
            type: "tree",
            contents: [
              {
                id: 38,
                path: "src/auth/validators/login.validator.ts",
                type: "blob",
              },
              {
                id: 39,
                path: "src/auth/validators/oauth-state.validator.ts",
                type: "blob",
              },
            ],
          },
          {
            id: 30,
            path: "src/auth/auth.controller.ts",
            type: "blob",
          },
          {
            id: 31,
            path: "src/auth/auth.module.ts",
            type: "blob",
          },
          {
            id: 32,
            path: "src/auth/auth.service.ts",
            type: "blob",
          },
        ],
      },
      {
        id: 40,
        path: "src/guards",
        type: "tree",
        contents: [
          {
            id: 41,
            path: "src/guards/auth.ts",
            type: "blob",
          },
        ],
      },
      {
        id: 43,
        path: "src/pipes",
        type: "tree",
        contents: [
          {
            id: 44,
            path: "src/pipes/validation.ts",
            type: "blob",
          },
        ],
      },
      {
        id: 45,
        path: "src/repositories",
        type: "tree",
        contents: [
          {
            id: 46,
            path: "src/repositories/dto",
            type: "tree",
            contents: [
              {
                id: 47,
                path: "src/repositories/dto/create-repository-blob-dto.ts",
                type: "blob",
              },
              {
                id: 48,
                path: "src/repositories/dto/create-repository-dto.ts",
                type: "blob",
              },
              {
                id: 49,
                path: "src/repositories/dto/repository-contents-dto.ts",
                type: "blob",
              },
            ],
          },
          {
            id: 50,
            path: "src/repositories/repositories.controller.ts",
            type: "blob",
          },
          {
            id: 51,
            path: "src/repositories/repositories.module.ts",
            type: "blob",
          },
          {
            id: 52,
            path: "src/repositories/repository-blob.model.ts",
            type: "blob",
          },
          {
            id: 53,
            path: "src/repositories/repository-content.model.ts",
            type: "blob",
          },
          {
            id: 54,
            path: "src/repositories/repository.model.ts",
            type: "blob",
          },
          {
            id: 55,
            path: "src/repositories/repository.service.ts",
            type: "blob",
          },
        ],
      },
      {
        id: 56,
        path: "src/user-auth-tokens",
        type: "tree",
        contents: [
          {
            id: 57,
            path: "src/user-auth-tokens/dto",
            type: "tree",
            contents: [
              {
                id: 58,
                path: "src/user-auth-tokens/dto/create-auth-token-dto.ts",
                type: "blob",
              },
            ],
          },
          {
            id: 59,
            path: "src/user-auth-tokens/user-auth-token.model.ts",
            type: "blob",
          },
          {
            id: 60,
            path: "src/user-auth-tokens/user-auth-token.module.ts",
            type: "blob",
          },
          {
            id: 61,
            path: "src/user-auth-tokens/user-auth-token.service.ts",
            type: "blob",
          },
        ],
      },
      {
        id: 62,
        path: "src/users",
        type: "tree",
        contents: [
          {
            id: 63,
            path: "src/users/dto",
            type: "tree",
            contents: [
              {
                id: 64,
                path: "src/users/dto/create-user-dto.ts",
                type: "blob",
              },
            ],
          },
          {
            id: 70,
            path: "src/users/validators",
            type: "tree",
            contents: [
              {
                id: 71,
                path: "src/users/validators/create-oauth-user.validator.ts",
                type: "blob",
              },
              {
                id: 72,
                path: "src/users/validators/create-user.validator.ts",
                type: "blob",
              },
            ],
          },
          {
            id: 65,
            path: "src/users/user.model.ts",
            type: "blob",
          },
          {
            id: 66,
            path: "src/users/user.serializer.ts",
            type: "blob",
          },
          {
            id: 67,
            path: "src/users/user.service.ts",
            type: "blob",
          },
          {
            id: 68,
            path: "src/users/users.controller.ts",
            type: "blob",
          },
          {
            id: 69,
            path: "src/users/users.module.ts",
            type: "blob",
          },
        ],
      },
      {
        id: 25,
        path: "src/app.controller.spec.ts",
        type: "blob",
      },
      {
        id: 26,
        path: "src/app.controller.ts",
        type: "blob",
      },
      {
        id: 27,
        path: "src/app.module.ts",
        type: "blob",
      },
      {
        id: 28,
        path: "src/app.service.ts",
        type: "blob",
      },
      {
        id: 42,
        path: "src/main.ts",
        type: "blob",
      },
    ],
  },
  {
    id: 75,
    path: "types",
    type: "tree",
    contents: [
      {
        id: 76,
        path: "types/index.ts",
        type: "blob",
      },
    ],
  },
  {
    id: 77,
    path: "utils",
    type: "tree",
    contents: [
      {
        id: 80,
        path: "utils/oauth",
        type: "tree",
        contents: [
          {
            id: 82,
            path: "utils/oauth/github-provider-strategy",
            type: "tree",
            contents: [
              {
                id: 83,
                path: "utils/oauth/github-provider-strategy/get-repo-contents.ts",
                type: "blob",
              },
              {
                id: 84,
                path: "utils/oauth/github-provider-strategy/get-repo-file-content.ts",
                type: "blob",
              },
              {
                id: 85,
                path: "utils/oauth/github-provider-strategy/get-user-info.ts",
                type: "blob",
              },
              {
                id: 86,
                path: "utils/oauth/github-provider-strategy/get-user-repos.ts",
                type: "blob",
              },
              {
                id: 87,
                path: "utils/oauth/github-provider-strategy/index.ts",
                type: "blob",
              },
            ],
          },
          {
            id: 81,
            path: "utils/oauth/generate-oauth-state.ts",
            type: "blob",
          },
          {
            id: 88,
            path: "utils/oauth/index.ts",
            type: "blob",
          },
          {
            id: 89,
            path: "utils/oauth/oauth-provider.ts",
            type: "blob",
          },
        ],
      },
      {
        id: 78,
        path: "utils/auth.ts",
        type: "blob",
      },
      {
        id: 79,
        path: "utils/index.ts",
        type: "blob",
      },
    ],
  },
  {
    id: 1,
    path: ".eslintrc.js",
    type: "blob",
  },
  {
    id: 7,
    path: ".gitignore",
    type: "blob",
  },
  {
    id: 8,
    path: ".prettierrc",
    type: "blob",
  },
  {
    id: 9,
    path: "README.md",
    type: "blob",
  },
  {
    id: 14,
    path: "knexfile.ts",
    type: "blob",
  },
  {
    id: 22,
    path: "nest-cli.json",
    type: "blob",
  },
  {
    id: 23,
    path: "package.json",
    type: "blob",
  },
  {
    id: 73,
    path: "tsconfig.build.json",
    type: "blob",
  },
  {
    id: 74,
    path: "tsconfig.json",
    type: "blob",
  },
  {
    id: 90,
    path: "yarn.lock",
    type: "blob",
  },
];

const generateFileTree = (
  content: RepoContent,
  directoryStatus: Map<string, boolean>
) => {
  const { id, type, path } = content;
  const segments = path.split("/");
  const name = segments[segments.length - 1];

  if (type === "blob") {
    return (
      <p className={styles.directoryContent} key={id} title={path}>
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
  expanded: boolean;
  folderName: string;
  branchName: string;
  description: string;
};

const FileTree: NextPage<FileTreeProps> = ({
  expanded,
  branchName,
  folderName,
  description,
}) => {
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

      {sampleRepositoryContentsRes.map((repositoryContent) =>
        generateFileTree(repositoryContent, directoryStatusMap)
      )}
    </div>
  );
};

export default FileTree;
