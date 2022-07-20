import styles from "./Home.module.css";

import { cn } from "@/utils";
import Head from "next/head";
import Link from "next/link";

import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>
          RevueHub - Review github repos without using pull requests
        </title>
      </Head>

      <header className={styles.header}>
        <nav className={styles.navbar}>
          <Link href="/">
            <a className={styles.logo}>
              Revue<span>Hub</span>
            </a>
          </Link>

          <Link href="/sign-in">
            <a>Sign in</a>
          </Link>

          <Link href="/sign-up">
            <a className={cn(styles, { btn: true, signUp: true })}>
              Try for free
            </a>
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Review Github repositories without the need for pull requests</h1>
          <p>
            RevueHub provides line-by-line commenting, review and conversation
            tools that enable easy and seamless collaboration between reviewers
            and repository owners.
          </p>

          <div className={cn(styles, { btn: true, signUp: true })}>
            <Link href="/sign-up">
              <a>Get started</a>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
