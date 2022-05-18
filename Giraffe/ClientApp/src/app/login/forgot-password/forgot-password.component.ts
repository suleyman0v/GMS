import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReqResService } from '../../service/req-res.service';

declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  submitted = false;
  resetOpe = false;
  constructor(private formBuilder: FormBuilder, private reqRes: ReqResService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
  }
  get forgotPasswordFormControl() { return this.forgotPasswordForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    else {
      $('#btnSend').attr('disabled', 'disabled');
      this.reqRes.postData('/auth/ForgotPassword', this.forgotPasswordForm.value).subscribe(
        data => {
          if (data.result) {
            this.resetOpe = true;
            $('#btnSend').removeAttr('disabled');
          }
          else {
            this.forgotPasswordForm.setErrors({
              invalidLogin: true
            });
            $('#btnSend').removeAttr('disabled');
          }
        },
        error => {
          console.log(error)
        }
      );
    }
  }
}
