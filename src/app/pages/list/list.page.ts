import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationEnd, Router, Event } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
})
export class ListPage implements OnInit {

  searchForm: FormGroup;
  contacts: any[] = [];
  filteredContacts: any[] = [];
  noName = '<no name>';
  noAvatar = 'assets/avatar.png';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.userService.getUsers(this.authService.currentUser.uid).subscribe();
    this.userService.contacts$.subscribe(contacts => {
      this.contacts = this.filteredContacts = contacts;
    });
    this.messageService.getMessages().subscribe();
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => event.urlAfterRedirects.includes('list') ? this.unsetContact() : null);

    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });

    this.searchForm
      .get('search')
      .valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((text: string) => {
        console.log(text);
        const word = text.toLowerCase();
        if (!text) {
          this.filteredContacts = [...this.contacts];
        }
        console.log(this.filteredContacts, this.contacts);
        this.filteredContacts = this.contacts.filter((c) =>
          c.displayName?.toLowerCase().includes(word)
        );
      });
  }

  unsetContact(): void {
    this.messageService.setActiveContact(null);
  }

}
