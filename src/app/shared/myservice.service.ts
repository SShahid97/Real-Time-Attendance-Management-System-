import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Student } from './student.model';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class MyserviceService {

  stdTable: AngularFireList<any>;
  subTable: AngularFireList<any>;

  stdsList: any[];
  currentSemester: string;
  currentSubject: string;

  constructor(private fdb: AngularFireDatabase) {
  }

  //adding Students to Table
  addNewStudent(record) {
    try {
      let url = '/students/' + record.semester;
      //remove semester key from javascript object (form value)
      delete record.semester;
      this.fdb.list(url).push(record);
    } catch (ex) {
      return null;
    }
  }

  getCollectionName(node, collectionOf) {
    try {
      let collectionName;
      switch (collectionOf) {
        case 'subjectListing':
          // node = semester
          collectionName = this.fdb.list('/subjects/' + node);
          break;
        case 'studentListing':
          // node = semester
          collectionName = this.fdb.list('/students/' + node);
          break;
        case 'usersListing':
          // node = semester
          collectionName = this.fdb.list('/users/');
          break;
        case 'subjectListingInner':
          // node = semester/key
          collectionName = this.fdb.list('/subjects/' + node);
          break;
        case 'subjectListingAll':
          // node = semester
          collectionName = this.fdb.list('/subjects/');
          break;
        case 'userData':
          // node = semester
          collectionName = this.fdb.list('/users/' + node);
          break;
        case 'attendanceCheckToday':
          collectionName = this.fdb.list(node);
          break;

        case 'getDatesForSubject':
          collectionName = this.fdb.list(node);
          break;
      }
      return collectionName;
    } catch (ex) {
      return null;
    }
  }

  //adding subjects to table
  addNewSubject(record) {
    try {
      let url = '/subjects/' + record.semester;
      //remove semester key from javascript object (form value)
      delete record.semester;
      this.fdb.list(url).push(record);
    } catch (ex) {
      return null;
    }
  }

  toggleAllottedFlag(subjectsAssignedArray, flagToSet) {
    try {
      subjectsAssignedArray.forEach(element => {
        let url = '/subjects/' + element.semester;
        this.fdb.list(url).update(element.key, { 'allotted': flagToSet });
      });

    } catch (ex) {
      return null;
    }
  }

  addNewUser(record, role) {
    let url = '/users/';
    try {
      //toggle allotted field 
      if (role === 'teacher')
        this.toggleAllottedFlag(record.subjectsAssigned, true);
      //add user
      return this.fdb.list(url).push(record);
    } catch (ex) {
      return ex;
    }


  }


  editUser(key, record, role, removedSubjects) {
    let url = '/users/';
    try {
      //toggle allotted field 
      if (role === 'teacher'){
        this.toggleAllottedFlag(record.subjectsAssigned, true);
        this.toggleAllottedFlag(removedSubjects, false);
      }
      //add user
      return this.fdb.list(url).update(key, record);
    } catch (ex) {
      return ex;
    }


  }

  saveAttendance(url, record) {
    try {
      return this.fdb.list(url).push(record);
    } catch (ex) {
      return ex;
    }
  }

  updateAttendance(url, record, key) {
    try {
      return this.fdb.list(url).update(key, record);
    } catch (ex) {
      return ex;
    }
  }

  // addStudent(record) {
  //   this.stdTable.push(record);
  // }

  update(key, updatedStd) {

    this.stdsList.forEach((std, index) => {
      // console.log(index);
      if (index == 0) {
        key = std.$key;
        updatedStd = { "rn": "999" }
      }
    });
    // console.log("key = ", key);
    // console.log("std = ", updatedStd);
    this.stdTable.update(key, updatedStd);
  }


  // removeStudent(key = undefined) {
  //   try {
  //     this.stdTable.remove(key);
  //   } catch (ex) {
  //     return null;
  //   }
  // }

  //Removing particular student
  removeStudent(keyOfStudent, semester) {
    try {
      this.fdb.list('/students/' + semester).remove(keyOfStudent);
    } catch (ex) {
      return null;
    }
  }

  //deleting a subject
  removeSubject(subjectKey, semester) {
    try {
      this.fdb.list('/subjects/' + semester).remove(subjectKey);
    } catch (ex) {
      return null;
    }
  }


  //edit functions
  updateSubjectData(subjectKey, semester, record) {
    let url = '/subjects/' + semester;
    //remove semester key from javascript object (form value)
    // delete record.semester;
    this.fdb.list(url).update(subjectKey, record);
  }

  updateStudentData(studentKey, semester, record) {
    let url = 'students/' + semester;
    this.fdb.list(url).update(studentKey, record);
  }

  updateUserData() {

  }

  updateUserPassword(userKey, record) {
    let url = 'users/';
    this.fdb.list(url).update(userKey, record);

  }


  getTableName() {
    try {
      return this.stdTable;
    } catch (ex) {
      return null;
    }
  }

  getStudentData(studentKey, semester) {
    // orderByKey
    return this.fdb.list('/students/' + semester,
      ref => ref.orderByKey().equalTo(studentKey)).snapshotChanges();
  }


  getSubjectData(subjectKey, semester) {
    // orderByKey
    return this.fdb.list('/subjects/' + semester,
      ref => ref.orderByKey().equalTo(subjectKey)).snapshotChanges();
  }


  fetchUserData(userKey) {
    // orderByKey
    return this.fdb.list('/users',
      ref => ref.orderByKey().equalTo(userKey)).snapshotChanges();
  }

  //return all attendance for a particular day (epoch date) (All subjects for a day)
  checkIfAttendanceExists(epoch) {
    //where condition of sql
    return this.fdb.list('/attendance',
      ref => ref.orderByChild('date').equalTo(epoch)).snapshotChanges();
  }

  //return all attedance for a particular subject (all dates for this specified subject)
  checkIfSubjectsExists(subjectKey) {
    //where condition of sql
    return this.fdb.list('/attendance',
      ref => ref.orderByChild('subjectKey').equalTo(subjectKey)).snapshotChanges();
  }

  getSubjectsTable(key) {
    // console.log("got key", key);
    //  let data =   this.fdb.list('/student', 
    //   ref => ref.orderByChild('name').equalTo("shabir")).snapshotChanges().subscribe(items => {
    //     // this.stdsList = [];
    //     items.forEach(element => {
    //       var item = element.payload.toJSON();
    //       console.log(item);
    //     });
    //   });
    try {
      return this.fdb.list('/subjects/' + key);
    } catch (ex) {
      return null;
    }
  }



}




