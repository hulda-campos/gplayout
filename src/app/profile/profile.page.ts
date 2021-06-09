import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  item: any;

  constructor(public auth: AngularFireAuth,
    public afs: AngularFirestore,
    private router: Router,) { }

    ionViewWillEnter() {

      // Obtém dados do ligin
      this.auth.onAuthStateChanged(
        (userData) => {
          if (userData ) {

            // Consulta cadastro no database
            this.afs.firestore.doc(`register/${userData.uid}`).get()
              .then((uData) => {

                if (!uData.exists) {

                  // Se não tem cadastro, vai para a página de cadastro
                  this.router.navigate(['/register']);
                } else {

                  // Se tem cadastro, exibe perfil
                  this.item = uData.data();
                }
              });
          }
        }
      );
    }

    ngOnInit() { }

    // 3) Abre perfil no Google
    profile() {
      window.open('https://myaccount.google.com/');
      return false;
    }

  }

