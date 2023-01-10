import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PersonModel } from '../models/person.model';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { PersonManagementService } from '../services/person-management.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-person-management',
  templateUrl: './person-management.component.html',
  styleUrls: ['./person-management.component.scss']
})

export class PersonManagementComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'streetName', 'houseNumber', 'apartmentNumber',
    'postalCode', 'town', 'phoneNumber', 'dateofBirth', 'age'];
  dataSource = new MatTableDataSource<any>();
  PersonForm: FormGroup;
  isInEditMode: boolean = false;
  personList: PersonModel[] = []
  today = new Date();
  isLoading:boolean=false;
  constructor(
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private _personMgmtService: PersonManagementService,
    private _snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,) {

  }

  ngOnInit(): void {
    this.PersonForm = this._formBuilder.group({
      PersonFormRows: this._formBuilder.array([])
    });
    this.getPersons();
    const filterPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
      return filterPredicate.call(this.dataSource, data.value, filter);
    }

  }


  AddNewRow() {
    const control = this.PersonForm.get('PersonFormRows') as FormArray;
    control.insert(0, this.initiatePersonForm());
    this.dataSource = new MatTableDataSource(control.controls);
    this.isInEditMode=true;
    this.cdRef.detectChanges();
    document.getElementsByTagName('input')[0].focus();

  }
  EditPerson(personFormElement: any, i: number) {

    personFormElement.get('PersonFormRows').at(i)
      .get('isEditable').patchValue(false);
    this.isInEditMode = true;
  }

  initiatePersonForm(): FormGroup {
    return this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      streetName: new FormControl('', [Validators.required]),
      apartmentNumber: new FormControl(''),
      houseNumber: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      town: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      dateofBirth: new FormControl('', [Validators.required]),
      age: new FormControl(0),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    })
  }
  isEditable(index: number) {
    return this.PersonForm!.get('PersonFormRows')!.value[index].isEditable
  }
  getElement(i: number, controlName: string) {
    var personFormRows = this.PersonForm.get('PersonFormRows') as FormArray;
    return personFormRows.at(i).get(controlName)?.hasError
  }
  save() {
    this.validateForm();
    if(this.PersonForm.valid)
    {
      this.isLoading=true;
    this._personMgmtService.savePersons(this.PersonForm.value.PersonFormRows).
      subscribe(x => {
        this.isLoading=false;
        if(!x.isSuccess)
        {
          this.showMessage(x.messages.join(','))
          return;
        }
        this.showMessage('Data Saved Successfully');
        this.getPersons();
      });
      
    }
    else
    {
    this.showMessage('please correct validation errors');
    }

  }
  validateForm()
  {
    var personFormRows = this.PersonForm.get('PersonFormRows') as FormArray;
    personFormRows.controls.forEach((element, index) => {
      element.markAllAsTouched();
      element.updateValueAndValidity();
    });
  }
  cancel() {
    this.getPersons();
  }
  getPersons() {
    this.isLoading=true;
    this.isInEditMode = false;
    this._personMgmtService.getPersons()
      .subscribe(response => {
        this.isLoading=false;
        if(!response.isSuccess)
        {
          this.showMessage(response.messages.join(','))
          return;
        }
        this.personList = response.data;

        this.PersonForm = this.fb.group({
          PersonFormRows: this.fb.array(this.personList.map(val => this.fb.group({
            firstName: new FormControl(val.firstName, [Validators.required]),
            lastName: new FormControl(val.lastName, [Validators.required]),
            streetName: new FormControl(val.streetName, [Validators.required]),
            apartmentNumber: new FormControl(val.apartmentNumber),
            houseNumber: new FormControl(val.houseNumber, [Validators.required]),
            postalCode: new FormControl(val.postalCode, [Validators.required]),
            town: new FormControl(val.town, [Validators.required]),
            phoneNumber: new FormControl(val.phoneNumber, [Validators.required]),
            dateofBirth: new FormControl(val.dateofBirth, [Validators.required]),
            age: new FormControl(val.age),
            action: new FormControl('existingRecord'),
            isEditable: new FormControl(true),
            isNewRow: new FormControl(false),
          })
          ))
        });
        this.dataSource = new MatTableDataSource((this.PersonForm.get('PersonFormRows') as FormArray).controls);
      })
  }

  dateChanged(value: Date, index: number) {
    var personFormRows = this.PersonForm.get('PersonFormRows') as FormArray;
    personFormRows.at(index).get('dateofBirth')?.patchValue(value);

    personFormRows.at(index).get('age')?.patchValue(this.calculateAge(value));
    // console.log(event)
    this.isInEditMode = true;
  }
  calculateAge(birthDate: Date) {
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  showMessage(message:string)
  {
    this._snackBar.open(message,'',{ duration: environment.errorMessageDurationSeconds*1000 });
  }

}
