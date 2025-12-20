export const mapAuthError = (message: string): string => {
  const msg = message.toLowerCase();
  
  if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
    return "errorInvalidCredentials";
  }
  
  if (msg.includes("email not confirmed") || msg.includes("email not verified")) {
    return "errorEmailNotConfirmed";
  }
  
  if (msg.includes("rate limit") || msg.includes("too many requests")) {
    return "errorRateLimit";
  }
  
  return "errorUnexpected";
};
