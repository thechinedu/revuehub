import styles from "./Repos.module.css";

import Container from "@/components/Container";
import { GithubIcon } from "@/components/Icons";
import { Navbar } from "@/components/Navbar";

import {
  FetchReposErrorResponse,
  FetchReposSuccessResponse,
  Repo,
} from "@/types";

import { get } from "@/utils";

import { useQuery } from "@tanstack/react-query";

import Head from "next/head";
import Link from "next/link";

import { MouseEvent, useState } from "react";

import type { NextPage } from "next";

import { AddRepoDialog } from "./AddRepoDialog";

const fetchReposFromProvider = () =>
  get<FetchReposSuccessResponse | FetchReposErrorResponse>("/repositories");

type RepoSummaryProps = {
  name: string;
  description: string;
  hasPulledContent: boolean;
  onActionClick: (evt: MouseEvent<HTMLAnchorElement>) => void;
};

const RepoSummary = ({
  name,
  description,
  hasPulledContent,
  onActionClick,
}: RepoSummaryProps): JSX.Element => {
  return (
    <section className={styles.repoSummary}>
      <div className={styles.container}>
        <h3 className={styles.heading}>
          <GithubIcon className={styles.githubIcon} /> {name}
        </h3>

        <p className={styles.description}>{description}</p>

        <Link href="#">
          <a className={styles.action} onClick={onActionClick}>
            {hasPulledContent ? "Re-sync" : "Add Repo"}
          </a>
        </Link>
      </div>
    </section>
  );
};

const Repos: NextPage = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { isLoading, isSuccess } = useQuery(
    ["ownProviderRepos"],
    fetchReposFromProvider,
    {
      onError: (err) => {
        // TODO: redirect to oauth provider page to request access token
        console.log(err);
      },
      onSuccess: (data) => {
        const res = data as FetchReposSuccessResponse;
        setRepos(res.data);
      },
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  return (
    <>
      <Head>
        <title>RevueHub - Add a new repository</title>
      </Head>

      <Container>
        <Navbar />

        <main className={styles.main}>
          <section className={styles.welcome}>
            <h1>Let&apos;s get started</h1>
            <p>Import a repository from your git provider</p>
          </section>

          {isLoading && <span className={styles.pending}>Loading...</span>}

          {isSuccess && (
            <>
              {repos.length === 0 && (
                <p className={styles.noRepos}>
                  😢 No repository found. Please create a repository on GitHub
                  first
                </p>
              )}

              {repos.map(
                ({
                  id,
                  name,
                  description,
                  has_pulled_content: hasPulledContent,
                }) => (
                  <RepoSummary
                    key={id}
                    name={name}
                    description={description}
                    hasPulledContent={hasPulledContent}
                    onActionClick={() => setIsAddDialogOpen(true)}
                  />
                )
              )}

              <AddRepoDialog isOpen={isAddDialogOpen} />
            </>
          )}
        </main>
      </Container>
    </>
  );
};

export default Repos;
