import styles from "./Navbar.module.css";

import Link from "next/link";
import { useRouter } from "next/router";

import type { NextPage } from "next";

export const Navbar: NextPage = () => {
  const router = useRouter();

  return (
    <header>
      <nav className={styles.navbar}>
        <Link href="/">
          <a className={styles.logo}>
            Revue<span>Hub</span>
          </a>
        </Link>

        {router.pathname === "/" && (
          <>
            <Link href="/sign-in">
              <a>Sign in</a>
            </Link>

            <Link href="/sign-up">
              <a className={styles.tryFree}>Try for free</a>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};
