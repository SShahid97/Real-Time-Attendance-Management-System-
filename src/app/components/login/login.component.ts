import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyserviceService } from '../../shared/myservice.service';
import * as $ from 'jquery';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  username: FormControl;
  password: FormControl;
  invalidUser:boolean;
  disabledUser:boolean;
  // SESSION_STORAGE //LOCAL_STORAGE
  constructor(private myService: MyserviceService, private router: Router,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
    this.username = new FormControl("", [Validators.required]);
    this.password = new FormControl("", [Validators.required]);

    this.loginForm = new FormGroup({
      username: this.username,
      password: this.password
    });

  }

  ngOnInit() {
    let buttonRef: HTMLElement = document.getElementById('popupBtn') as HTMLElement;
    buttonRef.click();
    // popupBtn
    // $(document).ready(function(){
    //  $("#popupBtn").click();
    // });
  }


  users: Array<User>;
  loginFunction() {
    //console.log(this.loginForm.value);
    let table = this.myService.getCollectionName("", "usersListing");
    let validUser = false;
    let currentUser: User;
    table.snapshotChanges().subscribe(items => {
      this.users = [];
      // this.usernames = [];
      items.forEach(element => {
        var user = element.payload.toJSON();
        user["key"] = element.key;
        if (user.username === this.loginForm.value.username && user.password === this.loginForm.value.password) {
          validUser = true;
          currentUser = user;
          if(user.status == "enabled"){
            this.disabledUser = false;
          }else{
            this.disabledUser = true;
          }
        }
      });

      if (!validUser) {
        this.invalidUser=true;
      } else if(validUser && !this.disabledUser) {
        this.invalidUser=false;
        this.storage.set('currentuserkey', currentUser.key);
        this.storage.set('role', currentUser.role);
        this.storage.set('username', currentUser.username);

        //////////////////////////////////////
        if (currentUser.role === "admin")
          window.location.href = "/students/view-students";
        else
          window.location.href = "/attendance/take-attendance";
        // this.router.navigate(['/attendance/take-attendance']);
      }
    })



  }

  //---------------------------loginfunction (THE END)-----------------------------------



}
interface User {
  key: string,
  username: string,
  password: string,
  name: string,
  subjects: string[],
  role: string,
  status: string,
  subjectsAssigned: string[]
}