import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-talk',
  templateUrl: 'talk.page.html',
  styleUrls: ['talk.page.scss'],
})
export class TalkPage implements OnInit, AfterViewChecked {

  @ViewChild('content') content: IonContent;
  messages$: Observable<any[]>;
  messageForm: FormGroup;
  selected: string;
  contactName: string;
  noName = '<no name>';

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.selected = this.route.snapshot.params.uid;
    this.userService.markAsRead(this.selected);
    this.messageService.setActiveContact(this.selected);
    this.messages$ = this.messageService.showMessages$;
    this.messages$.subscribe(messages => console.log(messages));
    this.messageForm = new FormGroup({
      message: new FormControl(''),
    });
    this.userService.contacts$.subscribe(contacts => {
      this.contactName = contacts.find(c => c.uid === this.selected).displayName;
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.content.scrollToBottom();
  }

  handleSubmit(ev: any): void {
    if (ev.key && ev.key !== 'Enter') {
      return;
    }
    const text = this.messageForm.value.message;
    if (text) {
      this.sendMessage(text);
      this.messageForm.reset();
      this.scrollToBottom();
    }
  }

  sendMessage(text: string): void {
    const from = this.authService.currentUser.uid;
    const to = this.route.snapshot.params.uid;
    // const timestamp = new Date().toISOString();
    const message = { text, from, to };
    this.messageService.sendMessage(message);
  }

  unsetContact(): void {
    this.messageService.setActiveContact(null);
  }

}
