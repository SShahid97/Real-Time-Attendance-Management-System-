import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MyserviceService } from '../../shared/myservice.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.css']
})
export class AddSubjectComponent implements OnInit {

  subjectForm: FormGroup;
  subjectCode: FormControl;
  subjectTitle: FormControl;
  semester: FormControl;
  semesters: Semester[];

  constructor(private myService: MyserviceService, private router: Router) {
    this.semesters = [
      { val: "", label: "select" },
      { val: "semester1", label: "Semester 1" },
      { val: "semester2", label: "Semester 2" },
      { val: "semester3", label: "Semester 3" },
      { val: "semester4", label: "Semester 4" },
      { val: "semester5", label: "Semester 5" },
      { val: "semester6", label: "Semester 6" }
    ];

    //add new subject form
    this.subjectCode = new FormControl("", [Validators.required]);
    this.subjectTitle = new FormControl("", [Validators.required]);
    this.semester = new FormControl("", Validators.required);

    this.subjectForm = new FormGroup({
      subjectCode: this.subjectCode,
      subjectTitle: this.subjectTitle,
      semester: this.semester
    });

  }



  ngOnInit() {

  }

  addSubject() {
    
    swal("Added","Subject Added Successfully", "success");

    this.myService.addNewSubject(this.subjectForm.value);
    this.subjectForm.reset({semester:""});
  }

  goBack(){
    this.router.navigate(['./subjects/view-subjects']);
  }

}

interface Subject {
  key: string,
  subjectCode: string,
  subjectTitle: string,
}


interface Semester {
  val: string,
  label: string
}