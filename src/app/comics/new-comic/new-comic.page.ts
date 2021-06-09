import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


@Component({
  selector: 'app-new-comic',
  templateUrl: './new-comic.page.html',
  styleUrls: ['./new-comic.page.scss'],
})
export class NewComicPage implements OnInit {
  comicForm: FormGroup;
  constructor( public afs: AngularFirestore, public alert: AlertController, public router: Router, public auth: AngularFireAuth,

    ) { }
  ionViewWillEnter() {

    this.auth.onAuthStateChanged(
      (userData) => {
        if (userData) {
          this.afs.firestore.doc(`register/${userData.uid}`).get();
        }
      }
    );
  }
  ngOnInit() {
    this.comicForm = new FormGroup({
      titulo: new FormControl(null,{}),
      autor: new FormControl(null,{}),
      editora: new FormControl(null,{}),
      dataLan: new FormControl(null,{}),
      edicao: new FormControl(null,{}),
      totaledicao: new FormControl(null,{}),
      formato: new FormControl(null,{}),
      agenda: new FormControl(null,{}),
      status: new FormControl(null,{}),
      image: new FormControl(null),
      uid: new FormControl(null)
    });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.comicForm.patchValue({ image: imageFile });
  }

  onCreateComic() {
    if (!this.comicForm.valid || !this.comicForm.get('image').value) {
      return;
    }
    this.afs.collection('quadrinhos').doc(this.comicForm.value.uid).set(this.comicForm.value)
      .then(
        () => {

          // Feedback
          this.presentAlert();
        }
      )
      .catch(

        // Exibe erro se não salvar
        (error) => {
          alert('Erro ao cadastrar.' + error);
        }
      );
  }
  async presentAlert() {
    const alert = await this.alert.create({
      header: 'Oba!',
      message: 'Cadastro realizado com sucesso!',
      buttons: [{
        text: 'Ok',
        handler: () => {

          // Reset do formulário
          this.comicForm.reset();

          // Vai para perfil
          this.router.navigate(['comics/tabs/comics-list']);
        }
      }]
    });

    await alert.present();
  }

}
