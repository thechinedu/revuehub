import styles from "./Auth.module.css";

import { Navbar } from "@/components/Navbar";
import {
  AtIcon,
  EnvelopeIcon,
  GithubIcon,
  PasswordIcon,
} from "@/components/Icons";

import Head from "next/head";
import Link from "next/link";

import type { NextPage } from "next";

const Auth: NextPage = () => {
  return (
    <>
      <Head>
        <title>RevueHub - Sign up</title>
      </Head>

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

        <hr />

        <Link href="/sign-up">
          <a>
            <GithubIcon className={styles.githubIcon} />
            Sign up with Github
          </a>
        </Link>
      </main>
    </>
  );
};

export default Auth;
