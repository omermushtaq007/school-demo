import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/common/user.model';
import { LoginComponent } from 'src/app/form/login/login.component';
import { RegisterComponent } from 'src/app/form/register/register.component';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user!: User;
  constructor(private dialog: MatDialog, private _authService: AuthService) {}

  ngOnInit(): void {
    // this.userLogged();
    this._authService.loggedUser().subscribe(
      (res: any) => {
        this.user = res;
      },
      (err: any) => {
        if (err.ok === false) {
          this._authService.removeToken();
        }
      }
    );
  }

  // userLogged() {

  // }

  login() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed();
  }

  register() {
    const dialogRef = this.dialog.open(RegisterComponent);
    dialogRef.afterClosed();
  }
}
