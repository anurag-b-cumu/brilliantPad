declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_PUBLISHABLE_KEY: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    EMAIL_SERVER: string;
    EMAIL_FROM: string;
  }
}

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: typeof import('mongoose') | null;
        promise: Promise<typeof import('mongoose')> | null;
      };
    }
  }
} 