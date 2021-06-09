import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

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
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  constructor(
    public afs: AngularFirestore,
    public auth: AngularFireAuth,
    public alert: AlertController,
    private storage: AngularFireStorage,
    public router: Router

  ) { }

  ionViewWillEnter() {

    this.auth.onAuthStateChanged(
      (userData) => {
        if (userData) {
          this.afs.firestore.doc(`Users/${userData.uid}`).get();
        }
      }
    );
  }


  ngOnInit() {
    this.registerFormCreate();

    if (this.registerForm) {
      this.auth.onAuthStateChanged(
        (userData) => {
          if (userData) {
            this.registerForm.controls.email.setValue(userData.email.trim());
            this.registerForm.controls.uid.setValue(userData.uid.trim());
          }
        }
      );
    }
  }

registerFormCreate(){
  this.registerForm = new FormGroup({
    nome: new FormControl(''),
    email: new FormControl(''),
    dataNas: new FormControl(''),
    imageUrl: new FormControl(''),
    uid: new FormControl('')
  });
}

showPreview(event: any) {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e: any) => this.imgSrc = e.target.result;
    reader.readAsDataURL(event.target.files[0]);
    this.selectedImage = event.target.files[0];
  }
  else {
    this.imgSrc = '/assets/img/image_placeholder.jpg';
    this.selectedImage = null;
  }
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
    this.registerForm.patchValue({ image: imageFile });
  }

  onCreateReg(formValue){

    this.isSubmitted = true;
    if (this.registerForm.valid) {
      const filePath = `${formValue.category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            formValue['imageUrl'] = url;
            this.afs.collection('register').doc(this.registerForm.value.uid).set(this.registerForm.value)
      .then(
        () => {
          this.presentAlert();
        }
      )
      .catch(

        // Exibe erro se não salvar
        (error) => {
          alert('Erro ao cadastrar.' + error);
        }
      );
          });
                })
      ).subscribe();
    }
}

// Feedback
// Exibe feedback
async presentAlert() {
  const alert = await this.alert.create({
    header: 'Oba!',
    message: 'Cadastro realizado com sucesso!',
    buttons: [{
      text: 'Ok',
      handler: () => {

        // Reset do formulário
        this.registerForm.reset();

        // Vai para perfil
        this.router.navigate(['/comics/tabs/comics-list']);
      }
    }]
  });

  await alert.present();
}

}
