import styles from "./Navbar.module.css";

import { AuthStatus, useAuth } from "@/providers/AuthProvider";

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

export const Navbar: NextPage = () => {
  const { authStatus } = useAuth();
  const isSignedIn = authStatus === AuthStatus.SIGNED_IN;
  const router = useRouter();

  return (
    <header>
      <nav className={styles.navbar} aria-label="Main navigation">
        <Link href={isSignedIn ? "/dashboard" : "/"}>
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

        {isSignedIn && (
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
