import styles from "./RepoSettings.module.css";

import Container from "@/components/Container";
import { Navbar } from "@/components/Navbar";
import RepoSubNav from "@/components/RepoSubNav";
import { AngleLeftIcon } from "@/components/Icons";

import { cn } from "@/utils";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

import { useState } from "react";

import { AddReviewerDialog } from "./AddReviewerDialog";

export const Reviewers = () => {
  const router = useRouter();
  const path = router.asPath.slice(1);
  const [owner, repoName] = path.split("/");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Head>
        <title>RevueHub - repository settings - Manage reviewers</title>
      </Head>

      <Container className={styles.container}>
        <Navbar />

        <RepoSubNav owner={owner} repoName={repoName} active="settings" />

        <main className={styles.main}>
          <h2>Repository Settings</h2>
          <Link
            href={`/${owner}/${repoName}/settings`}
            className={styles.backlink}
          >
            <AngleLeftIcon className={styles.icon} /> Back
          </Link>
          <div className={styles.settingsContainer}>
            <h3>
              Manage Reviewers
              <button
                className={styles.btn}
                onClick={() => setIsDialogOpen(true)}
              >
                Add reviewers
              </button>
            </h3>

            {/* <div className={styles.noReviewers}>
              <p>No reviewers added yet.</p>
              <button className={styles.btn}>Add reviewers</button>
            </div> */}

            <div className={styles.reviewers}>
              <div className={styles.reviewer}>
                <div className={styles.userInfo}>
                  <Image
                    // TODO: Add a default avatar image
                    src={
                      "http://placebeard.it/32/32/notag" ||
                      "/images/default-avatar.png"
                    }
                    alt="user profile image"
                    width={32}
                    height={32}
                  />

                  <p>JohnDoe</p>
                </div>

                {/* <p>Pending invite</p> */}

                <button className={cn(styles, { btn: true, removeBtn: true })}>
                  Remove
                </button>
              </div>
              <div className={styles.reviewer}>
                <div className={styles.userInfo}>
                  <Image
                    // TODO: Add a default avatar image
                    src={
                      "http://placebeard.it/32/32/notag" ||
                      "/images/default-avatar.png"
                    }
                    alt="user profile image"
                    width={32}
                    height={32}
                  />

                  <p>JohnDoe</p>
                </div>

                {/* <p>Pending invite</p> */}

                <button className={cn(styles, { btn: true, removeBtn: true })}>
                  Remove
                </button>
              </div>
            </div>
          </div>

          <AddReviewerDialog
            name={repoName}
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
            }}
          />
        </main>
      </Container>
    </>
  );
};
