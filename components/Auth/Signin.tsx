import styles from "./Auth.module.css";

import Container from "@/components/Container";
import { Navbar } from "@/components/Navbar";
import { AccountIcon, GithubIcon, PasswordIcon } from "@/components/Icons";

import { AuthStatus, useAuth } from "@/providers/AuthProvider";

import { cn, post } from "@/utils";

import { Attributes, UserAttributes } from "@/types";

import { useMutation } from "@tanstack/react-query";

import Joi from "joi";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type UserCredentials = Pick<
  UserAttributes,
  Attributes.EMAIL | Attributes.PASSWORD
>;

const { object, string } = Joi.types();

const userCredentialsSchema = object.keys({
  email: string.email({ tlds: { allow: false } }).required(),
  password: string.required(),
});

const signinUser = (userCredentials: UserCredentials) =>
  post("/auth/login", userCredentials);

export const Signin = (): JSX.Element => {
  const { authStatus, setAuthStatus } = useAuth();
  const router = useRouter();
  const [userCredentials, setUserCredentials] = useState<UserCredentials>({
    email: "",
    password: "",
  });
  const [isMutationActive, setIsMutationActive] = useState(false);
  const [hasInvalidCredentials, setHasInvalidCredentials] = useState(false);
  const signinUserMutation = useMutation(() => signinUser(userCredentials), {
    onMutate: () => setIsMutationActive(true),
    onError: () => {
      setHasInvalidCredentials(true);
    },
    onSuccess: () => {
      setAuthStatus(AuthStatus.SIGNED_IN);
    },
    onSettled: () => setIsMutationActive(false),
  });
  const validationResult = userCredentialsSchema.validate(userCredentials, {
    abortEarly: false,
  });
  const formHasError = Boolean(validationResult.error) || isMutationActive;
  const isDisabled = formHasError;
  const isSignedIn = authStatus === AuthStatus.SIGNED_IN;

  const handleChange =
    (attr: Attributes) => (evt: ChangeEvent<HTMLInputElement>) => {
      const { value } = evt.target;
      setUserCredentials({ ...userCredentials, [attr]: value });
    };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    signinUserMutation.mutate();
  };

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn]);

  return (
    <>
      <Head>
        <title>RevueHub - Sign in</title>
      </Head>

      <Container className={styles.container}>
        <Navbar />

        <main className={styles.main}>
          <h1>Sign in to your account</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.group}>
              <label htmlFor="email-username">Email or username:</label>
              <AccountIcon className={styles.icon} />
              <input
                type="text"
                id="email-username"
                onChange={handleChange(Attributes.EMAIL)}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className={styles.group}>
              <label htmlFor="password">Password:</label>
              <PasswordIcon className={styles.icon} />
              <input
                type="password"
                id="password"
                onChange={handleChange(Attributes.PASSWORD)}
                autoComplete="current-password"
              />
              <Link href="/reset-password">
                <a className={styles.resetPassword}>Reset password?</a>
              </Link>

              {hasInvalidCredentials && (
                <span
                  className={styles.errorMessage}
                  aria-live="assertive"
                  role="alert"
                >
                  Email or Password is invalid
                </span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isDisabled}
            >
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
