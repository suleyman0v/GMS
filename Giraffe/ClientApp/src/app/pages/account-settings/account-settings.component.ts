import { Component, OnInit } from '@angular/core';
import { ReqResService } from '../../service/req-res.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormBuilder, FormGroup, Validators, FormControl, } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service'
import { map, first } from 'rxjs/operators';
declare var $: any;
declare var toastr: any;
@Component({
    selector: 'app-account-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.css']
})

export class AccountSettingsComponent implements OnInit {
    //variable
    userData: any = [];
    formValue: any;
    userForm: FormGroup;
    userPasswordForm: FormGroup;
    submitted = false;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    croppedImageData: any = '';
    showcroppedope: any = 0;
    imageSrc: string;
    userPassword: string;
    errorImage: string;
    errorMessage: string;
    localStorageData: any = [];
    //
    constructor(private reqRes: ReqResService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
    ) { }
    ngOnInit() {
        //form-left
        this.userForm = this.formBuilder.group({
            ope: 1,
            firstName: ['', Validators.required],
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.email,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            lastName: ['', Validators.required],
            phone: [''],
            imgPath: ['']
        });
        //form-right
        this.userPasswordForm = this.formBuilder.group({
            ope: 2,
            oldPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        });
        this.getUserData(1);
    }
    get userFormControl() { return this.userForm.controls; }
    //resert password
    resertForm() {
        this.userPasswordForm.setValue({
            ope: 2,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        $('#image').val('');
    }
    //user bind
    getUserData(type) {
        this.reqRes.getData('/Settings/GetUserData/'+ type).subscribe(data => {
            this.userData = data;
            this.imageSrc = data[0].imgPath;
            this.userPassword = data[0].password;
            this.userForm.setValue({
                ope: 1,
                firstName: data[0].firstName,
                email: data[0].email,
                lastName: data[0].lastName,
                phone: data[0].phone,
                imgPath: ''
            });
            this.resertForm();
        },
            error => {
                console.log(error)
            })
    }
    //fileUpload start
    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
        if (event.target.files[0].type.includes("image/")) {
            $("#modal_file").modal('show');
            this.errorImage = '';
        } else {
            this.userForm.patchValue({
                imgPath: ' '
            })
            this.errorImage = 'Please input valid image format '
        }
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
    SelectImage() {
        this.imageSrc = this.croppedImage;
        $("#modal_file").modal('hide');
    }
    //user post
    UserOperation(userDetails) {
        return this.reqRes.postData('/Settings/UserOperation', userDetails).pipe(map(response => {
            return response;
        }))
    };
    //submit both  -left,right-
    onSubmit(ope) {
        toastr.options.positionClass = 'toast-bottom-right';
        this.submitted = true;
        if (this.userForm.invalid) {
            return;
        };
        if (ope == 2) {
            if (this.userPasswordForm.value.newPassword != this.userPasswordForm.value.confirmPassword) {
                toastr.error("Something went wrong!");
                this.resertForm();
                return;
            }
        } else {
            this.userForm.patchValue({
                imgPath: this.imageSrc
            })
        };

        this.formValue = (ope == 1) ? this.userForm.value : this.userPasswordForm.value;
        this.UserOperation(this.formValue)
            .pipe(first())
            .subscribe(
                data => {
                    if (ope == 1) {
                        let localStorage = data;
                        localStorage[0].companyImage = this.authService.companyImage();
                        localStorage[0].companyName = this.authService.companyName();
                        this.authService.setUserData(localStorage);
                    }
                    toastr.success("Save successfully!");
                    this.getUserData(1);
                },
                err => {
                    toastr.error("Something went wrong!");
                    this.resertForm();
                },
                () => {
                });
    }
}


