import { WebPlugin } from '@capacitor/core';

import type { AuthSSOPlugin } from './definitions';

export class AuthSSOWeb extends WebPlugin implements AuthSSOPlugin {

  async echo(options: { value: string }): Promise<{ value: string }> {

    console.info('ECHO', options);

    return options;
  }

  async signIn(): Promise<{ status: boolean, message: string, data?: string, token?: string, tokenAccess?: string, tokenRefresh?: string }> {
    const status = false;
    const message = "Chức năng chỉ hoạt động trên ứng dụng ios hoặc android";
    return { status, message };
  }

  async signOut(): Promise<{ status: boolean, message: string }> {
    const status = false;
    const message = "Chức năng chỉ hoạt động trên ứng dụng ios hoặc android";
    return { status, message };
  }

}
