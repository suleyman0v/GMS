import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'protractor';
import { ReqResService } from '../../service/req-res.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  submitted = false;
  token: string;
  tokenValid;
  constructor(private formBuilder: FormBuilder, private reqRes: ReqResService, private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(paramMap => {
      this.token = paramMap.get('token');
      this.checkToken(this.token);
    });
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  get resetPasswordFormControl() { return this.resetPasswordForm.controls; }
  checkToken(token) {
    this.reqRes.getData('/auth/CheckResetToken/' + token).subscribe(
      data => {
        this.tokenValid = data.result;
      },
      error => { console.log(error); }
    )
  }
  onSubmit() {
    this.submitted = true;
    if (this.resetPasswordForm.invalid && this.resetPasswordFormControl.password.value != this.resetPasswordFormControl.confirmPassword) {
      return;
    }
    this.resetPasswordForm.value["token"] = this.token;
    this.reqRes.postData('/auth/ResetPassword', this.resetPasswordForm.value).subscribe(
      data => {
        if (data.result) {
          this.router.navigate(['/login']);
        }
        else {
          this.resetPasswordForm.setErrors({
            invalidLogin: true
          });
        }
      },
      error => {
        console.log(error)
      }
    );
  }

}
