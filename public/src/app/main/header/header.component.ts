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
    this.userLogged();
  }

  userLogged() {
    this._authService.loggedUser().subscribe(
      (res: any) => {
        console.log(res['user']);
        
        this.user = res.user;
      },
      (err: any) => {
        if (err.ok === false) {
          this._authService.removeToken();
        }
      }
    );
  }

  login() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed();
  }

  register() {
    const dialogRef = this.dialog.open(RegisterComponent);
    dialogRef.afterClosed();
  }
}
