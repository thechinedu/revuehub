import styles from "./Auth.module.css";

import Container from "@/components/Container";
import {
  AtIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  GithubIcon,
  PasswordIcon,
} from "@/components/Icons";
import { Navbar } from "@/components/Navbar";
import ProgressBar from "@/components/Progress";

import { cn, post } from "@/utils";

import Joi from "joi";

import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import zxcvbn from "zxcvbn";
import { useMutation } from "@tanstack/react-query";

enum Attributes {
  EMAIL = "email",
  USERNAME = "username",
  PASSWORD = "password",
}

type UserAttributes = {
  [Attributes.EMAIL]: string;
  [Attributes.USERNAME]: string;
  [Attributes.PASSWORD]: string;
};

const VALID_PASSWORD_SCORE = 4;

const { object, string } = Joi.types();

const userSchema = object.keys({
  email: string.email({ tlds: { allow: false } }).required(),
  username: string.pattern(/^[a-z0-9](\-?[a-z0-9])*$/).required(),
  password: string.min(8).required(),
});

// TODO: Add proper type annotation for this function's return object
const createUser = (userAttributes: UserAttributes) =>
  post<UserAttributes>("/users", userAttributes);

export const Signup = (): JSX.Element => {
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // TODO: When request is in progress, disable the signup button
  const mutation = useMutation(() => createUser(userAttributes), {
    // TODO: App proper type annotation for the err object
    // Show http error message beneath sign up button or beneath form title
    onError: (err: any) => {},
    // TODO: redirect user to dashboard (yet to be created. Redirect to homepage in the mean time)
    onSuccess: (data, _, ctx) => {
      console.log("createMutation succeeded", data, ctx);
    },
  });
  const { email, username, password } = userAttributes;
  const validationResult = userSchema.validate(userAttributes, {
    abortEarly: false,
  });
  const passwordStrength = zxcvbn(password, [email, username, "revuehub"]);
  const formHasError =
    Boolean(validationResult.error) ||
    passwordStrength.score < VALID_PASSWORD_SCORE;

  const isInvalidAttribute = (attr: Attributes) => {
    if (isDirty[attr] && attr === Attributes.PASSWORD) {
      return passwordStrength.score < VALID_PASSWORD_SCORE;
    }

    if (!validationResult.error || !isDirty[attr]) return false;

    for (const detail of validationResult.error.details) {
      if (detail.context?.key === attr) return true;
    }

    return false;
  };

  const genPasswordMessage = (): string => {
    const {
      feedback: { warning, suggestions },
      score,
    } = passwordStrength;
    let msg = "";

    if (score === VALID_PASSWORD_SCORE) return "Password is strong.";
    if (passwordStrength.score === VALID_PASSWORD_SCORE - 1)
      msg += "Almost there. Add a few more number and letters.";

    if (warning) msg += `${warning}. `;
    if (suggestions.length) msg += `${suggestions.join(", ")}.`;

    return msg;
  };

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleChange =
    (attr: Attributes) => (evt: ChangeEvent<HTMLInputElement>) => {
      setIsDirty({ ...isDirty, [attr]: true });
      const { value } = evt.target;

      setUserAttributes({ ...userAttributes, [attr]: value });
    };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    mutation.mutate();
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
                onChange={handleChange(Attributes.EMAIL)}
                className={cn(styles, {
                  isInvalid: isInvalidAttribute(Attributes.EMAIL),
                })}
                autoFocus
              />
              {isInvalidAttribute(Attributes.EMAIL) && (
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
                onChange={handleChange(Attributes.USERNAME)}
                className={cn(styles, {
                  isInvalid: isInvalidAttribute(Attributes.USERNAME),
                })}
              />
              {isInvalidAttribute(Attributes.USERNAME) && (
                <span className={styles.errorMessage}>
                  Username can only contain alphanumeric characters or single
                  hyphens, and cannot begin or end with a hyphen.
                </span>
              )}
            </div>

            <div className={styles.group}>
              <label htmlFor="password">Password:</label>
              <PasswordIcon className={styles.icon} />
              <div
                onClick={handleTogglePasswordVisibility}
                className={styles.togglePasswordVisibilityIconWrapper}
              >
                {isPasswordVisible ? (
                  <EyeSlashIcon
                    className={cn(styles, {
                      icon: true,
                      togglePasswordVisibilityIcon: true,
                    })}
                  />
                ) : (
                  <EyeIcon
                    className={cn(styles, {
                      icon: true,
                      togglePasswordVisibilityIcon: true,
                    })}
                  />
                )}
              </div>
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                placeholder="********"
                value={password}
                onChange={handleChange(Attributes.PASSWORD)}
              />

              {isDirty[Attributes.PASSWORD] && (
                <ProgressBar
                  label={genPasswordMessage()}
                  value={passwordStrength.score * 25}
                />
              )}
              {isInvalidAttribute(Attributes.PASSWORD) && (
                <span className={styles.errorMessage}>
                  Password should be a minimum of 8 characters. Passphrases are
                  recommended.
                </span>
              )}
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
