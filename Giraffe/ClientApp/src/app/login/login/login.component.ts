import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../service/auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loading = false;
    loginForm: FormGroup;
    submitted = false;
    returnUrl: string;
    errorMessage: string;

    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService) { }

    ngOnInit() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userinfo');
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    get loginFormControl() { return this.loginForm.controls; }
    //beforeSubmittingForm(): void {
    //    this.recaptchaV3Service.execute('importantAction').subscribe(
    //        (token) => {
    //            console.log(token)
    //            this.onSubmit();
    //        },
    //        (error) => {
    //            console.log(error)
    //            this.errorMessage = 'Error trying to verify request (reCaptcha v3)';
    //            this.loginForm.setErrors({
    //                invalidLogin: true
    //            });
    //        });
    //}
    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }
        // this.loading = true;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.authService.login(this.loginForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.islogin == 1) {
                        this.router.navigate([returnUrl]);
                    }
                    else {
                        this.errorMessage = data.error;
                        this.loginForm.setErrors({
                            invalidLogin: true
                        });
                    }
                },
                err => {
                    console.log(err)
                },
                () => {
                });
    }

}
