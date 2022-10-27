import { get, post } from "@/utils";
import { useQuery } from "@tanstack/react-query";

import { createContext, FC, ReactNode, useContext, useState } from "react";

type AuthContextProps = {
  isSignedIn: boolean;
};

const AuthContext = createContext<AuthContextProps | null>(null);

const { Provider } = AuthContext;

const fetchCurrentUser = () => get("/auth/me");

const refreshAuthToken = () => post("/auth/refresh", {});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { isLoading: isLoadingCurrentUser, isError: isErrorCurrentUser } =
    useQuery(["currentUser"], fetchCurrentUser, {
      onError: () => {
        console.log("failed to fetch current user, refreshing auth token...");
      },
      onSuccess: () => {
        console.log("successfully fetched current user");
        setIsSignedIn(true);
      },
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  const { isFetching: isFetchingRefreshToken } = useQuery(
    ["refreshToken"],
    refreshAuthToken,
    {
      onError: () => {
        console.log("refreshToken failed. user is logged out");
        setIsSignedIn(false);
      },
      onSuccess: () => {
        setIsSignedIn(true);
      },
      enabled: isErrorCurrentUser,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  let PageComponent;

  if (isLoadingCurrentUser || isFetchingRefreshToken) {
    PageComponent = <>Loading...</>; // TODO: Make this a proper reusable component
  } else {
    PageComponent = children;
  }
  console.log({ PageComponent, isLoadingCurrentUser, isFetchingRefreshToken });

  // TODO: Handle page redirects from here

  return <Provider value={{ isSignedIn }}>{PageComponent}</Provider>;
};

export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) throw new Error("useAuth must be used within an AuthProvider");

  return auth;
};
