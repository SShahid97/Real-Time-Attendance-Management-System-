import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { MyserviceService } from '../../shared/myservice.service';
import swal from 'sweetalert2';

//jquery 
import * as $ from 'jquery';

//for creating customs validators
import { AbstractControl } from '@angular/forms';

//for relaoding page
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  users = [];
  usernames = [];

  loader1 = false; loader2 = false; loader3 = false;
  loader4 = false; loader5 = false; loader6 = false;

  subjects: Array<Subject>;
  allSem1Subjects = []; allSem2Subjects = []; allSem3Subjects = [];
  allSem4Subjects = []; allSem5Subjects = []; allSem6Subjects = [];

  subjectsForm: FormGroup;
  subjectsFormArray;

  invalidUsername = false;

  userForm: FormGroup; username: FormControl; password: FormControl;
  status: FormControl; name: FormControl; role: FormControl;

  roles = [{ val: "teacher", label: "Teacher" }, { val: "admin", label: "Admin" }];

  ngCurrentUserName: string;
  ngCurrentStatus: string;
  ngCurrentPassword: string;
  ngCurrentName: string;
  ngCurrentRole: string;

  constructor(private fb: FormBuilder, private myService: MyserviceService, private location: Location, private router: Router  ,private activatedRoute: ActivatedRoute) {
    //add new subject form
    //
    this.username = new FormControl("", [Validators.required, Validators.minLength(4)]);
    this.password = new FormControl("", [Validators.required]);
    this.status = new FormControl("enabled", [Validators.required]);
    this.name = new FormControl("", [Validators.required]);
    this.role = new FormControl({ value: "", disabled: true }, [Validators.required]);

    this.userForm = new FormGroup({
      username: this.username,
      password: this.password,
      status: this.status,
      name: this.name,
      role: this.role
    });


    this.subjectsFormArray = FormArray;
    this.subjectsForm = this.fb.group({
      subjectsAssigned: this.fb.array([])
    });

  }

  ngCurrentUserKey: string;
  ngMySubjects: Subjects[];

  ngOnInit() {
    this.ngCurrentUserKey = this.activatedRoute.snapshot.params['key'];
    // console.log("curent key", this.ngCurrentUserKey);
    this.subjectsFormArray = <FormArray>this.subjectsForm.controls.subjectsAssigned;
    this.myService.fetchUserData(this.ngCurrentUserKey).subscribe(items => {
      let user = <User>items[0].payload.toJSON();
      // console.log("user Record", user);
      this.ngCurrentStatus = user.status;
      this.ngCurrentName = user.name;
      this.ngCurrentUserName = user.username;
      this.ngCurrentPassword = user.password;
      this.ngCurrentRole = user.role;

      this.ngMySubjects = [];

      for (let k in user.subjectsAssigned) {
        this.ngMySubjects.push(user.subjectsAssigned[k]);
        this.subjectsFormArray.push(new FormControl({ semester: user.subjectsAssigned[k].semester, key: user.subjectsAssigned[k].key }));
      }
      //get subjects for all semesters..
      for (let i = 1; i <= 6; i++) {
        this.getAllSubjectsData("semester" + i, this.ngMySubjects);
      }
    });





    this.getUsernames();

    $(document).ready(function () {

      function checkAndDisable(selector) {
        $(selector).prop("checked", true);
        $(selector).prop("disabled", true);
        $(selector).next().css({ "color": "darkgreen" });
      }

      function uncheckAndEnable(selector) {
        $(selector).prop("checked", false);
        $(selector).removeAttr("disabled");
        $(selector).next().css({ "color": "black" });
      }

      $("#role").on("change", function () {
        if ($(this).val() == "admin") {
          checkAndDisable(".cb-subjects");
        } else if ($(this).val() == "teacher") {
          uncheckAndEnable(".cb-subjects");
        }
      });

      // $("#edituser").on("click", () => {
      //   $(".cb-subjects").prop("checked", false);
      //   $(".cb-subjects").removeAttr("disabled");
      //   $(".cb-subjects").next().css({ "color": "black" });
      // });
    });


  }


  getAllSubjectsData(semester, mySubjects) {

    // enable loaders
    switch (semester) {
      case "semester1":
        this.loader1 = true;
        break;
      case "semester2":
        this.loader2 = true;
        break;
      case "semester3":
        this.loader3 = true;
        break;
      case "semester4":
        this.loader4 = true;
        break;
      case "semester5":
        this.loader5 = true;
        break;
      case "semester6":
        this.loader6 = true;
        break;
    }

    this.myService.getCollectionName(semester, "subjectListing").snapshotChanges().subscribe(items => {
      this.subjects = [];
      items.forEach(element => {
        var item = element.payload.toJSON();
        item["key"] = element.key;

        for (let i = 0; i < mySubjects.length; i++) {
          if (item.key == mySubjects[i].key) {
            item["mySubject"] = true;
            break;
          } else {
            item["mySubject"] = false;
          }
        }

        // if(this.ngCurrentRole === 'admin'){
        //   item['disable'] = true;
        // }else{
        //   item['disable'] = false; 
        // }

        this.subjects.push(item as Subject);
      });

      // disable loaders and fillup respective array
      switch (semester) {
        case "semester1":
          this.allSem1Subjects = this.subjects;
          // console.log("......................1", this.allSem1Subjects)
          this.loader1 = false;
          break;
        case "semester2":
          this.allSem2Subjects = this.subjects;
          this.loader2 = false;
          break;
        case "semester3":
          this.allSem3Subjects = this.subjects;
          this.loader3 = false;
          break;
        case "semester4":
          this.allSem4Subjects = this.subjects;
          this.loader4 = false;
          break;
        case "semester5":
          this.allSem5Subjects = this.subjects;
          this.loader5 = false;
          break;
        case "semester6":
          this.allSem6Subjects = this.subjects;
          // console.log("......................6", this.allSem6Subjects)
          this.loader6 = false;
          break;
      }

      // console.log(this.subjects);
    });

  }

  onRoleChange(roleSelected) {
    if (roleSelected === "admin") {
      //all subjects selected
      // this.noSubjectsAssigned = false;
    } else if (roleSelected === "teacher") {
      //no subject assigned
      // this.noSubjectsAssigned = true;
    }
  }

  removeElement(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  alphabeticalSort(element1, element2) {
    let element1Sem = element1.semester,
      element2Sem = element2.semester;
    if (element1Sem < element2Sem) {
      return -1;
    } else if (element1Sem > element2Sem) {
      return 1;
    } else {
      return 0;
    }
  }

  editUser() {


    let mainForm = this.userForm.value;
    let subjectValues = this.subjectsForm.value;


    //removal all "null" values, if present.. at most there can be upto 6 null values..
    for (let i = 0; i < 30; i++) {
      this.removeElement(subjectValues.subjectsAssigned, null);
    }

    let removedSubjects: Subjects[] = [];
    if (this.ngCurrentRole === "teacher") {
      this.ngMySubjects.forEach(ngSubject => {
        let exists = this.checkMyEntry(subjectValues.subjectsAssigned, ngSubject)
        // console.log("exists...", exists);
        if (!exists) {
          let obj = { "key": ngSubject.key, "semester": ngSubject.semester };
          removedSubjects.push(obj);
        }
      });

      // sort the array before saving
      subjectValues.subjectsAssigned.sort(this.alphabeticalSort);

    }

    // console.log("removedsubjecsts here", removedSubjects);
    //concatenate two json objects into one..
    let collective = Object.assign(mainForm, subjectValues);

    // console.log(collective);
    let result = this.myService.editUser(this.ngCurrentUserKey, collective, this.ngCurrentRole, removedSubjects);

    if (result.key) {
      swal("Updated", "User Updated Successfully", "success");
    } else {
      swal("Updated", "User Updated Successfully", "success");
    }

    // this.userForm.reset({ status: "enabled", role: "teacher" });
    // this.subjectsForm.reset();
  }

  checkMyEntry(subjectsAssignedFinal, checkMe) {
    let exists = false;
    for (let i = 0; i < subjectsAssignedFinal.length; i++) {
      if (subjectsAssignedFinal[i].key === checkMe.key) {
        exists = true;
        break;
      }
    }
    return exists;
  }

  onSubjectsChange(key: string, isChecked: boolean, semester: string) {

    if (isChecked) {
      this.subjectsFormArray.push(new FormControl({ semester: semester, key: key }));
    } else {
      let index = this.subjectsFormArray.controls.findIndex(x => x.value == key)
      this.subjectsFormArray.removeAt(index);
    }

  }




  getUsernames() {
    let table = this.myService.getCollectionName("", "usersListing");
    table.snapshotChanges().subscribe(items => {
      this.users = [];
      this.usernames = [];
      items.forEach(element => {
        var item = element.payload.toJSON();
        item["key"] = element.key;

        // console.log("currun", this.ngCurrentUserName)
        if (this.ngCurrentUserName !== item.username)
          this.usernames.push(item.username);
      });
      // console.log("users = ", this.users);
      // console.log("usernames = ", this.usernames);
    });
  }


  onBlur(value) {
    this.getUsernames();
    // console.log("usernames", this.usernames);
    let userVal = this.usernames.indexOf(value);
    //doesn't exists yet i.e; available
    if (userVal === -1) {
      this.invalidUsername = false;
    } else {
      //exists, so not available, thus invalid
      this.invalidUsername = true;
    }
  }

  goBack(){
    this.router.navigate(['/users/view-users/']);
  }


}

interface Subject {
  key: string,
  subjectCode: string,
  subjectTitle: string,
  allotted: boolean,
  mySubject: boolean
}

interface User {
  key: string,
  username: string,
  password: string,
  name: string,
  subjects: string[],
  role: string,
  status: string,
  subjectsAssigned: Subjects[]
}

interface Subjects {
  key: string,
  semester: string
}
