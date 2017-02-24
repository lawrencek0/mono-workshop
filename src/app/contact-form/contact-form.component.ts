import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {CustomValidators} from "ng2-validation";
@Component({
  selector: 'portfolio-contact-form',
  templateUrl: './contact-form.component.html',
  styles: []
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      message: ['', Validators.required]
    })
  }

  onSubmit() {
    console.log(this.contactForm.value);
    this.contactForm.reset();
  }

  ngOnInit() {
  }
}
