import styles from "./Repos.module.css";

import Container from "@/components/Container";
import { GithubIcon } from "@/components/Icons";
import { Navbar } from "@/components/Navbar";

import Head from "next/head";
import Link from "next/link";

import type { NextPage } from "next";

const Repos: NextPage = () => {
  return (
    <>
      <Head>
        <title>RevueHub - Add new repository</title>
      </Head>
      <Container>
        <Navbar />

        <main className={styles.main}>
          <section className={styles.welcome}>
            <h1>Let&apos;s get started</h1>
            <p>Import a repository from your git provider</p>
          </section>

          <section className={styles.repoSummary}>
            <div className={styles.container}>
              <h3 className={styles.heading}>
                <GithubIcon className={styles.githubIcon} />{" "}
                thechinedu/revuehub-api
              </h3>

              <p className={styles.description}>
                API for the revuehub platform - Review github repositories
                without the need for pull requests
              </p>

              <Link href="#">
                <a className={styles.action}>Add repo</a>
              </Link>
            </div>
          </section>
          <section className={styles.repoSummary}>
            <div className={styles.container}>
              <h3 className={styles.heading}>
                <GithubIcon className={styles.githubIcon} />{" "}
                thechinedu/dialogcore
              </h3>

              <p className={styles.description}>Source code for DialogCore</p>

              <Link href="#">
                <a className={styles.action}>Re-sync</a>
              </Link>
            </div>
          </section>
        </main>
      </Container>
    </>
  );
};

export default Repos;
