import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {CustomValidators} from "ng2-validation";
import {ContactService} from "./contact.service";

@Component({
  selector: 'portfolio-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
  providers: [ContactService]
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  showMessage: boolean = false;

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.createForm();
  }

  createForm() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      message: ['', Validators.required]
    })
  }

  sendContact() {
    this.contactService.sendContact(this.contactForm.value).subscribe(
      res => console.log(res.json()),
      err => console.log(err)
    );
    this.contactForm.reset();
    this.showMessage = true;
  }
  onSubmit() {
    console.log(this.contactForm.value);
    this.sendContact();
  }

  onClose() {
    this.showMessage = false;
  }
  ngOnInit() {
  }
}
