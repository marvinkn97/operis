import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
   constructor(private oauth: OAuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    // Wait for OAuth initialization
    await this.oauth.loadDiscoveryDocumentAndTryLogin();

    if (!this.oauth.hasValidAccessToken()) {
      await this.oauth.initLoginFlow(); // triggers login only if not logged in
      return false;
    }

    return true;
  }
}
