export const authErrorMessages: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  AccessDenied: "Access denied. You do not have permission to sign in.",
  OAuthAccountNotLinked:
    "This account is registered using a different sign-in method.",
  EmailSignin: "Failed to send the sign-in email. Please try again.",
  EmailCreateAccount:
    "Could not create an account using your email. Please try again.",
  OAuthSignin: "Error signing in with this provider.",
  OAuthCallback: "Error during provider callback.",
  OAuthCreateAccount:
    "Could not create your account through this provider.",
  OAuthAccountNotFound:
    "Account not found. Please create an account first.",
  OAuthProfile:
    "The provider did not return the required profile information.",
  OAuthEmail:
    "Your provider did not return an email address. Sign-in cannot continue.",
  OAuthError: "Unexpected OAuth provider error.",
  CSRFToken:
    "Security check failed (CSRF token mismatch). Please refresh the page.",
  Configuration: "Server configuration error.",
  Callback: "Unexpected error during sign-in.",
  SessionRequired: "You must sign in to continue.",
  Default: "Something went wrong. Please try again.",
};
