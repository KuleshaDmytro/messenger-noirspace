// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// export function useIsAuthenticated() {
//   const { status } = useSession();
//   const [hasToken, setHasToken] = useState(false);

//   useEffect(() => {
//     if (status === "authenticated") {
//       // Чекаємо поки TokenSync збереже токен
//       const check = setInterval(() => {
//         const token = sessionStorage.getItem("accessToken");
//         if (token) {
//           setHasToken(true);
//           clearInterval(check);
//         }
//       }, 50);

//       return () => clearInterval(check);
//     }
//   }, [status]);

//   return { isReady: hasToken, status };
// }