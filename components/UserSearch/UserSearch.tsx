import styles from "./UserSearch.module.css";

import { CloseIcon } from "@/components/Icons";

import Image from "next/image";

import { ChangeEvent, MouseEvent, useState } from "react";

type UserSearchProps = {
  emptyMessage?: string;
  className?: string;
};

const mockUsers = [
  {
    id: 1,
    username: "memunaharuna",
    profile_image_url: "https://placebeard.it/16/16/notag",
  },
  {
    id: 2,
    username: "thechinedu",
    profile_image_url: "https://placebeard.it/16/16/notag",
  },
  {
    id: 3,
    username: "codequec",
    profile_image_url: "https://placebeard.it/16/16/notag",
  },
  {
    id: 4,
    username: "james@example.com",
    profile_image_url: undefined,
    is_new_user: true,
  },
];

const getElemDataID = (elem: HTMLElement | SVGElement) => {
  const dataID = elem.dataset.id;

  if (dataID) return dataID;

  let parent = elem.parentElement;

  while (parent) {
    if (parent.dataset.id) return parent.dataset.id;
    parent = parent.parentElement;
  }

  throw new Error("No data-id attribute found");
};

const UserSearch = ({
  className = "",
  emptyMessage = "No reviewers selected yet.",
}: UserSearchProps): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const [queryResults, setQueryResults] = useState<typeof mockUsers>([]);
  const [values, setValues] = useState<typeof mockUsers>([]);

  const showEmptyMessage = emptyMessage && !searchQuery && !values.length;

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setSearchQuery(value);
    const queryResultsWithoutValues = mockUsers.filter(
      (user) => !values.find((value) => value.id === user.id)
    );
    if (value) setQueryResults(queryResultsWithoutValues);
    else setQueryResults([]);
  };

  const handleAddSelection = (evt: MouseEvent<HTMLDivElement>) => {
    const target = evt.target as HTMLDivElement;
    const id = getElemDataID(target);
    const user = mockUsers.find((user) => user.id === Number(id));

    if (user) {
      setValues([...values, user]);
      setSearchQuery("");
      setQueryResults([]);
    }
  };

  const handleRemoveSelection = (evt: MouseEvent<HTMLDivElement>) => {
    const target = evt.target as SVGElement;
    const id = getElemDataID(target);

    if (id) {
      const newValues = values.filter((value) => value.id !== Number(id));
      setValues(newValues);
    }
  };

  return (
    <div className={`${className} ${styles.container}`}>
      <label htmlFor="reviewer" className={styles.label}>
        Search and add reviewers:
      </label>

      <div className={styles.inputContainer}>
        <div className={styles.selectedValues} onClick={handleRemoveSelection}>
          {values.map((value) => (
            <div key={value.id} className={styles.tag}>
              {value.username}
              <CloseIcon className={styles.icon} data-id={value.id} />
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by username or email"
          id="reviewer"
          className={styles.input}
          onChange={handleChange}
          value={searchQuery}
        />
      </div>

      {showEmptyMessage && (
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      )}

      {queryResults.length === 0 && searchQuery && (
        <p className={styles.emptyMessage}>No results found.</p>
      )}

      {queryResults.length > 0 && (
        <div className={styles.results} onClick={handleAddSelection}>
          {queryResults.map((user) => (
            <div key={user.id} className={styles.result} data-id={user.id}>
              {!user.is_new_user && (
                <Image
                  // TODO: Add a default avatar image
                  src={user.profile_image_url || "/images/default-avatar.png"}
                  alt="user profile image"
                  width={16}
                  height={16}
                />
              )}

              <p>{user.username}</p>
              {user.is_new_user && (
                <p className={styles.inviteMessage}>
                  Invite &quot;{user.username}&quot; to RevueHub
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
