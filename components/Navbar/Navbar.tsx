import styles from "./Navbar.module.css";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentPropsWithoutRef } from "react";

import type { NextPage } from "next";

type SubNavProps = ComponentPropsWithoutRef<"nav">;

export const SubNav = ({
  children,
  ...restProps
}: SubNavProps): JSX.Element => {
  return (
    <nav aria-label="Secondary navigation" {...restProps}>
      {children}
    </nav>
  );
};
// TODO: Remove
const privateRoutes: string[] = ["/dashboard", "/repos/new"];

export const Navbar: NextPage = () => {
  const router = useRouter();

  return (
    <header>
      <nav className={styles.navbar} aria-label="Main navigation">
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

        {/* TODO: show these routes based on whether a user is logged in or not */}
        {privateRoutes.includes(router.pathname) && (
          <Image
            src="https://placebeard.it/32/32/notag"
            alt=""
            width={32}
            height={32}
          />
        )}
      </nav>
    </header>
  );
};
