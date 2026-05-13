import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      timezone: string;
    };
  }

  interface User {
    timezone: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    timezone: string;
  }
}
