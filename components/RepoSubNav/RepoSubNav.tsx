import styles from "./RepoSubNav.module.css";

import { SubNav } from "@/components/Navbar";

import Link from "next/link";

type RepoSubNavProps = {
  owner: string;
  repoName: string;
};

const RepoSubNav = ({ owner, repoName }: RepoSubNavProps) => {
  return (
    <SubNav className={styles.subNav}>
      {/* TODO: Update feedback link */}
      <Link href={`/${owner}/${repoName}`}>Feedback</Link>
      <Link href={`/${owner}/${repoName}`} className={styles.active}>
        Code
      </Link>
      <Link href={`/${owner}/${repoName}/settings`}>Repo Settings</Link>
    </SubNav>
  );
};

export default RepoSubNav;
