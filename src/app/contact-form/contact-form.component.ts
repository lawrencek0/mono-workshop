import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
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
      email: ['', Validators.required],
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
