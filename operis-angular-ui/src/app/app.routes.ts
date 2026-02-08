import { Routes } from '@angular/router';
import { ProjectsPage } from './projects/projects-page/projects-page';
import { AuthGuard } from './auth/auth.guard';
import { GetStarted } from './get-started/get-started';
import { ProjectPage } from './projects/project-page/project-page';
import { ErrorPage } from './error-page/error-page';
import { Profile } from './users/profile/profile';
import { ActionCenter } from './actions/action-center/action-center';
import { AuthCallbackComponent } from './auth/auth-callback';

export const routes: Routes = [
  { path: '', component: GetStarted }, // unprotected landing page,

    { path: 'auth/callback', component: AuthCallbackComponent },

  { path: 'projects', component: ProjectsPage, canActivate: [AuthGuard] },
  { path: 'projects/:id', component: ProjectPage, canActivate: [AuthGuard] },
  {
    path: 'profile',
    component: Profile,
    canActivate: [AuthGuard]
  },
  {
    path: 'action-center',
    component: ActionCenter,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: ErrorPage,
  },
];
