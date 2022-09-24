import styles from "./Dashboard.module.css";

import Container from "@/components/Container";
import { Navbar, SubNav } from "@/components/Navbar";

import Head from "next/head";
import Link from "next/link";

import type { NextPage } from "next";

const Dashboard: NextPage = () => {
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
        </SubNav>

        <main className={styles.main}>
          <a href="">
            <section className={styles.repoSummary}>
              <h3 className={styles.heading}>revuehub-api</h3>

              <p className={styles.description}>
                API for the revuehub platform - Review github repositories
                without the need for pull requests
              </p>

              <div className={styles.meta}>
                <p>Typescript</p>
                <p>Updated 7 hours ago</p>
              </div>
            </section>
          </a>
        </main>
      </Container>
    </>
  );
};

export default Dashboard;
