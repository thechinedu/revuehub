import styles from "./Repo.module.css";

import Container from "@/components/Container";
import FileTree from "@/components/FileTree";
import { FolderTreeIcon } from "@/components/Icons";
import { Navbar, SubNav } from "@/components/Navbar";

import {
  FetchRepoContentsResponse,
  FetchRepoContentsSuccessResponse,
  FetchRepoErrorResponse,
  FetchRepoResponse,
  FetchRepoSuccessResponse,
  Repo,
  RepoContent,
} from "@/types";

import { cn, get } from "@/utils";

import { useQuery } from "@tanstack/react-query";

import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { MouseEvent, useState } from "react";
import Error from "next/error";
import { useRouter } from "next/router";

const fetchRepoByName = (owner: string, repo: string) =>
  get<FetchRepoResponse>(`/repositories/${owner}/${repo}`);

const fetchRepoContents = (repoID: number | undefined) => {
  if (!repoID) return Promise.resolve(null);

  return get<FetchRepoContentsResponse>(`/repositories/${repoID}/contents`);
};

const Repo: NextPage = () => {
  const router = useRouter();
  const path = router.asPath.slice(1);
  const [owner, repoName] = path.split("/");
  const [repo, setRepo] = useState<Repo | null>(null);
  const [repoContents, setRepoContents] = useState<RepoContent[]>();

  const { isError } = useQuery(
    ["repoByName"],
    () => fetchRepoByName(owner, repoName),
    {
      onSuccess: (res: FetchRepoSuccessResponse) => {
        setRepo(res.data);
      },
      enabled: router.isReady,
      retry: false,
    }
  );

  useQuery(["repoContents"], () => fetchRepoContents(repo?.id), {
    onSuccess: (res: FetchRepoContentsSuccessResponse) => {
      setRepoContents(res.data);
    },
    enabled: Boolean(repo?.id),
    retry: false,
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

  if (isError) return <Error statusCode={404} />;

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

        {repo && repoContents && (
          <FileTree
            data={repoContents}
            expanded={isFileTreeShowing}
            folderName={repoName}
            branchName={repo.default_branch}
            description={repo.description}
          />
        )}

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
