import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private platform: Platform) {}

  async googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        // For mobile devices
        await this.afAuth.signInWithRedirect(provider);
        return this.afAuth.getRedirectResult();
      } else {
        // For web browsers
        return this.afAuth.signInWithPopup(provider);
      }
    } catch (error: unknown) {
      console.error('Google Sign-In Error:', error);
      if (error instanceof Error && error.message.includes('missing initial state')) {
        // Handle the specific error
        console.log('Attempting to sign in without redirect');
        return this.afAuth.signInWithPopup(provider);
      }
      throw error;
    }
  }

  async getRedirectResult() {
    try {
      return await this.afAuth.getRedirectResult();
    } catch (error: unknown) {
      console.error('Auth Redirect Error:', error);
      if (error instanceof Error && error.message.includes('missing initial state')) {
        console.log('Redirect result not available, user might need to sign in again');
        return null;
      }
      throw error;
    }
  }

  async logout() {
    await this.afAuth.signOut();
  }

  getUser() {
    return this.afAuth.authState;
  }
}