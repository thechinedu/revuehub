import styles from "./Repo.module.css";

import CodeViewer from "@/components/CodeViewer";
import Container from "@/components/Container";
import FileTree from "@/components/FileTree";
import { FolderTreeIcon } from "@/components/Icons";
import { Navbar, SubNav } from "@/components/Navbar";

import {
  FetchFileBlobContentSuccessResponse,
  FetchFileBlobResponse,
  FetchRepoContentsResponse,
  FetchRepoContentsSuccessResponse,
  FetchRepoResponse,
  FetchRepoSuccessResponse,
  Repo,
  RepoContent,
} from "@/types";

import { cn, get } from "@/utils";

import { useQuery } from "@tanstack/react-query";

import { NextPage } from "next";
import Error from "next/error";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { MouseEvent, useState } from "react";

const fetchRepoByName = (owner: string, repo: string) =>
  get<FetchRepoResponse>(`/repositories/${owner}/${repo}`);

const fetchRepoContents = (repoID: number | undefined) => {
  if (!repoID) return Promise.resolve(null);

  return get<FetchRepoContentsResponse>(`/repositories/${repoID}/contents`);
};

const fetchRepoBlobFileContents = (
  repositoryId: number,
  fileBlobId: number | null
) => {
  if (!fileBlobId) return Promise.resolve(null);

  return get<FetchFileBlobResponse>(
    `/repositories/${repositoryId}/contents/${fileBlobId}`
  );
};

const Repo: NextPage = () => {
  const router = useRouter();
  const path = router.asPath.slice(1);
  const [owner, repoName] = path.split("/");
  const [repo, setRepo] = useState<Repo | null>(null);
  const [repoContents, setRepoContents] = useState<RepoContent[]>();
  const [isFileTreeShowing, setIsFileTreeShowing] = useState(false);
  const [fileBlobInfo, setFileBlobInfo] = useState({
    fileBlobId: 0,
    filePath: "",
  });
  const [fileBlobContents, setFileBlobContents] = useState("");

  const showFileContents = Boolean(fileBlobContents.length);

  useQuery(
    ["repoBlobFileContents", fileBlobInfo.fileBlobId],
    () =>
      fetchRepoBlobFileContents(repo?.id as number, fileBlobInfo.fileBlobId),
    {
      onSuccess: (res: FetchFileBlobContentSuccessResponse) => {
        setIsFileTreeShowing(false);
        setFileBlobContents(res.data.content.trimEnd());
      },
      enabled: Boolean(fileBlobInfo.fileBlobId && repo?.id),
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const { isError } = useQuery(
    ["repoByName"],
    () => fetchRepoByName(owner, repoName),
    {
      onSuccess: (res: FetchRepoSuccessResponse) => {
        setRepo(res.data);
      },
      enabled: router.isReady,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  useQuery(["repoContents"], () => fetchRepoContents(repo?.id), {
    onSuccess: (res: FetchRepoContentsSuccessResponse) => {
      setRepoContents(res.data);
    },
    enabled: Boolean(repo?.id),
    retry: false,
    refetchOnWindowFocus: false,
  });

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
          <Link href="#">Feedback</Link>
          <Link href="/dashboard" className={styles.active}>
            Code
          </Link>
          <Link href="#">Repo Settings</Link>
        </SubNav>

        <main className={styles.main}>
          <button
            className={styles.fileExplorerBtn}
            onClick={handleToggleFileTree("open")}
          >
            <FolderTreeIcon className={styles.icon} />
            Open file explorer
          </button>

          {/* TODOS:
            Add menu above file content display ✅
            Show file path bread crumb ✅
            Use custom font for code display (fira code, source code pro etc) ✅
            Mobile: Auto close file explorer sidebar when a file is selected ✅
            Fix rendering issues with large string content ✅
            Show comment icon when code content is hovered on ✅
            Support adding multi-line comment boxes ✅
            Support removing comment-box by clicking on cancel button ✅
            Support submitting comment by clicking on add review comment button ✅

            Support adding file-level comments
            Detect language via file extension
            URL should be updated based on the currently active file (reloading page should load the last viewed file)
          */}

          <CodeViewer
            doc={fileBlobContents}
            filePath={fileBlobInfo.filePath}
            repositoryID={repo?.id}
            className={
              showFileContents
                ? styles.codeViewerWithMenu
                : styles.codeViewerWithoutMenu
            }
          />
        </main>

        {repo && repoContents && (
          <FileTree
            data={repoContents}
            expanded={isFileTreeShowing}
            repo={repo}
            onFileSelection={(fileBlobId, filePath) =>
              setFileBlobInfo({ fileBlobId, filePath })
            }
          />
        )}
      </Container>
    </>
  );
};

export default Repo;
