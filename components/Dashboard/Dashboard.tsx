import styles from "./Dashboard.module.css";

import { OAuthButton } from "@/components/Auth/OAuthButton";
import Container from "@/components/Container";
import { GithubIcon } from "@/components/Icons";
import { Navbar, SubNav } from "@/components/Navbar";

import {
  FetchOwnActiveReposErrorResponse,
  FetchOwnActiveReposSuccessResponse,
  Repo,
} from "@/types";

import { get } from "@/utils";

import { formatDistanceToNow } from "date-fns";

import Head from "next/head";
import Link from "next/link";

import type { NextPage } from "next";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type FetchOwnActiveReposResponse =
  | FetchOwnActiveReposSuccessResponse
  | FetchOwnActiveReposErrorResponse;

const fetchOwnActiveRepos = () =>
  get<FetchOwnActiveReposResponse>("/repositories?status=active");

enum Status {
  IDLE,
  PENDING,
  ERROR,
  SUCCESS,
}

type RepoSummaryProps = {
  name: string;
  description: string;
  lastUpdated: string;
};

const RepoSummary = ({
  name,
  description,
  lastUpdated,
}: RepoSummaryProps): JSX.Element => {
  return (
    <section className={styles.repoSummary}>
      <Link href="#">
        <a className={styles.container}>
          <h3 className={styles.heading}>
            <GithubIcon className={styles.githubIcon} /> {name}
          </h3>

          {/* TODO: show full description in tooltip once this is hovered on */}
          <p className={styles.description}>{description}</p>

          <div className={styles.meta}>
            <p>
              Updated{" "}
              {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
            </p>
          </div>
        </a>
      </Link>
    </section>
  );
};

const Dashboard: NextPage = () => {
  const [mutationStatus, setMutationStatus] = useState(Status.IDLE);
  const [_, setError] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);

  const fetchOwnActiveReposMutation = useMutation(() => fetchOwnActiveRepos(), {
    onMutate: () => setMutationStatus(Status.PENDING),
    onError: (err) => {
      const errRes = err as FetchOwnActiveReposErrorResponse;
      setMutationStatus(Status.ERROR);
      setError(errRes.message as string);
    },
    onSuccess: (data) => {
      const res = data as FetchOwnActiveReposSuccessResponse;
      console.log(res);
      setMutationStatus(Status.SUCCESS);
      setRepos(res.data);
    },
  });

  useEffect(() => {
    fetchOwnActiveReposMutation.mutate();
  }, []);

  return (
    <>
      <Head>
        <title>RevueHub - Dashboard</title>
      </Head>
      <Container>
        <Navbar />

        <SubNav className={styles.subNav}>
          {/* TODO: set active style only when page is the active view */}
          <Link href="/">
            <a className={styles.active}>My repositories (66)</a>
          </Link>
          <Link href="/">
            <a>Review requested (10)</a>
          </Link>
          <Link href="/">
            <a>Settings</a>
          </Link>
        </SubNav>

        {mutationStatus === Status.PENDING && (
          <span className={styles.pending}>Loading...</span>
        )}

        {mutationStatus === Status.ERROR && (
          <span className={styles.error}>
            An error occured. Please reload the page
          </span>
        )}

        {mutationStatus === Status.SUCCESS && (
          <main className={styles.main}>
            {repos.length === 0 && (
              <section className={styles.welcome}>
                <h3 className={styles.heading}>Welcome to RevueHub</h3>
                <p className={styles.message}>
                  Repositories that you add will show up here. After a
                  repository is added, you can request reviews from other
                  RevueHub users.
                </p>
                <OAuthButton
                  className={styles.addRepo}
                  provider="github"
                  scope="repo"
                >
                  Add a new repository
                </OAuthButton>
              </section>
            )}

            {/* TODO: remove alias for last_updated once BE is updated to return the keys in camelCase */}
            {repos.map(
              ({ id, name, description, last_updated: lastUpdated }) => (
                <RepoSummary
                  key={id}
                  name={name}
                  description={description}
                  lastUpdated={lastUpdated}
                />
              )
            )}
          </main>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
