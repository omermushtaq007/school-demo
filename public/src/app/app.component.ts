import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private _http: HttpClient) {}

  title = 'public';
  ngOnInit(): void {
    this._http
      .get('http://localhost:8888/api/students/')
      .subscribe((res) => console.log(res));
  }
}
