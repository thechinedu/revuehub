import styles from "./Home.module.css";

import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

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
        </nav>
      </header>
    </div>
  );
};

export default Home;
