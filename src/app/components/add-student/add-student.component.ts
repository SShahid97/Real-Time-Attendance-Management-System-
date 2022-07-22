import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ValidateNegativeNumber, ValidateMobilePhone } from '../../validators/validators';


import { MyserviceService } from '../../shared/myservice.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  accountForm: FormGroup;
  name: FormControl;
  rollNo: FormControl;
  email: FormControl;
  gender: FormControl;
  address: FormControl;
  contact: FormControl;
  semester: FormControl;

  semesters: { val: string, label: string }[];
  
  constructor(private myService: MyserviceService, private router: Router) {
    this.email = new FormControl("",[Validators.required, Validators.pattern('[a-zA-z0-9_\.]+@[a-zA-Z]+\.[a-zA-Z]+')]);
    this.name = new FormControl("", [Validators.required]);
    this.rollNo = new FormControl("", [Validators.required, ValidateNegativeNumber]);
    this.gender = new FormControl("male", [Validators.required]);
    this.address = new FormControl("", [Validators.required]);
    this.contact = new FormControl("",[Validators.required, ValidateMobilePhone]);
    this.semester = new FormControl("", [Validators.required]);

    this.accountForm = new FormGroup({
      name: this.name,
      rollNo: this.rollNo,
      address: this.address,
      semester: this.semester,
      gender: this.gender,
      contact: this.contact,
      email: this.email
    });

    this.semesters = [
      { val: "", label: "select" },
      { val: "semester1", label: "Semester 1" },
      { val: "semester2", label: "Semester 2" },
      { val: "semester3", label: "Semester 3" },
      { val: "semester4", label: "Semester 4" },
      { val: "semester5", label: "Semester 5" },
      { val: "semester6", label: "Semester 6" }
    ];
  }


  ngOnInit() {
   }

   addStudent() {

    swal("Added","Student  Added Successfully", "success");
    //console.log(this.accountForm.value);
    this.myService.addNewStudent(this.accountForm.value);
    this.accountForm.reset({gender:"male", semester:""});
  }

  goBack(){
    this.router.navigate(['./students/view-students']);
  }
  reset(){
    this.accountForm.reset({gender:"male", semester:""});
  }
  // getStudents() {
  //   let currentSem = "semester1";

  //   let table = this.myService.getTableName();
  //   table.snapshotChanges().subscribe(items => {
  //     // this.stdsList = [];
  //     items.forEach(element => {
  //       var item = element.payload.toJSON();
  //       item["key"] = element.key;
  //       let std = <Student>item;

  //       if (std.semester === currentSem) {
  //         console.log(std);
  //       }
  //       // console.log(std);
  //       // this.stdsList.push(item as Student);
  //     });
  //   });
  // }

}



interface Student {
  name: string,
  rollNo: number,
  semester: string,
  email: string,
  contact:string,
  address:string,
  gender: string
}