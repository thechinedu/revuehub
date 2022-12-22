import styles from "./FileTree.module.css";

import {
  AngleDownIcon,
  AngleRightIcon,
  BookmarkIcon,
  CodeBranchIcon,
  FolderClosedIcon,
  FolderOpenedIcon,
} from "@/components/Icons";

import { cn } from "@/utils";

import { NextPage } from "next";

import { MouseEvent, useState } from "react";

const sampleRepositoryContents = [
  {
    id: 2,
    path: ".github",
    type: "tree",
    contents: [
      {
        id: 4,
        path: ".github/workflows",
        type: "tree",
        contents: [],
      },
    ],
  },
  {
    id: 10,
    path: "__tests__",
    type: "tree",
  },
  {
    id: 12,
    path: "db",
    type: "tree",
  },
  {
    id: 15,
    path: "migrations",
    type: "tree",
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
            contents: [],
          },
          {
            id: 37,
            path: "src/auth/validators",
            type: "tree",
            contents: [],
          },
        ],
      },
      {
        id: 40,
        path: "src/guards",
        type: "tree",
        contents: [],
      },
      {
        id: 43,
        path: "src/pipes",
        type: "tree",
        contents: [],
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
            contents: [],
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
            contents: [],
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
            contents: [],
          },
          {
            id: 70,
            path: "src/users/validators",
            type: "tree",
            contents: [],
          },
        ],
      },
    ],
  },
  {
    id: 75,
    path: "types",
    type: "tree",
    contents: [],
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
        contents: [],
      },
    ],
  },
  {
    id: 82,
    path: "utils/oauth/github-provider-strategy",
    type: "tree",
  },
  {
    id: 1,
    path: ".eslintrc.js",
    type: "blob",
  },
  {
    id: 3,
    path: ".github/dependabot.yml",
    type: "blob",
  },
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
    id: 11,
    path: "__tests__/signup.spec.ts",
    type: "blob",
  },
  {
    id: 13,
    path: "db/index.ts",
    type: "blob",
  },
  {
    id: 14,
    path: "knexfile.ts",
    type: "blob",
  },
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
  {
    id: 41,
    path: "src/guards/auth.ts",
    type: "blob",
  },
  {
    id: 42,
    path: "src/main.ts",
    type: "blob",
  },
  {
    id: 44,
    path: "src/pipes/validation.ts",
    type: "blob",
  },
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
  {
    id: 58,
    path: "src/user-auth-tokens/dto/create-auth-token-dto.ts",
    type: "blob",
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
  {
    id: 64,
    path: "src/users/dto/create-user-dto.ts",
    type: "blob",
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
    id: 76,
    path: "types/index.ts",
    type: "blob",
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
  {
    id: 81,
    path: "utils/oauth/generate-oauth-state.ts",
    type: "blob",
  },
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
  {
    id: 90,
    path: "yarn.lock",
    type: "blob",
  },
];

type FileTreeProps = {
  expanded: boolean;
  folderName: string;
  branchName: string;
};

const FileTree: NextPage<FileTreeProps> = ({
  expanded,
  branchName,
  folderName,
}) => {
  const [directoryStatusMap, setDirectoryStatusMap] = useState(
    new Map<string, boolean>()
  );

  const handleToggleDirectoryStatus = (evt: MouseEvent) => {
    evt.stopPropagation();

    const directoryPath = (evt.target as HTMLDivElement).dataset.directoryPath;

    if (!directoryPath) return;

    const directoryStatusMapAsArray = Array.from(directoryStatusMap);
    const directoryStatusMapCopy = new Map(directoryStatusMapAsArray);

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

        <span className={styles.description}>
          A computer science study tracker and plan to become a more
          well-rounded software engineer.
        </span>
      </h3>

      <div
        className={cn(styles, {
          directory: true,
          expanded: !!directoryStatusMap.get(".github"),
        })}
      >
        <p className={styles.directoryName} data-directory-path=".github">
          {directoryStatusMap.get(".github") ? (
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
          .github
        </p>

        <div
          className={cn(styles, {
            directory: true,
            expanded: !!directoryStatusMap.get(".github/workflows"),
          })}
        >
          <p
            className={styles.directoryName}
            data-directory-path=".github/workflows"
          >
            <AngleRightIcon className={styles.icon} />
            <FolderClosedIcon className={styles.icon} />
            workflows
          </p>

          <div
            className={cn(styles, {
              directory: true,
              expanded: !!directoryStatusMap.get(".github/workflows/secrets"),
            })}
          >
            <p
              className={styles.directoryName}
              data-directory-path=".github/workflows/secrets"
            >
              <AngleRightIcon className={styles.icon} />
              <FolderClosedIcon className={styles.icon} />
              secrets
            </p>

            <p className={styles.directoryContent}>values.yml</p>
          </div>

          <p className={styles.directoryContent}>main.yml</p>
        </div>

        <p className={styles.directoryContent}>dependabot.yml</p>
      </div>

      <div
        className={cn(styles, {
          directory: true,
          expanded: !!directoryStatusMap.get("__tests__"),
        })}
      >
        <p className={styles.directoryName} data-directory-path="__tests__">
          <AngleRightIcon className={styles.icon} />
          <FolderClosedIcon className={styles.icon} />
          __tests__
        </p>

        <p className={styles.directoryContent}>signup.spec.ts</p>
      </div>

      <p className={styles.directoryContent}>README.md</p>
    </div>
  );
};

export default FileTree;
