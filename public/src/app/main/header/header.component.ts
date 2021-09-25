import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/form/login/login.component';
import { RegisterComponent } from 'src/app/form/register/register.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  login() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed();
  }

  register() {
    const dialogRef = this.dialog.open(RegisterComponent);
    dialogRef.afterClosed();
  }
}
