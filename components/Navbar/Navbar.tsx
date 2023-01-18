import styles from "./Navbar.module.css";

import { AuthStatus, useAuth } from "@/providers/AuthProvider";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentPropsWithoutRef } from "react";

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

export const Navbar = (): JSX.Element => {
  const { authStatus } = useAuth();
  const isSignedIn = authStatus === AuthStatus.SIGNED_IN;
  const router = useRouter();

  return (
    <header>
      <nav className={styles.navbar} aria-label="Main navigation">
        <Link href={isSignedIn ? "/dashboard" : "/"} className={styles.logo}>
          Revue<span>Hub</span>
        </Link>

        {router.pathname === "/" && (
          <>
            <Link href="/sign-in">Sign in</Link>

            <Link href="/sign-up" className={styles.tryFree}>
              Try for free
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
