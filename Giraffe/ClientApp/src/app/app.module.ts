import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './login/login/login.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpInterceptorService } from './service/auth/http-interceptor.service';
import { ErrorInterceptorService } from './service/auth/error-interceptor.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LeadsComponent } from './pages/leads/leads.component';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { ItemgroupsComponent } from './pages/itemgroups/itemgroups.component'
import { ServicegroupsComponent } from './pages/servicegroups/servicegroups.component'
import { ItemsComponent } from './pages/items/items.component'
import { ServicesComponent } from './pages/services/services.component'
import { ProposaltemplateComponent } from './pages/proposaltemplate/proposaltemplate.component'
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { TrimLeftDirective } from './directives/trim-left.directive';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ClipboardModule } from 'ngx-clipboard';
import { CleanZeroDirective } from './directives/clean-zero.directive';
import { PercentLimitDirective } from './directives/percent-limit.directive';
import { SortablejsModule } from 'ngx-sortablejs';
import { LeadsettingsComponent } from './pages/leadsettings/leadsettings.component';
import { ProposalComponent } from './client/proposal/proposal.component';
import { UsersComponent } from './pages/users/users.component';
import { RolesComponent } from './pages/roles/roles.component';
import { SignaturePadModule } from '@ng-plus/signature-pad';
import { MaxLengthDirective } from './directives/max-length.directive';
import { WebleadComponent } from './client/weblead/weblead.component';
import { PresentationComponent } from './pages/presentation/presentation.component';
import { PresentationSettingComponent } from './pages/presentation-setting/presentation-setting.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { JobsComponent } from './pages/jobs/jobs.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { ConfirmMailComponent } from './login/confirm-mail/confirm-mail.component';
import { Error403Component } from './login/error403/error403.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AppLayoutComponent,
    LeadsComponent,
    AccountSettingsComponent,
    ItemgroupsComponent,
    ServicegroupsComponent,
    ItemsComponent,
    ServicesComponent,
    ProposaltemplateComponent,
    TrimLeftDirective,
    CleanZeroDirective,
    PercentLimitDirective,
    LeadsettingsComponent,
    ProposalComponent,
    UsersComponent,
    RolesComponent,
    MaxLengthDirective,
    WebleadComponent,
    PresentationComponent,
    PresentationSettingComponent,
    JobsComponent,
    CustomersComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ConfirmMailComponent,
    Error403Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ImageCropperModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    OrderModule,
    SignaturePadModule,
    NgxMaskModule.forRoot(),
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: '#ffffff',
      backdropBorderRadius: '4px',
      primaryColour: '#A6ACAF',
      secondaryColour: '#A6ACAF',
      tertiaryColour: '#A6ACAF'
    }),
    ClipboardModule,
    SortablejsModule.forRoot({
      animation: 200,
    }),
    PdfViewerModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    //{ provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LcAi9oZAAAAALAwnLC8gfPp1RE4SVOcF5KYORsk' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
