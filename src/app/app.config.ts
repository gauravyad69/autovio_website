import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { jwtInterceptor } from './views/pages/auth/services/jwt.interceptor';
import { CartService } from './views/pages/services/cart.service';
import { WishlistService } from './views/pages/services/wishlist.service';
import { AuthService } from './views/pages/auth/services/auth.service';
import { LocalstorageService } from './views/pages/auth/services/localstorage.service';
import {provideToastr} from "ngx-toastr";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      progressAnimation: 'increasing',
      closeButton: true,
      tapToDismiss: true,
      maxOpened: 5,
      autoDismiss: true,
      newestOnTop: true
    }),
    CartService,
    WishlistService,
    AuthService,
    LocalstorageService
  ]
};
