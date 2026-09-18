import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  sent = false;

  saving = false;

  sendMessage(): void {
    this.sent = false;
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.sent = true;
    }, 700);
  }
}
