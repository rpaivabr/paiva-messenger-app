import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { from, Observable, of, pipe } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: any;

  constructor(private auth: AngularFireAuth, private router: Router, private userService: UserService) {
    this.auth.authState.subscribe(user => this.currentUser = user);
  }

  isLogged(): Observable<boolean> {
    return this.auth.authState.pipe(
      map(user => !!user)
    );
  }

  signInWithEmail(email: string, password: string): Observable<any> {
    return from(this.auth.signInWithEmailAndPassword(email, password)).pipe(
      map(() => this.router.navigate(['/list']))
    );
  }

  registerWithEmail(email: string, password: string, name: string): Observable<any> {
    return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(
      map((res: any) => {
        this.userService.addUserIfNotExists(res.user, name);
        this.signOut().subscribe(() => {
          this.signInWithEmail(email, password).subscribe(() => {
            this.router.navigate(['/list']);
          });
        });
      })
    );
  }

  signOut(): Observable<void> {
    return from(this.auth.signOut());
  }

}
