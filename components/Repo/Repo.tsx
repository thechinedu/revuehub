import styles from "./Repo.module.css";

import {
  AngleRightIcon,
  FolderClosedIcon,
  FolderTreeIcon,
} from "@/components/Icons";
import { cn } from "@/utils";

import Container from "@/components/Container";
import { Navbar, SubNav } from "@/components/Navbar";

import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { MouseEvent, useState } from "react";

const Repo: NextPage = () => {
  const [isFileTreeShowing, setIsFileTreeShowing] = useState(false);

  const handleToggleFileTree =
    (action: "open" | "close") => (evt: MouseEvent) => {
      evt.stopPropagation();

      if (action === "open") {
        setIsFileTreeShowing(true);
        return;
      }

      setIsFileTreeShowing(false);
    };

  return (
    <>
      <Head>
        <title>RevueHub - the-afang-project</title>
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
            File explorer
          </button>
        </main>

        <div
          className={cn(styles, {
            fileTree: true,
            isFileTreeShowing,
          })}
          onClick={handleToggleFileTree("open")}
        >
          <div className={styles.directory}>
            <p className={styles.directoryName}>
              <AngleRightIcon className={styles.icon} />
              <FolderClosedIcon className={styles.icon} />
              .github
            </p>

            <div className={styles.directory}>
              <p className={styles.directoryName}>
                <AngleRightIcon className={styles.icon} />
                <FolderClosedIcon className={styles.icon} />
                workflows
              </p>

              <div className={styles.directory}>
                <p className={styles.directoryName}>
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

          <div className={styles.directory}>
            <p className={styles.directoryName}>
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
