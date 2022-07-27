import styles from "./Navbar.module.css";

import Link from "next/link";

import type { NextPage } from "next";

export const Navbar: NextPage = () => {
  return (
    <header>
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
          <a className={styles.tryFree}>Try for free</a>
        </Link>
      </nav>
    </header>
  );
};
