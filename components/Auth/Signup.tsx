import styles from "./Auth.module.css";

import Container from "@/components/Container";
import { Navbar } from "@/components/Navbar";
import {
  AtIcon,
  EnvelopeIcon,
  GithubIcon,
  PasswordIcon,
} from "@/components/Icons";

import { cn } from "@/utils";

import Joi from "joi";

import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";

type UserAttributes = {
  email: string;
  username: string;
  password: string;
};

type UserAttributeKey = keyof UserAttributes;

const { object, string } = Joi.types();

const userSchema = object.keys({
  email: string.email({ tlds: { allow: false } }).required(),
  username: string.pattern(/^[a-z0-9](\-?[a-z0-9])*$/).required(),
  password: string.min(8).required(),
});

const Signup = (): JSX.Element => {
  const [userAttributes, setUserAttributes] = useState<UserAttributes>({
    email: "",
    username: "",
    password: "",
  });
  const [isDirty, setIsDirty] = useState({
    email: false,
    username: false,
    password: false,
  });
  const { email, username, password } = userAttributes;
  const validationResult = userSchema.validate(userAttributes, {
    abortEarly: false,
  });
  const formHasError = Boolean(validationResult.error);

  console.log({ deets: validationResult.error?.details });

  const isInvalidAttribute = (attr: UserAttributeKey) => {
    if (!validationResult.error || !isDirty[attr]) return false;

    for (const detail of validationResult.error.details) {
      if (detail.context?.key === attr) return true;
    }

    return false;
  };

  const handleChange =
    (attr: UserAttributeKey) => (evt: ChangeEvent<HTMLInputElement>) => {
      setIsDirty({ ...isDirty, [attr]: true });
      const { value } = evt.target;

      setUserAttributes({ ...userAttributes, [attr]: value });
    };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    // TODO: Submit form attributes to server
    // If the server returns an error, display the error message underneath the relevant input
    // otherwise, redirect user to dashboard (yet to be created. Redirect to homepage in the mean time)
  };

  return (
    <>
      <Head>
        <title>RevueHub - Sign up</title>
      </Head>

      <Container className={styles.container}>
        <Navbar />

        <main className={styles.main}>
          <h1>Create your account</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.group}>
              <label htmlFor="email">Email:</label>
              <EnvelopeIcon className={styles.icon} />
              <input
                type="email"
                id="email"
                placeholder="memuna@example.com"
                value={email}
                onChange={handleChange("email")}
                className={cn(styles, {
                  isInvalid: isInvalidAttribute("email"),
                })}
                autoFocus
              />
              {isInvalidAttribute("email") && (
                <span className={styles.errorMessage}>
                  Email is invalid or is already in use
                </span>
              )}
            </div>

            <div className={styles.group}>
              <label htmlFor="username">Username:</label>
              <AtIcon className={styles.icon} />
              <input
                type="text"
                id="username"
                placeholder="memuna"
                value={username}
                onChange={handleChange("username")}
                className={cn(styles, {
                  isInvalid: isInvalidAttribute("username"),
                })}
              />
              {isInvalidAttribute("username") && (
                <span className={styles.errorMessage}>
                  Username can only contain alphanumeric characters or single
                  hyphens, and cannot begin or end with a hyphen.
                </span>
              )}
            </div>

            <div className={styles.group}>
              <label htmlFor="password">Password:</label>
              <PasswordIcon className={styles.icon} />
              <input
                type="password"
                id="password"
                placeholder="********"
                value={password}
                onChange={handleChange("password")}
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={formHasError}
            >
              Sign up for RevueHub
            </button>
          </form>

          <hr className={styles.divider} />

          <Link href="/sign-up">
            <a className={styles.oauthBtn}>
              <GithubIcon
                className={cn(styles, { icon: true, githubIcon: true })}
              />
              Sign up with Github
            </a>
          </Link>

          <p>
            Already have an account?{" "}
            <Link href="/sign-in">
              <a className={styles.authPage}>Sign in</a>
            </Link>
          </p>
        </main>
      </Container>
    </>
  );
};

export default Signup;
