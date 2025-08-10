import {
  account,
  client,
  storage,
  databases,
  appwriteConfig,
} from './client.ts';
import { OAuthProvider, Query } from 'appwrite';
import db from './databases';
import { createAsyncThunk } from '@reduxjs/toolkit';
// import { redirect } from 'react-router-dom';
import { type User } from '../state/auth/authSlice';

export const loginWithGoogle = async () => {
  const successUrl = `${window.location.origin}/dashboard`;
  const failureUrl = `${window.location.origin}/about`;
  try {
    account.createOAuth2Session(OAuthProvider.Google, successUrl, failureUrl);
    await storeUserData();
  } catch (e: any) {
    console.log(e.message);
  }
};

export const logoutUser = createAsyncThunk<void, void>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await account.deleteSession('current');
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk<User | null, void>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await account.get();
      console.log(user);

      if (!user) {
        return null; // handle redirect in component
      }

      const { documents } = await db.users.list([
        Query.equal('accountId', user.$id),
        Query.select(['name', 'email', 'ImageUrl', 'accountId', 'joinedAt']),
      ]);

      if (documents.length === 0) {
        return null;
      }

      return documents[0] as User;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const getGooglePicture = () => {
  try {
  } catch (e: any) {
    console.log(e.message);
  }
};
export const storeUserData = async () => {
  try {
    // 1. Get current Appwrite auth user
    const user = await account.get();

    // 2. Check if user exists in your DB
    const res = await db.users.list([Query.equal('accountId', user.$id)]);

    // 3. If not found, create new document
    if (res.total === 0) {
      await db.users.create({
        accountId: user.$id,
        name: user.name || 'New User',
        email: user.email,
        imageUrl:
          user.prefs?.profileImage || 'https://www.gravatar.com/avatar/?d=mp', // default gray icon
        joinedAt: new Date().toISOString(),
      });
      console.log('✅ User stored in DB');
    } else {
      console.log('ℹ️ User already exists in DB');
    }
  } catch (err) {
    console.error('Error storing user:', err);
  }
};

export const getExistingUser = () => {
  try {
  } catch (e: any) {
    console.log(e.message);
  }
};
