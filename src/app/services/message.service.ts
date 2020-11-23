import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  private allMessages: any[] = [];
  private activeContact: string;
  private isFirst = true;
  showMessagesSource = new BehaviorSubject<any[]>([]);
  showMessages$ = this.showMessagesSource.asObservable();

  messageRef = this.db.collection('messages');
  receivedMessagesRef = this.db.collection('messages', ref => ref.where('to', '==', this.authService.currentUser.uid));
  sendedMessagesRef = this.db.collection('messages', ref => ref.where('from', '==', this.authService.currentUser.uid));


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private db: AngularFirestore,
  ) {}

  getMessages(): Observable<any[]> {
    return combineLatest([this.receivedMessagesRef.valueChanges(), this.sendedMessagesRef.valueChanges()]).pipe(
      switchMap((messages: any) => {
        const [received, sended] = messages;
        return of(received.concat(sended).sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds));
      }),
      tap(messages => {
        console.log(messages);
        if (messages.length > 0 && !this.isFirst) {
          const lastMessage = messages[messages.length - 1];
          this.userService.alertNewMessage(lastMessage, this.activeContact);
        }
        this.isFirst = false;
        if (this.activeContact) {
          const contactMessages = messages.filter((m: any) => m.from === this.activeContact || m.to === this.activeContact);
          this.showMessagesSource.next([...contactMessages]);
        }
        this.allMessages = messages;
      })
    );
  }

  sendMessage(message: any): void {
    this.messageRef.add({
      ...message,
      timestamp: firebase.default.firestore.FieldValue.serverTimestamp()
    });
  }

  setActiveContact(uid: string): void {
    this.activeContact = uid;
    if (!uid) {
      this.showMessagesSource.next([]);
    }
    const contactMessages = this.allMessages.filter(m => m.from === uid || m.to === uid);
    this.showMessagesSource.next([...contactMessages]);
  }

}
