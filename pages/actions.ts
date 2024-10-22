'use server';

import { ActionState } from '@/lib/types/auth';
import { signIn as nextAuthSignIn, signUp as nextAuthSignUp } from '@/lib/auth';

export async function signIn(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    await nextAuthSignIn(email, password);
    return { error: '' };
  } catch (error) {
    return { error: 'Invalid email or password' };
  }
}

export async function signUp(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    await nextAuthSignUp(email, password);
    return { error: '' };
  } catch (error) {
    return { error: 'Failed to create account' };
  }
}
