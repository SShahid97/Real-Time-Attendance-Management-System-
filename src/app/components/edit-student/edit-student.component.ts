import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ValidateNegativeNumber, ValidateMobilePhone } from '../../validators/validators';
import { MyserviceService } from '../../shared/myservice.service';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  accountForm: FormGroup;
  name: FormControl;
  rollNo: FormControl;
  email: FormControl;
  gender: FormControl;
  address: FormControl;
  contact: FormControl;
  semester: FormControl;

  semesters: { val: string, label: string }[];
  constructor(private myService: MyserviceService, private activatedRoute: ActivatedRoute, private router: Router) {

    this.email = new FormControl("",[Validators.required, Validators.pattern('[a-zA-z0-9_\.]+@[a-zA-Z]+\.[a-zA-Z]+')]);
    this.name = new FormControl("", [Validators.required]);
    this.rollNo = new FormControl("", [Validators.required, ValidateNegativeNumber]);
    this.gender = new FormControl("", [Validators.required]);
    this.address = new FormControl("", [Validators.required]);
    this.contact = new FormControl("",[Validators.required, ValidateMobilePhone]);
    this.semester = new FormControl({value:"", disabled:true}, [Validators.required]);

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

  currentStudentKey:string;
  currentStudentSemester:string;
  currentStudentName: string;
  currentStudentRollNo: number;
  currentStudentEmail: string;
  currentStudentGender: string;
  currentStudentAddress: string;
  currentStudentContact: string;

  ngOnInit() {
    this.currentStudentKey = this.activatedRoute.snapshot.params['key'];
    this.currentStudentSemester = this.activatedRoute.snapshot.params['semester'];
  
    // console.log("k.., s", this.currentStudentKey + ", "+ this.currentStudentSemester);
    
    this.myService.getStudentData(this.currentStudentKey, this.currentStudentSemester).subscribe(items=>{
      let record = <Student>items[0].payload.toJSON();
      
      this.currentStudentName = record.name;
      this.currentStudentRollNo = record.rollNo;
      this.currentStudentEmail = record.email;
      this.currentStudentGender = record.gender;
      this.currentStudentAddress = record.address;
      this.currentStudentContact = record.contact;

    });

  }

  editStudent() {
    // console.log("form values",this.accountForm.value);
     this.myService.updateStudentData(this.currentStudentKey, this.currentStudentSemester,  this.accountForm.value);
     swal("Updated","Student Updated Successfully", "success");
  }

    goBack(){
      this.router.navigate(['./students/view-students']);
    }
  
}


interface Student {
	key:string,
  name: string,
  rollNo: number,
  semester: string,
  email: string,
  contact:string,
  address:string,
  gender: string
}