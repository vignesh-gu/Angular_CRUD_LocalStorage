import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormMode, Student } from '../models/student';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-student-lists',
  standalone: false,
  templateUrl: './student-lists.component.html',
  styleUrl: './student-lists.component.scss'
})
export class StudentListsComponent {

  @ViewChild('modal') modal!: ElementRef;

  Student_Lists!:Student[];
  All_Students!:Student[];

  studentForm!:FormGroup;
  FormMode = FormMode;
  formMode:FormMode = FormMode.Add;
  studentId:number = 0;
  searchText:string='';

  constructor(private Fb:FormBuilder){}

  ngOnInit(){
      this.studentForm =  this.Fb.group({
        name:['',[Validators.required,Validators.pattern(/^\S.*$/)]],
        mobile:['',[Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        email:['',[Validators.required, Validators.email]]
      })

    const data = localStorage.getItem('StudentDetails')
    if(data){
      this.Student_Lists = JSON.parse(data)
      this.All_Students = [...this.Student_Lists]
    }else{
      this.Student_Lists = [];
    }

  }

  AddStudentDetails(){

    const studentData = {
      id: Math.floor(100000 + Math.random() * 900000),
      name: this.studentForm.get('name')?.value,
      mobile: this.studentForm.get('mobile')?.value,
      email: this.studentForm.get('email')?.value
    } 
    const studentList = JSON.parse(localStorage.getItem('StudentDetails') || '[]') ;
    const updateList = [...studentList,studentData]
    this.Student_Lists = updateList;
    this.All_Students = [...this.Student_Lists]

    this.modal.nativeElement.click();
    this.studentForm.reset();
    localStorage.setItem('StudentDetails',JSON.stringify(updateList));
  }

  updateStudentDetails(){
    const studentData = {
      id: this.studentId,
      name: this.studentForm.get('name')?.value,
      mobile: this.studentForm.get('mobile')?.value,
      email: this.studentForm.get('email')?.value    } 

    console.log('Student Data:', studentData);  // Log studentData    


    const studentList  = JSON.parse(localStorage.getItem('StudentDetails') || '[]');

    console.log('Student List from localStorage:', studentList);

    const updateList = studentList.map((std:any)=>{
      return  Number(this.studentId) == Number(std.id) ? studentData : std      
    }) 
    console.log('Updated List:', updateList); 

    this.modal.nativeElement.click();
    this.studentForm.reset();
    this.formMode = this.FormMode.Add;
    this.Student_Lists = updateList;
    this.All_Students = [...this.Student_Lists]
    localStorage.setItem('StudentDetails',JSON.stringify(updateList));
    console.log(updateList)
    this.resetForm()
    

  }

  editStudent(student:any){
    this.formMode = this.FormMode.Update;
    this.studentId = student.id;   

    this.studentForm.patchValue({
      id: student.id,
      name: student.name,
      mobile: student.mobile,
      email: student.email
    })
  }
  deleteStudent(id:any){

    const studentList  = JSON.parse(localStorage.getItem('StudentDetails') || '[]')

    const updateList  = studentList?.filter((std:any)=>{
      return  id != std.id 
    })
    
    this.Student_Lists = updateList;
    this.All_Students = [...this.Student_Lists]
    localStorage.setItem('StudentDetails',JSON.stringify(updateList))

  }

  filterStudents(){
    this.All_Students = this.Student_Lists.filter((student)=>{
      return student.name.toLowerCase().includes(this.searchText.toLowerCase().trim())
    })
  }

  resetForm() {
    this.studentForm.reset();
    this.formMode = FormMode.Add;  // default back to Add mode
  }


}
