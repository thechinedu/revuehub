import styles from "./Dashboard.module.css";

import { OAuthButton } from "@/components/Auth/OAuthButton";
import Container from "@/components/Container";
import { GithubIcon } from "@/components/Icons";
import { Navbar, SubNav } from "@/components/Navbar";

import {
  FetchReposErrorResponse,
  FetchReposSuccessResponse,
  Repo,
} from "@/types";

import { get } from "@/utils";

import { useQuery } from "@tanstack/react-query";

import { formatDistanceToNow } from "date-fns";

import Head from "next/head";
import Link from "next/link";

import { useState } from "react";

import type { NextPage } from "next";

type FetchOwnActiveReposResponse =
  | FetchReposSuccessResponse
  | FetchReposErrorResponse;

const fetchOwnActiveRepos = () =>
  get<FetchOwnActiveReposResponse>("/repositories?status=active");

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
  const [_, setError] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);

  const { isLoading, isError, isSuccess } = useQuery(
    ["ownActiveRepos"],
    fetchOwnActiveRepos,
    {
      onError: (err) => {
        // TODO: remove onError lifecycle method if error message is not going to be shown to user.
        const errRes = err as FetchReposErrorResponse;
        setError(errRes.message as string);
      },
      onSuccess: (data) => {
        const res = data as FetchReposSuccessResponse;
        setRepos(res.data);
      },
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return (
    <>
      <Head>
        <title>RevueHub - Dashboard</title>
      </Head>
      <Container>
        <Navbar />

        <SubNav className={styles.subNav}>
          {/* TODO: set active style only when page is the active view */}
          <Link href="/dashboard">
            <a className={styles.active}>
              My repositories {repos.length ? `(${repos.length})` : ""}
            </a>
          </Link>
          <Link href="#">
            <a>Review requested (10)</a>
          </Link>
          <Link href="#">
            <a>Settings</a>
          </Link>
        </SubNav>

        {isLoading && <span className={styles.pending}>Loading...</span>}

        {isError && (
          <span className={styles.error}>
            An error occured. Please reload the page
          </span>
        )}

        {isSuccess && (
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

            {repos.length > 0 && (
              <div className={styles.pageActionContainer}>
                <input
                  type="search"
                  placeholder="Search repositories"
                  className={styles.search}
                  aria-label="Search repositories"
                />
                <Link href="/repos/new">
                  <a className={styles.addRepo}>Add new repository</a>
                </Link>
              </div>
            )}

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
