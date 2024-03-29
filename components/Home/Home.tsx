import styles from "./Home.module.css";

import Container from "@/components/Container";
import { GithubIcon } from "@/components/Icons";
import { Navbar } from "@/components/Navbar";

import { cn } from "@/utils";

import Head from "next/head";
import Link from "next/link";

import { OAuthButton } from "../Auth/OAuthButton";

import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          RevueHub - Review github repos without using pull requests
        </title>
      </Head>
      <Container>
        <Navbar />

        <main className={styles.main}>
          <h1>Review Github repositories without the need for pull requests</h1>
          <p>
            RevueHub provides line-by-line commenting, review and conversation
            tools that enable easy and seamless collaboration between reviewers
            and repository owners.
          </p>

          <div className={styles.newAccountFlows}>
            <Link
              href="/sign-up"
              className={cn(styles, {
                signUp: true,
                heroCta: true,
              })}
            >
              Get started
            </Link>

            <OAuthButton
              className={cn(styles, {
                heroCta: true,
                oauthBtn: true,
              })}
              provider="github"
              scope="user"
            >
              <GithubIcon className={styles.githubIcon} />
              Sign up with Github
            </OAuthButton>
          </div>
        </main>
      </Container>
    </>
  );
};

export default Home;
