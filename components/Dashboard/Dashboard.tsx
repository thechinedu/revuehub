import styles from "./Dashboard.module.css";

import { OAuthButton } from "@/components/Auth/OAuthButton";
import Container from "@/components/Container";
import { GithubIcon } from "@/components/Icons";
import { Navbar, SubNav } from "@/components/Navbar";

import {
  FetchOwnActiveReposErrorResponse,
  FetchOwnActiveReposSuccessResponse,
} from "@/types";

import { get } from "@/utils";

import Head from "next/head";
import Link from "next/link";

import type { NextPage } from "next";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

type FetchOwnActiveReposResponse =
  | FetchOwnActiveReposSuccessResponse
  | FetchOwnActiveReposErrorResponse;

const fetchOwnActiveRepos = () =>
  get<FetchOwnActiveReposSuccessResponse | FetchOwnActiveReposErrorResponse>(
    "/repositories?active=true"
  );

const Dashboard: NextPage = () => {
  const fetchOwnActiveReposMutation = useMutation(() => fetchOwnActiveRepos(), {
    // onMutate: () => setIsMutationActive(true),
    onError: (err: FetchOwnActiveReposErrorResponse) => {
      console.log(err);
      // setError(err.data);
    },
    onSuccess: (data) => {
      const res = data as FetchOwnActiveReposSuccessResponse;
      console.log(res);
    },
    // onSettled: () => setIsMutationActive(false),
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

        <main className={styles.main}>
          {/* <section className={styles.welcome}>
            <h3 className={styles.heading}>Welcome to RevueHub</h3>
            <p className={styles.message}>
              Repositories that you add will show up here. After a repository is
              added, you can request reviews from other RevueHub users.
            </p>
            <OAuthButton
              className={styles.addRepo}
              provider="github"
              scope="repo"
            >
              Add a new repository
            </OAuthButton>
          </section> */}
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

          <section className={styles.repoSummary}>
            <Link href="#">
              <a className={styles.container}>
                <h3 className={styles.heading}>
                  <GithubIcon className={styles.githubIcon} />{" "}
                  thechinedu/revuehub-api
                </h3>

                <p className={styles.description}>
                  API for the revuehub platform - Review github repositories
                  without the need for pull requests
                </p>

                <div className={styles.meta}>
                  <p>Updated 7 hours ago</p>
                </div>
              </a>
            </Link>
          </section>
          <section className={styles.repoSummary}>
            <Link href="#">
              <a className={styles.container}>
                <h3 className={styles.heading}>
                  <GithubIcon className={styles.githubIcon} />{" "}
                  thechinedu/dialogcore
                </h3>

                <p className={styles.description}>Source code for DialogCore</p>

                <div className={styles.meta}>
                  <p>Updated 7 hours ago</p>
                </div>
              </a>
            </Link>
          </section>
        </main>
      </Container>
    </>
  );
};

export default Dashboard;
