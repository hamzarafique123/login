import { Component } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

interface GoogleUser {
  authentication: {
    accessToken: string;
    idToken: string;
  };
  serverAuthCode?: string;
  displayName?: string;
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  imageUrl?: string;
}

interface Authentication {
  accessToken: string;
  idToken: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: { name?: string; email?: string; imageUrl?: string } | null = null;
  loading: boolean = false; // Define the loading property

  constructor(private platform: Platform, private router: Router) {
    this.initializeGoogleAuth();
  }

  async initializeGoogleAuth() {
    try {
      if (this.platform.is('capacitor')) {
        await GoogleAuth.initialize();
      } else {
        await GoogleAuth.initialize({
          clientId: '737088378705-0c5g4o71nfice1hcpvfkdctdt1g6n14q.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });
      }
      console.log('Google Auth initialized successfully');
      this.tryRestoreSession();
    } catch (error) {
      console.error('Error initializing Google Auth:', error);
    }
  }

  async tryRestoreSession() {
    try {
      const result = await GoogleAuth.refresh();
      if (result) {
        this.handleAuthResult(result);
      }
    } catch (error) {
      console.log('No valid session found');
    }
  }

  async signIn(autoSignIn: boolean = false) {
    this.loading = true; // Set loading to true when starting sign-in
    try {
      console.log('Attempting to sign in...');
      let result: GoogleUser | Authentication;

      if (autoSignIn) {
        result = await GoogleAuth.refresh();
      } else {
        result = await GoogleAuth.signIn();
      }
      console.log('Sign in result:', result);
      this.handleAuthResult(result);
    } catch (error: any) {
      console.error('Error signing in:', error);
    } finally {
      this.loading = false; // Reset loading after the operation completes
    }
  }

  async refresh() {
    this.loading = true; // Set loading to true when refreshing
    try {
      const result = await GoogleAuth.refresh();
      console.log('Refresh result:', result);
      this.handleAuthResult(result);
    } catch (error) {
      console.error('Error refreshing token:', error);
    } finally {
      this.loading = false; // Reset loading after refresh
    }
  }

  async signOut() {
    try {
      await GoogleAuth.signOut();
      this.user = null;
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  private handleAuthResult(result: GoogleUser | Authentication) {
    if ('email' in result) {
      this.user = {
        name: result.displayName || `${result.givenName} ${result.familyName}`,
        email: result.email,
        imageUrl: result.imageUrl,
      };
    } else {
      this.user = {}; // Handle Authentication result
    }
    console.log('Updated user:', this.user);
  }
}
