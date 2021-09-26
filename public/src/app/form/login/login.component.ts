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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  emailCtrl: FormControl;
  passwordCtrl: FormControl;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {
    this.emailCtrl = this._fb.control('', [
      Validators.required,
      Validators.email,
    ]);
    this.passwordCtrl = this._fb.control('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32),
    ]);
  }

  ngOnInit(): void {
    console.log(this.loginForm);

    this.loginForm = this._fb.group({
      email: this.emailCtrl,
      password: this.passwordCtrl,
    });
  }

  onSubmit() {
    // console.log("this.loginForm.value");

    this._authService.login(this.loginForm.value).subscribe(
      (res: any) => {
        if (res.token) {
          this._authService.setToken(res.token);
        }
      },
      (err) => console.log(err)
    );
  }

  close() {
    return this.dialogRef.close();
  }
}
