import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, last, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private allContacts: any[] = [];
  contactsSource = new BehaviorSubject<any[]>([]);
  contacts$ = this.contactsSource.asObservable();

  userRef = this.db.collection('users');

  constructor(private db: AngularFirestore) {}

  getUsers(uid: string): Observable<any[]> {
    return this.userRef.valueChanges().pipe(
      map((users) => users.map((user: any) => ({ ...user, new: 0 }))),
      tap((contacts) => {
        this.allContacts = contacts.filter((c) => c.uid !== uid);
        this.contactsSource.next(this.allContacts);
      })
    );
  }

  addUserIfNotExists(user: any, displayName: string): void {
    const { email, photoURL, uid } = user;
    this.getUsers(uid).pipe(first()).subscribe((users) => {
      if (!users.find((u) => u.email === email)) {
        this.userRef.add({ displayName, email, photoURL, uid });
      }
    });
  }

  alertNewMessage(lastMessage: any, uid: string): void {
    const otherContacts = this.allContacts.filter(
      (c) => c.uid !== lastMessage.from
    );
    const lastContact = this.allContacts.find(
      (c) => c.uid === lastMessage.from
    );

    console.log(lastContact, lastMessage);
    if (lastContact && lastMessage && lastMessage.from !== uid) {
      lastContact.new = lastContact.new + 1;
    }

    if (lastContact) {
      this.allContacts = [lastContact, ...otherContacts];
    } else {
      this.allContacts = [...otherContacts];
    }

    this.contactsSource.next(this.allContacts);
  }

  markAsRead(uid: string): void {
    const updatedContacts = this.allContacts.map((contact) =>
      contact.uid === uid
        ? { ...contact, new: 0 }
        : contact
    );
    this.allContacts = updatedContacts;
    this.contactsSource.next(updatedContacts);
  }
}
