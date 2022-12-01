import styles from "./Repo.module.css";

import Container from "@/components/Container";
import { Navbar, SubNav } from "@/components/Navbar";

import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Repo: NextPage = () => {
  return (
    <>
      <Head>
        <title>RevueHub - the-afang-project</title>
      </Head>

      <Container>
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

        <main className={styles.main}>hello repo page</main>

        <div className={styles.fileTree}>
          <div className={styles.directory}>
            <p className={styles.directoryName}>.github</p>

            <div className={styles.directory}>
              <p className={styles.directoryName}>workflows</p>

              <p className={styles.directoryContent}>main.yml</p>
            </div>

            <p className={styles.directoryContent}>dependabot.yml</p>
          </div>

          <div className={styles.directory}>
            <p className={styles.directoryName}>__tests__</p>

            <p className={styles.directoryContent}>signup.spec.ts</p>
          </div>

          <p className={styles.directoryContent}>README.md</p>
        </div>
      </Container>
    </>
  );
};

export default Repo;
