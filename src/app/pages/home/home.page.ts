import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  login(email: string) {
    this.authService.signInWithEmail(email, '123456').subscribe(
      () => {},
      async (err) => {
        switch (err.code) {
          case 'auth/user-not-found':
            await this.presentAlertPrompt(email);
            // this.authService.registerWithEmail(email, '123456').subscribe();
            break;
          case 'auth/wrong-password':
            await this.presentToast(err.message);
            break;
          default:
            await this.presentToast('Unexpected error. Try again soon.');
        }
      }
    );
  }

  async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
    });
    toast.present();
  }

  async presentAlertPrompt(email: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Welcome!',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Your name',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: ({name}) => {
            console.log('Confirm Ok');
            this.authService.registerWithEmail(email, '123456', name).subscribe();
          },
        },
      ],
    });

    await alert.present();
  }
}
