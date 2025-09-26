export const requireAuth = (context: any) => {

  if (!context.user) {
    throw new Error("Not authenticated");
  }
    return context.user;
};