import styles from "./Repo.module.css";

import {
  AngleDownIcon,
  AngleRightIcon,
  BookmarkIcon,
  FolderClosedIcon,
  FolderOpenedIcon,
  FolderTreeIcon,
} from "@/components/Icons";
import { cn } from "@/utils";

import Container from "@/components/Container";
import { Navbar, SubNav } from "@/components/Navbar";

import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { MouseEvent, useState } from "react";
import { useRouter } from "next/router";

const Repo: NextPage = () => {
  const router = useRouter();
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

    console.log({ directoryPath, target: evt.target });

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
        <title>RevueHub - {router.asPath.slice(1)}</title>
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

        <main className={styles.main}>
          <button
            className={styles.fileExplorerBtn}
            onClick={handleToggleFileTree("open")}
          >
            <FolderTreeIcon className={styles.icon} />
            Open file explorer
          </button>
        </main>

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
              the-afang-project
            </span>

            <span>main</span>
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
      </Container>
    </>
  );
};

export default Repo;
