import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyserviceService } from '../../shared/myservice.service';
import { ViewUsersComponent } from '../view-users/view-users.component';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit  {

  changePasswordForm: FormGroup;
  newPassword: FormControl;
  currentPassword: FormControl;
  users: User[];
  invalidCurrentPassword = false;

  constructor(private myService: MyserviceService , @Inject(LOCAL_STORAGE) private storage: WebStorageService, private router:Router) { 
    this.currentPassword = new FormControl("", [Validators.required]);
    this.newPassword = new FormControl("", [Validators.required]);
    
    this.changePasswordForm = new FormGroup({
      currentPassword: this.currentPassword,
      password: this.newPassword
    });
  }

 currentUserKey:string; 
 existingPassword :string; 
 ngOnInit() {
      this.currentUserKey=this.storage.get('currentuserkey');
      // console.log(this.currentUserKey);
      this.myService.fetchUserData(this.currentUserKey).subscribe(items=>{
      let record = <User>items[0].payload.toJSON();
      // console.log("record..",record);
      this.existingPassword = record.password;
        // console.log('password',this.existingPassword);
    });
}

changePassword(){
  
  // method I
  // delete this.changePasswordForm.value.currentPassword;
  // this.myService.updateUserPassword(this.currentUserKey, this.changePasswordForm.value);


  //method II
  let obj:Object = {};
  obj['password'] = this.changePasswordForm.value.password;
  this.myService.updateUserPassword(this.currentUserKey, obj);     
  swal("Changed","Password changed Successfully", "success");    
  this.changePasswordForm.reset();
  
}

onBlur(val){
  
  if(val && val.length > 1 && val !== this.existingPassword){
    this.invalidCurrentPassword=true;
  }else{
    this.invalidCurrentPassword=false;
  }
}

goBack(){
  this.router.navigate(['/attendance/view-attendance/']);
  
}

}
interface User {
  key: string,
  username: string,
  password: string,
  name: string,
  subjects: string[],
  role: string,
  status: string

}
