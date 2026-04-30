export function getValidToken(
  timeoutMs = 5000,
  intervalMs = 200
): Promise<string | null> {
  return new Promise((resolve) => {
    const check = () => {
      const token = sessionStorage.getItem("accessToken");
      if (!token) return false;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiresIn = payload.exp * 1000 - Date.now();

        if (expiresIn > 10 * 1000) {
          resolve(token);
          return true;
        }
      } catch {
        resolve(null);
        return true;
      }

      return false;
    };

    if (check()) return;

    const interval = setInterval(() => {
      if (check()) clearInterval(interval);
    }, intervalMs);

    setTimeout(() => {
      clearInterval(interval);
      resolve(null);
    }, timeoutMs);
  });
}