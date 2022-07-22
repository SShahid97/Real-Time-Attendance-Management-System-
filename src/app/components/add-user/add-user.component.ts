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
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  users = [];
  usernames = [];

  loader1 = false; loader2 = false; loader3 = false;
  loader4 = false; loader5 = false; loader6 = false;

  subjects: Array<Subject>;
  allSem1Subjects = []; allSem2Subjects = []; allSem3Subjects = [];
  allSem4Subjects = []; allSem5Subjects = []; allSem6Subjects = [];

  subjectsForm: FormGroup;
  subjectsFormArray;

  noSubjectsAssigned = true;
  invalidUsername = false;

  userForm: FormGroup; username: FormControl; password: FormControl;
  status: FormControl; name: FormControl; role: FormControl;

  roles = [{ val: "teacher", label: "Teacher" }, { val: "admin", label: "Admin" }];

  constructor(private fb: FormBuilder, private myService: MyserviceService, private location: Location, private router:Router) {
    //add new subject form
    //
    this.username = new FormControl("", [Validators.required, Validators.minLength(4)]);
    this.password = new FormControl("", [Validators.required]);
    this.status = new FormControl("enabled", [Validators.required]);
    this.name = new FormControl("", [Validators.required]);
    this.role = new FormControl("teacher", [Validators.required]);

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

  ngOnInit() {
   
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

      $("#adduser").on("click", () => {
        $(".cb-subjects").prop("checked", false);
        $(".cb-subjects").removeAttr("disabled");
        $(".cb-subjects").next().css({ "color": "black" });
      });
    });

    //get subjects for all semesters..
    for (let i = 1; i <= 6; i++) {
      this.getAllSubjectsData("semester" + i);
    }


    this.getUsers();
  }


  getAllSubjectsData(semester) {

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

    let table = this.myService.getCollectionName(semester, "subjectListing");
    table.snapshotChanges().subscribe(items => {
      this.subjects = [];
      items.forEach(element => {
        var item = element.payload.toJSON();
        // console.log(item);
        item["key"] = element.key;
        this.subjects.push(item as Subject);       
      });

      // disable loaders and fillup respective array
      switch (semester) {
        case "semester1":
          this.allSem1Subjects = this.subjects;
          // console.log("......................",this.allSem1Subjects)
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
          this.loader6 = false;
          break;
      }

      // console.log(this.subjects);
    });

  }

  onRoleChange(roleSelected) {
    if (roleSelected === "admin") {
      //all subjects selected
      this.noSubjectsAssigned = false;
    } else if (roleSelected === "teacher") {
      //no subject assigned
      this.noSubjectsAssigned = true;
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


  tempObj = {};
  totalSubjectCount = 0; 
  plzAddThese(subjectArray, semester){
    subjectArray.forEach(element=>{
      this.tempObj[this.totalSubjectCount] ={"key":  element.key, "semester": semester};
      this.totalSubjectCount ++;
    })
  }

  addUser() {
    let mainForm = this.userForm.value;
    // let userValues = this.semestersForm.value;
    let subjectValues = this.subjectsForm.value;

    //removal all "null" values, if present.. at most there can be upto 6 null values..
    for (let i = 0; i < 30; i++) {
      this.removeElement(subjectValues.subjectsAssigned, null);
    }

    // console.log(subjectValues.subjectsAssigned);
    if (mainForm.role === "admin") {
      
      this.plzAddThese(this.allSem1Subjects,  "semester1");
      this.plzAddThese(this.allSem2Subjects,  "semester2");
      this.plzAddThese(this.allSem3Subjects,  "semester3");
      this.plzAddThese(this.allSem4Subjects,  "semester4");
      this.plzAddThese(this.allSem5Subjects,  "semester5");
      this.plzAddThese(this.allSem6Subjects,  "semester6");
    
      // console.log("this...................plz", this.tempObj);
      subjectValues["subjectsAssigned"]=this.tempObj;

      // this is equivalent to above line
      // subjectValues.subjectsAssigned = this.tempObj;

  } else {
      // sort the array before saving
      subjectValues.subjectsAssigned.sort(this.alphabeticalSort);
    }


    //concatenate two json objects into one..    
    let collective = Object.assign(mainForm, subjectValues);
    let result = this.myService.addNewUser(collective, mainForm.role);
   
    if (result.key) {
      swal("Added","User Added Successfully", "success");
    } else {
      swal("Added","Failure!! Nothing Added", "success");
    }

    //reset both
    this.userForm.reset({ status: "enabled", role: "teacher" });
    this.subjectsForm.reset();

    //reload a page
    //  location.reload();
    // console.log(subjectValues.subjectsAssigned);
        //  this.semestersForm.reset();
    //  this.noSubjectsAssigned = true;
  }
  // reset(){
  //     this.subjectsForm.reset(); 
  // }



  onSubjectsChange(key: string, isChecked: boolean, semester: string) {

    this.subjectsFormArray = <FormArray>this.subjectsForm.controls.subjectsAssigned;
    if (isChecked) {
      this.subjectsFormArray.push(new FormControl({ semester: semester, key: key }));
    } else {
      let index = this.subjectsFormArray.controls.findIndex(x => x.value == key)
      this.subjectsFormArray.removeAt(index);
    }
    if (this.subjectsFormArray.length > 0) {
      this.noSubjectsAssigned = false;
    } else { // == 0
      this.noSubjectsAssigned = true;
    }
  }




  getUsers(){
    let table = this.myService.getCollectionName("", "usersListing");
    table.snapshotChanges().subscribe(items => {
      this.users = [];
      this.usernames = [];
      items.forEach(element => {
        var item = element.payload.toJSON();
        item["key"] = element.key;
       // this.users.push(item as User);
        this.usernames.push(item.username);
      });
      // console.log("users = ", this.users);
      // console.log("usernames = ", this.usernames);
    });
  }


  onBlur(value){
    this.getUsers();
    let userVal = this.usernames.indexOf(value);
    //doesn't exists yet i.e; available
    if(userVal === -1){
      this.invalidUsername = false;
    }else{
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
  allotted: boolean
}

interface User{
  key: string,
  username: string,
  pasword: string, 
  name: string, 
  subjects: string[],
  role: string,
  status: string,
  subjectsAssigned: string[]
}
