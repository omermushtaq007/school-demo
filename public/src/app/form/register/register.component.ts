import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  usernameCtrl: FormControl;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  confirmPasswordCtrl: FormControl;
  // custom messages
  errMsg!: string;
  passwordErr!: string;
  classMsg: any;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) {
    this.firstNameCtrl = this._fb.control('', [
      Validators.required,
      Validators.minLength(2),
    ]);
    this.lastNameCtrl = this._fb.control('', [
      Validators.required,
      Validators.minLength(2),
    ]);
    this.usernameCtrl = this._fb.control('', [
      Validators.required,
      Validators.minLength(2),
    ]);
    this.emailCtrl = this._fb.control('', [
      Validators.required,
      Validators.email,
      Validators.minLength(2),
    ]);
    this.passwordCtrl = this._fb.control('', [
      Validators.required,
      Validators.minLength(8),
    ]);
    this.confirmPasswordCtrl = this._fb.control('', [
      Validators.required,
      Validators.minLength(8),
    ]);
  }

  ngOnInit(): void {
    this.registerForm = this._fb.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      username: this.usernameCtrl,
      email: this.emailCtrl,
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl,
    });
  }

  /**
   * if input value password equals confirm password
   * then call service
   * else return false
   */
  onSubmit() {
    console.log(this.registerForm.value);

    let inputValue = this.registerForm.value;
    let isMatched = this._authService.passwordChecker(
      inputValue.password,
      inputValue.confirmPassword
    );
    if (isMatched) {
      this.passwordErr = isMatched.msg;
      this.classMsg = isMatched.classMsg;
    }
  }
  close() {
    return this.dialogRef.close();
  }
}
