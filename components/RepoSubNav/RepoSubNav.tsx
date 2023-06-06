import styles from "./RepoSubNav.module.css";

import { SubNav } from "@/components/Navbar";

import Link from "next/link";
import { cn } from "@/utils";

type RepoSubNavProps = {
  owner: string;
  repoName: string;
  active: "feedback" | "code" | "settings";
};

const RepoSubNav = ({ owner, repoName, active }: RepoSubNavProps) => {
  return (
    <SubNav className={styles.subNav}>
      {/* TODO: Update feedback link */}
      <Link
        href={`/${owner}/${repoName}`}
        className={cn(styles, {
          active: active === "feedback",
        })}
      >
        Feedback
      </Link>
      <Link
        href={`/${owner}/${repoName}`}
        className={cn(styles, {
          active: active === "code",
        })}
      >
        Code
      </Link>
      <Link
        href={`/${owner}/${repoName}/settings`}
        className={cn(styles, {
          active: active === "settings",
        })}
      >
        Repo Settings
      </Link>
    </SubNav>
  );
};

export default RepoSubNav;
