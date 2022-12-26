import styles from "./Repo.module.css";

import Container from "@/components/Container";
import FileTree from "@/components/FileTree";
import { FolderTreeIcon } from "@/components/Icons";
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

import { MouseEvent, useState } from "react";
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

        <FileTree
          expanded={isFileTreeShowing}
          folderName={repoName}
          branchName={repo?.default_branch || "main"}
          description={repo?.description || ""}
        />

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
