import { get } from "@/utils";
import { useQuery } from "@tanstack/react-query";

import { useRouter } from "next/router";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export enum AuthStatus {
  UNKNOWN = "unknown",
  SIGNED_IN = "signed-in",
  SIGNED_OUT = "signed-out",
}

type AuthContextProps = {
  authStatus: AuthStatus;
  setAuthStatus: Dispatch<SetStateAction<AuthStatus>>;
};

const AuthContext = createContext<AuthContextProps | null>(null);

const { Provider } = AuthContext;

const fetchCurrentUser = () => get("/auth/me");

type AuthProviderProps = {
  children: ReactNode;
};

const publicOnlyPages = ["/", "/sign-in", "/sign-up", "/oauth-callback"];

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [authStatus, setAuthStatus] = useState(AuthStatus.UNKNOWN);
  const router = useRouter();
  const { isFetching: isFetchingCurrentUser } = useQuery(
    ["currentUser"],
    fetchCurrentUser,
    {
      onError: () => {
        setAuthStatus(AuthStatus.SIGNED_OUT);
      },
      onSuccess: () => {
        setAuthStatus(AuthStatus.SIGNED_IN);
      },
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  useEffect(() => {
    if (authStatus === AuthStatus.UNKNOWN || isFetchingCurrentUser) {
      return;
    }

    const isSignedIn = authStatus === AuthStatus.SIGNED_IN;

    if (isSignedIn && publicOnlyPages.includes(router.pathname)) {
      router.replace("/dashboard");
      return;
    }

    if (!isSignedIn && !publicOnlyPages.includes(router.pathname)) {
      router.replace("/sign-in");
      return;
    }
  }, [isFetchingCurrentUser, authStatus, router.pathname]);

  return <Provider value={{ authStatus, setAuthStatus }}>{children}</Provider>;
};

export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) throw new Error("useAuth must be used within an AuthProvider");

  return auth;
};
