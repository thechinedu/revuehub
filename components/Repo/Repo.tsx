import styles from "./Repo.module.css";

import { FolderClosedIcon, FolderTreeIcon } from "@/components/Icons";
import { cn } from "@/utils";

import Container from "@/components/Container";
import { Navbar, SubNav } from "@/components/Navbar";

import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const Repo: NextPage = () => {
  const [isFileTreeShowing, setIsFileTreeShowing] = useState(false);

  const handleDisplayFileTree = () => setIsFileTreeShowing(true);

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
            onClick={handleDisplayFileTree}
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
        >
          <div className={styles.directory}>
            <p className={styles.directoryName}>
              <FolderClosedIcon className={styles.icon} />
              .github
            </p>

            <div className={styles.directory}>
              <p className={styles.directoryName}>
                <FolderClosedIcon className={styles.icon} />
                workflows
              </p>

              <p className={styles.directoryContent}>main.yml</p>
            </div>

            <p className={styles.directoryContent}>dependabot.yml</p>
          </div>

          <div className={styles.directory}>
            <p className={styles.directoryName}>
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
