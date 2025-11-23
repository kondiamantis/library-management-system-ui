import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { SharedModule } from './shared/shared-module';
import { FeaturesModule } from './features/features-module';
import { CoreModule } from './core/core-module';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    SharedModule,
    FeaturesModule,
    CoreModule,
  ],
  bootstrap: [App]
})
export class AppModule {
  constructor(private primeng: PrimeNG) {
    this.primeng.theme.set({
      preset: Aura,
      options: {
        darkModeSelector: 'none'
      }
    });
    this.primeng.ripple.set(true);
  }
}

