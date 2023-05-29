import styles from "./UserSearch.module.css";

import { CloseIcon } from "@/components/Icons";

import Image from "next/image";

import { ChangeEvent, useState } from "react";

type UserSearchProps = {
  emptyMessage?: string;
  className?: string;
};

const UserSearch = ({
  className = "",
  emptyMessage = "No reviewers selected yet.",
}: UserSearchProps): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const [values, setValues] = useState<{ id: number; value: string }[]>([]);

  const showEmptyMessage = emptyMessage && !searchQuery;

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setSearchQuery(value);
  };

  return (
    <div className={`${className} ${styles.container}`}>
      <label htmlFor="reviewer" className={styles.label}>
        Search and add reviewers:
      </label>

      <div className={styles.inputContainer}>
        <div className={styles.selectedValues}>
          <div className={styles.tag}>
            memunaharuna
            <CloseIcon className={styles.icon} />
          </div>
          <div className={styles.tag}>
            thechinedu
            <CloseIcon className={styles.icon} />
          </div>
          <div className={styles.tag}>
            blueyedgeek
            <CloseIcon className={styles.icon} />
          </div>
          <div className={styles.tag}>
            profblanda@gmail.com
            <CloseIcon className={styles.icon} />
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by username or email"
          id="reviewer"
          className={styles.input}
          onChange={handleChange}
        />
      </div>

      {showEmptyMessage && (
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      )}

      <div className={styles.results}>
        <div className={styles.result}>
          <Image
            src="https://placebeard.it/16/16/notag"
            alt=""
            width={16}
            height={16}
          />

          <p>Memuna Haruna</p>
        </div>

        <div className={styles.result}>
          <Image
            src="https://placebeard.it/16/16/notag"
            alt=""
            width={16}
            height={16}
          />

          <p>Memuna Haruna</p>
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
