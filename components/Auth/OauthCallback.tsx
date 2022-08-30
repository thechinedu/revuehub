import styles from "./Auth.module.css";

import Container from "@/components/Container";
import { Navbar } from "@/components/Navbar";
// import { AccountIcon, GithubIcon, PasswordIcon } from "@/components/Icons";

// import { cn } from "@/utils";

import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { post } from "@/utils";
// import Link from "next/link";

type OauthCallbackAttributes = {
  code: string;
  state: string;
};

const createUserViaOauth = (oauthCallbackAttributes: OauthCallbackAttributes) =>
  post("/users/oauth/new", oauthCallbackAttributes);

export const OauthCallback = (): JSX.Element => {
  const {
    query: { code, state },
  } = useRouter();

  const mutation = useMutation(
    () => createUserViaOauth({ code, state } as OauthCallbackAttributes),
    {
      onError: (err) => {
        console.log("error", err);
        // TODO: redirect to sign up/ sign in page
        // (server will inform client of what part of the page to redirect user to).
        // show error indicating that oauth signup failed. (pass data from this page to sign up/ sign in page)
      },
      onSuccess: (data) => {
        console.log("success", data);
        // TODO: User created
        // Redirect user to dashboard
      },
    }
  );

  useEffect(() => {
    if (code && state) mutation.mutate();
  }, [code, state]);

  return (
    <>
      <Head>
        <title>RevueHub - social login</title>
      </Head>

      <Container className={styles.container}>
        <Navbar />

        <main className={styles.main}>
          <p>Loading...</p>
        </main>
      </Container>
    </>
  );
};
