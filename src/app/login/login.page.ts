import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    public alert: AlertController,
    public afs: AngularFirestore,
  ) { }

  ngOnInit() {
  }
  loginGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())

      // Se o login funcionar
      .then(
        (data: any) => {

          console.log(data.user.displayName, data.user.uid);

          this.afs.firestore.doc(`register/${data.user.uid}`).get()
            .then((uData) => {

              // Se tem perfil
              if (uData.exists) {
                this.feedback(
                  data.user.displayName,
                  'Você já pode acessar o conteúdo restrito.',
                  '/comics/tabs/comics-list'
                );
              } else {
                this.feedback(
                  data.user.displayName,
                  'Você precisa completar seu cadastro para acessar o conteúdo restrito.',
                  '/register'
                );
              }
            });
        }
      )

      // Se o login falhar
      .catch(
        (error) => {
          console.log(error);
        }
      );
  }

  // 5) Feeback e saida da página
  async feedback(userName: string, message: string, routerLink: string) {
    const alert = await this.alert.create({
      header: `Olá ${userName}!`,
      message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate([routerLink]);
        }
      }]
    });

    await alert.present();
  }
}
