import { ERPLoginResponse } from './types';

export async function loginToERP(username: string, password: string): Promise<ERPLoginResponse> {
  try {
    const response = await fetch('https://erp-login-microservice.vercel.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const result: ERPLoginResponse = await response.json();
    console.log(result);

    return result;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Network or internal error";
    return {
      status: "error",
      msg
    };
  }
}
