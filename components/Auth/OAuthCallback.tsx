import styles from "./Auth.module.css";

import Container from "@/components/Container";
import { Navbar } from "@/components/Navbar";

import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { post } from "@/utils";

type OAuthCallbackAttributes = {
  code: string;
  state: string;
};

const createUserViaOauth = (oauthCallbackAttributes: OAuthCallbackAttributes) =>
  post("/users/oauth/new", oauthCallbackAttributes);

export const OAuthCallback = (): JSX.Element => {
  const {
    query: { code, state },
    push,
  } = useRouter();

  const mutation = useMutation(
    () => createUserViaOauth({ code, state } as OAuthCallbackAttributes),
    {
      onError: (err) => {
        console.log("error", err);
        // TODO: redirect to sign up or sign in page depending on where the action was initially triggered
        // (server will inform client of what part of the page to redirect user to).
        // show error indicating that oauth signup failed. (pass data from this page to sign up/ sign in page)
        push("/sign-up");
      },
      onSuccess: (data) => {
        console.log("success::OAUTH", data);
        // TODO: User created
        // Redirect user to dashboard
        push("/");
      },
    }
  );

  useEffect(() => {
    mutation.mutate();
  }, []);

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
