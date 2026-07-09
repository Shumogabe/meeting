export interface AuthSSOPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  signIn(): Promise<{ status: boolean, message: string, data?: string, token?: string, tokenAccess?: string, tokenRefresh?: string }>;
  signOut(): Promise<{ status: boolean, message: string }>;
}
