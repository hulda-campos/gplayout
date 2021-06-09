import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/auth';
import { TemplateService } from '../services/template.service';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function removeSpaces(control: AbstractControl) {
  if (control && control.value && !control.value.replace(/\s/g, '').length) {
    control.setValue('');
  }
  return null;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;

  constructor(
    public auth: AngularFireAuth,
     public loadingCtrl: LoadingController,
     public router: Router,
     public alertCtrl: AlertController,
     public templateService: TemplateService
  ) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.email, removeSpaces]),
      ),
      password: new FormControl('',
      Validators.compose([ Validators.required, Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]+$')])
      )
    });
  }

  async signUpWithEmailPassword() {
    const loading = await this.loadingCtrl.create();
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
     firebase.auth().createUserWithEmailAndPassword(email, password)
       .then(() => {
         // Signed in
         loading.dismiss().then(() => {
         this.presentAlert();
       })
       .catch((error) => {
         if (error === 'code: "auth/email-already-in-use"'){
          loading.dismiss();
            this.presentAlert();

         }
      }
     );
      });
     return  await loading.present();
     // [END auth_signup_password]
   }

   async feedback() {
    const alert = await this.alertCtrl.create({
      header: 'Ops.',
      message: 'O e-mail ja está sendo usado!',
      buttons: [{
        text: 'OK',
        handler: () => {
        }
      }]
    });

    await alert.present();
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Oba!',
      message: 'Cadastro realizado com sucesso!',
      buttons: [{
        text: 'Ok',
        handler: () => {


          this.signupForm.reset();


          this.router.navigate(['register']);
        }
      }]
    });

    await alert.present();
  }
}
