import styles from "./UserSearch.module.css";

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
      <input
        type="text"
        placeholder="Search by username or email"
        id="reviewer"
        className={styles.input}
        onChange={handleChange}
      />

      <div className={styles.results}>
        {showEmptyMessage && <p>{emptyMessage}</p>}
        <div>
          <Image
            src="https://placebeard.it/16/16/notag"
            alt=""
            width={16}
            height={16}
          />
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
