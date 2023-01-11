import styles from "./Auth.module.css";

import Container from "@/components/Container";
import { Navbar } from "@/components/Navbar";
import { EnvelopeIcon } from "@/components/Icons";

import { cn } from "@/utils";

import Head from "next/head";
import Link from "next/link";

export const ResetPassword = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>RevueHub - Reset password</title>
      </Head>

      <Container className={styles.container}>
        <Navbar />

        <main
          className={cn(styles, {
            main: true,
            accountReset: true,
          })}
        >
          <h1>Reset your password</h1>

          <form className={styles.form}>
            <div className={styles.group}>
              <label htmlFor="email">Email:</label>
              <EnvelopeIcon className={styles.icon} />
              <input type="email" id="email" placeholder="memuna@example.com" />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Send reset link
            </button>
          </form>

          <Link href="/sign-in" className={styles.authPage}>
            Back to sign in
          </Link>
        </main>
      </Container>
    </>
  );
};
