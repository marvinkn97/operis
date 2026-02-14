import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import { authConfig } from './auth/auth.config';
import { AuthInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideOAuthClient(), // if using standalone API
    provideAppInitializer(() => {
      const oauthService = inject(OAuthService);
      oauthService.configure(authConfig);
      oauthService.setupAutomaticSilentRefresh();

      oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
        // Remove auth code from URL
        if (window.location.search.includes('code=')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    }),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
};
