import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root',
  })
  export class TemplateService {
    constructor(
      public auth: AngularFireAuth,
      private http: HttpClient,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public firestore: AngularFirestore,
        ) { }

          userSend(email: string, password: string): Promise<void> {
            const uid = this.firestore.createId();

            return this.firestore.doc(`register/${uid}`).set({
              uid,
              email,
              password,
            });
          }
          registerUser(email, password) {
            this.auth.createUserWithEmailAndPassword(email, password);
          }

  }
