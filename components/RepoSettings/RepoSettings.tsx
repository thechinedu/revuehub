import styles from "./RepoSettings.module.css";

import Container from "@/components/Container";
import { Navbar, SubNav } from "@/components/Navbar";
import RepoSubNav from "@/components/RepoSubNav";

import Head from "next/head";
import { useRouter } from "next/router";

const RepoSettings = () => {
  const router = useRouter();
  const path = router.asPath.slice(1);
  const [owner, repoName] = path.split("/");

  return (
    <>
      <Head>
        <title>RevueHub - repository settings</title>
      </Head>

      <Container>
        <Navbar />

        <RepoSubNav owner={owner} repoName={repoName} />
        <div>Welcome to the settings page</div>
      </Container>
    </>
  );
};

export default RepoSettings;
