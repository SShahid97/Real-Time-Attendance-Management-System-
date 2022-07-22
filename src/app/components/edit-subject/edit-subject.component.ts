import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MyserviceService } from '../../shared/myservice.service';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.css']
})
export class EditSubjectComponent implements OnInit {

  subjectForm: FormGroup;
  subjectCode: FormControl;
  subjectTitle: FormControl;
  semester: FormControl;
  semesters: Semester[];

  constructor(private myService: MyserviceService, private activatedRoute: ActivatedRoute, private router: Router ) {
    this.semesters = [
      { val: "", label: "select" },
      { val: "semester1", label: "Semester 1" },
      { val: "semester2", label: "Semester 2" },
      { val: "semester3", label: "Semester 3" },
      { val: "semester4", label: "Semester 4" },
      { val: "semester5", label: "Semester 5" },
      { val: "semester6", label: "Semester 6" }
    ];

    //edit new subject form
    this.subjectCode = new FormControl("", [Validators.required]);
    this.subjectTitle = new FormControl("", [Validators.required]);
    this.semester = new FormControl({value: '', disabled: true}, Validators.required);

    this.subjectForm = new FormGroup({
      subjectCode: this.subjectCode,
      subjectTitle: this.subjectTitle,
      semester: this.semester
    });

  }


  currentSubjectsSemester:string; 
  currentSubjectsKey:string;
  currentSubjectsCode:string; 
  currentSubjectsTitle:string; 
  ngOnInit() {
    this.currentSubjectsKey = this.activatedRoute.snapshot.params['key'];
    this.currentSubjectsSemester = this.activatedRoute.snapshot.params['semester'];
  
    this.myService.getSubjectData(this.currentSubjectsKey,this.currentSubjectsSemester).subscribe(items =>{
      let record = <Subject>items[0].payload.toJSON();
      this.currentSubjectsTitle = record.subjectTitle;
      this.currentSubjectsCode = record.subjectCode;
    });

 }

  editSubject() { 
    // console.log(this.subjectForm.value);
    // console.log(this.currentSubjectsKey);
    this.myService.updateSubjectData(this.currentSubjectsKey, this.currentSubjectsSemester,  this.subjectForm.value);
    swal("Updated","Subject updated Successfully", "success");
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