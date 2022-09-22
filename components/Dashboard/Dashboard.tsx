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
            <a className={styles.active}>My Repositories</a>
          </Link>
          <Link href="/">
            <a>Review requested</a>
          </Link>
        </SubNav>

        <main className={styles.main}></main>
      </Container>
    </>
  );
};

export default Dashboard;
