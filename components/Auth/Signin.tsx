import styles from "./Auth.module.css";

import Container from "@/components/Container";
import { Navbar } from "@/components/Navbar";
import {
  AccountIcon,
  EnvelopeIcon,
  GithubIcon,
  PasswordIcon,
} from "@/components/Icons";

import { cn } from "@/utils";

import Head from "next/head";
import Link from "next/link";

const Signin = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>RevueHub - Sign in</title>
      </Head>

      <Container className={styles.container}>
        <Navbar />

        <main className={styles.main}>
          <h1>Sign in to your account</h1>

          <form className={styles.form}>
            <div className={styles.group}>
              <label htmlFor="email-username">Email or username:</label>
              <AccountIcon className={styles.icon} />
              <input type="text" id="email-username" autoFocus />
            </div>

            <div className={styles.group}>
              <label htmlFor="password">Password:</label>
              <PasswordIcon className={styles.icon} />
              <input type="password" id="password" />
              <Link href="/reset-password">
                <a className={styles.resetPassword}>Reset password?</a>
              </Link>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Continue to RevueHub
            </button>
          </form>

          <hr className={styles.divider} />

          <Link href="/sign-up">
            <a className={styles.oauthBtn}>
              <GithubIcon
                className={cn(styles, { icon: true, githubIcon: true })}
              />
              Continue with Github
            </a>
          </Link>

          <p>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up">
              <a className={styles.authPage}>Sign up</a>
            </Link>
          </p>
        </main>
      </Container>
    </>
  );
};

export default Signin;
