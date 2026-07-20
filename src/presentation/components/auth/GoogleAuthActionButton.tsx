import { useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";

import type { GoogleAuthRequest } from "@/domain/auth/GoogleAuthRequest";
import { cn } from "@/shared/lib/cn";
import { hasGoogleClientId } from "@/shared/lib/googleClientId";

type GoogleAuthActionButtonProps = {
  className?: string;
  disabled?: boolean;
  mode?: "signin" | "signup";
  onGoogleCredential: (
    credential: Pick<GoogleAuthRequest, "idToken" | "accessToken">,
  ) => void | Promise<void>;
  onError: (errorKey: string) => void;
  onPendingChange?: (pending: boolean) => void;
};

export function GoogleAuthActionButton({
  className,
  disabled,
  mode = "signin",
  onGoogleCredential,
  onError,
  onPendingChange,
}: GoogleAuthActionButtonProps) {
  const { t } = useTranslation();
  const label =
    mode === "signup" ? t("auth.signup.google") : t("auth.login.google");

  if (!hasGoogleClientId()) {
    return (
      <button
        type="button"
        className={cn("google-auth-button", className)}
        disabled={disabled}
        onClick={() => onError("auth.errors.googleClientIdMissing")}
      >
        <FcGoogle className="google-auth-button__icon" aria-hidden />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <GoogleAuthActionButtonConnected
      className={className}
      disabled={disabled}
      label={label}
      onGoogleCredential={onGoogleCredential}
      onError={onError}
      onPendingChange={onPendingChange}
    />
  );
}

type GoogleAuthActionButtonConnectedProps = Omit<
  GoogleAuthActionButtonProps,
  "mode"
> & {
  label: string;
};

function GoogleAuthActionButtonConnected({
  className,
  disabled,
  label,
  onGoogleCredential,
  onError,
  onPendingChange,
}: GoogleAuthActionButtonConnectedProps) {
  const [pending, setPending] = useState(false);
  const { scriptLoadedSuccessfully } = useGoogleOAuth();

  const setBusy = (next: boolean) => {
    setPending(next)
    onPendingChange?.(next)
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await onGoogleCredential({ accessToken: response.access_token });
      } catch (error) {
        const key =
          error instanceof Error && error.message.startsWith("auth.")
            ? error.message
            : "auth.errors.googleFailed";
        onError(key);
      } finally {
        setBusy(false);
      }
    },
    onError: () => {
      onError("auth.errors.googleFailed");
      setBusy(false);
    },
    onNonOAuthError: (error) => {
      if (error.type === "popup_closed") {
        onError("auth.errors.googleCancelled");
      } else {
        onError("auth.errors.googleFailed");
      }
      setBusy(false);
    },
  });

  const isDisabled = disabled || pending || !scriptLoadedSuccessfully;

  const handleClick = () => {
    if (isDisabled) return;
    setBusy(true);
    googleLogin();
  };

  return (
    <button
      type="button"
      className={cn("google-auth-button", className)}
      disabled={isDisabled}
      onClick={handleClick}
    >
      <FcGoogle className="google-auth-button__icon" aria-hidden />
      <span>{label}</span>
    </button>
  )
}
