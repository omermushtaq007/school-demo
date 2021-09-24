import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  input: string[] = [
    'first name',
    'last name',
    'username',
    'email',
    'password',
    'confirm password',
  ];
  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this._fb.group({
      'first name': ['', Validators.required],
      'last name': ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      'confirm password': ['', Validators.required],
    });
  }

  onSubmit() {}
}
