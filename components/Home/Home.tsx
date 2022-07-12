import styles from "./Home.module.css";
import landingIllustration from "@/public/pair-programming.svg";

import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>
          RevueHub - Review github repos without using pull requests
        </title>
      </Head>

      <header>
        <nav>
          <Link href="/">
            <a>
              Revue<span>Hub</span>
            </a>
          </Link>

          <div>
            <Link href="/sign-in">
              <a>Sign in</a>
            </Link>

            <Link href="/sign-up">
              <a>Sign up</a>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section>
          <Image src={landingIllustration} alt="" />
          <h1>Review Github repositories without the need for pull requests</h1>
          <p>
            RevueHub provides line-by-line commenting, review and conversation
            tools that enable easy and seamless collaboration between reviewers
            and repository owners.
          </p>

          <Link href="/sign-up">
            <a>Get started</a>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
