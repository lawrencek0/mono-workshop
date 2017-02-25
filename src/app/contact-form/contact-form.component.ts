import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {CustomValidators} from "ng2-validation";
@Component({
  selector: 'portfolio-contact-form',
  templateUrl: './contact-form.component.html',
  styles: [`
    form {
          margin-top: -4em;
          margin-bottom: -3em;
          padding: 1.25rem;
    }
    div.card-footer {
      margin: -1.25rem;
    }
  `]
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  showMessage: boolean = false;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      message: ['', Validators.required]
    })
  }

  onSubmit() {
    console.log(this.contactForm.value);
    this.contactForm.reset();
    this.showMessage = true;
  }

  onClose() {
    this.showMessage = false;
  }
  ngOnInit() {
  }
}
