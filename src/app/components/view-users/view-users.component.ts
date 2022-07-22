import { Component, OnInit } from '@angular/core';
import { MyserviceService } from '../../shared/myservice.service';
// import { Subject } from 'rxjs/Subject';
import * as $ from 'jquery';
import { element } from 'protractor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {

  users: User[];
  loading: boolean = false;
  // subAssigned: subjectsAssigned[];

  constructor(private service: MyserviceService, private router:Router) {
    this.getAllSubjectsData();
  }



  subjects: Array<Subject>;

  getAllSubjectsData() {
    this.service.getCollectionName("", "subjectListingAll").snapshotChanges().subscribe(items => {
      this.subjects = [];
      items.forEach(element => {
        var item = element.payload.toJSON();
        item["key"] = element.key;
        this.subjects.push(item as Subject)
      });

    });

  }




  ngOnInit() {
    this.listUsers();

    $(document).ready(() => {

    });


  }



  // giveMeSubjectDetails(semester, firebaseKey) {
  //   let returnVal;
  //   this.subjects.forEach(oneSemester => {
  //     for (let subjectKey in oneSemester) {
  //       if (firebaseKey === subjectKey) {
  //         returnVal = oneSemester[subjectKey];
  //         break;
  //       }
  //     }
  //   });

  //   return returnVal;
  // }

  listUsers() {
    // console.log(this.subjectsFilterForm.value);
    this.loading = true;

    this.service.getCollectionName("", "usersListing").snapshotChanges().subscribe(items => {
      this.users = [];

      items.forEach(element => {
        var user = element.payload.toJSON();
        user["key"] = element.key;


        let subjectsAssignedObj: Subjects[] = [];
        subjectsAssignedObj = <Subjects[]>user.subjectsAssigned;
        // console.log("i have", subjectsAssignedObj);   
        let mySubjects = [];
       
        if(user.role !== 'admin'){

          for (let index in subjectsAssignedObj) {
            let obj = subjectsAssignedObj;
            // console.log("key, sem", obj[index].key + ", "+  obj[index].semester);
            this.service.getSubjectData(obj[index].key, obj[index].semester).subscribe(subjectData => {
              let result = subjectData[0].payload.toJSON();
              result['key'] = obj[index].key;
              result['semester'] = obj[index].semester;
              mySubjects.push(result);
              user["subjects"] = mySubjects;
            });
          }         
        }else{
          // admin
          user["subjects"] = [{subjectCode:"", subjectTitle:"All Subjects"}];
        }
        this.users.push(user as User);

      });
      this.loading = false;

    });


  }

  editUser(userKey){
    this.router.navigate(['./users/edit-user/'+ userKey]);    
  }

 
}

interface User {
  key: string,
  username: string,
  pasword: string,
  name: string,
  subjects: string[],
  role: string,
  status: string

}
interface Subjects {
  key: string,
  semester: string
}
interface Subject {
  key: string,
  subjectCode: string,
  subjectTitle: string,
}