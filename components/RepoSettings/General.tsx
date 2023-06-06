import styles from "./RepoSettings.module.css";

import Container from "@/components/Container";
import { Navbar } from "@/components/Navbar";
import RepoSubNav from "@/components/RepoSubNav";

import Head from "next/head";
import { useRouter } from "next/router";

export const General = () => {
  const router = useRouter();
  const path = router.asPath.slice(1);
  const [owner, repoName] = path.split("/");

  return (
    <>
      <Head>
        <title>RevueHub - repository settings</title>
      </Head>

      <Container className={styles.container}>
        <Navbar />

        <RepoSubNav owner={owner} repoName={repoName} active="settings" />

        <main className={styles.main}>
          <h2>Repository Settings</h2>
          <div>General settings</div>
        </main>
      </Container>
    </>
  );
};
