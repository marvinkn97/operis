import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private oauthService: OAuthService) {}

  login() {
    this.oauthService.initCodeFlow();
  }

  async logout() {
  const oauth = this.oauthService;

  // wait for the service to initialize tokens if not yet
  await oauth.loadDiscoveryDocumentAndTryLogin();

  const idToken = oauth.getIdToken();
  if (!idToken) {
    console.warn('No ID token found — cannot log out properly');
    return;
  }

  oauth.logOut({
    idTokenHint: idToken,
    postLogoutRedirectUri: window.location.origin + '/projects',
  });
}


  get token(): string | null {
    return this.oauthService.getAccessToken();
  }

  get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
