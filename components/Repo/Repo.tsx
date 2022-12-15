import styles from "./Repo.module.css";

import Container from "@/components/Container";
import {
  AngleDownIcon,
  AngleRightIcon,
  BookmarkIcon,
  CodeBranchIcon,
  FolderClosedIcon,
  FolderOpenedIcon,
  FolderTreeIcon,
} from "@/components/Icons";
import { Navbar, SubNav } from "@/components/Navbar";

import {
  FetchRepoErrorResponse,
  FetchRepoSuccessResponse,
  Repo,
} from "@/types";

import { cn, get } from "@/utils";

import { useQuery } from "@tanstack/react-query";

import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const fetchRepoByName = (owner: string, repo: string) =>
  get<FetchRepoErrorResponse>(`/repositories/${owner}/${repo}`);

const fetchRepoContents = (repoID: number | undefined) => {
  if (!repoID) return Promise.resolve();

  return get(`/repositories/${repoID}/contents`);
};

const Repo: NextPage = () => {
  const router = useRouter();
  const path = router.asPath.slice(1);
  const [owner, repoName] = path.split("/");
  const [repo, setRepo] = useState<Repo | null>(null);

  useQuery(["repoByName"], () => fetchRepoByName(owner, repoName), {
    onError: (err) => {
      // TODO!: Show 404 page if repo is not found
      console.log(err);
    },
    onSuccess: (res: FetchRepoSuccessResponse) => {
      setRepo(res.data);
    },
    enabled: router.isReady,
  });

  useQuery(["repoContents"], () => fetchRepoContents(repo?.id), {
    onSuccess: (res) => {
      console.log({ res }, "repoContents");
    },
    enabled: Boolean(repo?.id),
  });
  const [isFileTreeShowing, setIsFileTreeShowing] = useState(false);
  const [directoryStatusMap, setDirectoryStatusMap] = useState(
    new Map<string, boolean>()
  );

  const handleToggleFileTree =
    (action: "open" | "close") => (evt: MouseEvent) => {
      evt.stopPropagation();

      if (action === "open") {
        setIsFileTreeShowing(true);
        return;
      }

      setIsFileTreeShowing(false);
    };

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
    <>
      <Head>
        <title>RevueHub - {path}</title>
      </Head>

      <Container
        className={cn(styles, {
          container: true,
          isFileTreeShowing,
        })}
        onClick={handleToggleFileTree("close")}
      >
        <Navbar />
        <SubNav className={styles.subNav}>
          <Link href="#">
            <a>Feedback</a>
          </Link>
          <Link href="/dashboard">
            <a className={styles.active}>Code</a>
          </Link>
          <Link href="#">
            <a>Repo Settings</a>
          </Link>
        </SubNav>

        <div
          className={cn(styles, {
            fileTree: true,
            isFileTreeShowing,
          })}
          onClick={handleToggleDirectoryStatus}
        >
          <h3 className={styles.title}>
            <span>
              <BookmarkIcon className={styles.icon} />
              {repoName}
            </span>

            <span className={styles.branchName}>
              <CodeBranchIcon className={styles.icon} /> {repo?.default_branch}
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
                  expanded: !!directoryStatusMap.get(
                    ".github/workflows/secrets"
                  ),
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

        <main className={styles.main}>
          <button
            className={styles.fileExplorerBtn}
            onClick={handleToggleFileTree("open")}
          >
            <FolderTreeIcon className={styles.icon} />
            Open file explorer
          </button>
        </main>
      </Container>
    </>
  );
};

export default Repo;
