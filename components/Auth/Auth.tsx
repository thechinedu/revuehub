import styles from "./Auth.module.css";

import Container from "@/components/Container";
import { Navbar } from "@/components/Navbar";
import {
  AtIcon,
  EnvelopeIcon,
  GithubIcon,
  PasswordIcon,
} from "@/components/Icons";

import { cn } from "@/utils";

import Head from "next/head";
import Link from "next/link";

import type { NextPage } from "next";

const Auth: NextPage = () => {
  return (
    <>
      <Head>
        <title>RevueHub - Sign up</title>
      </Head>

      <Container className={styles.container}>
        <Navbar />

        <main className={styles.main}>
          <h1>Create your account</h1>

          <form className={styles.form}>
            <div className={styles.group}>
              <label htmlFor="email">Email:</label>
              <EnvelopeIcon className={styles.icon} />
              <input type="email" id="email" placeholder="memuna@example.com" />
            </div>

            <div className={styles.group}>
              <label htmlFor="username">Username:</label>
              <AtIcon className={styles.icon} />
              <input type="text" id="username" placeholder="memuna" />
            </div>

            <div className={styles.group}>
              <label htmlFor="password">Password:</label>
              <PasswordIcon className={styles.icon} />
              <input type="password" id="password" placeholder="********" />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Sign up for RevueHub
            </button>
          </form>

          <hr className={styles.divider} />

          <Link href="/sign-up">
            <a className={styles.oauthBtn}>
              <GithubIcon
                className={cn(styles, { icon: true, githubIcon: true })}
              />
              Sign up with Github
            </a>
          </Link>
        </main>
      </Container>
    </>
  );
};

export default Auth;
