import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    public auth: AngularFireAuth,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp(){
    this.platform.ready().then(() =>{
      if(Capacitor.isPluginAvailable('SplashScreen')){
        SplashScreen.hide();
      }
    });
  }
  logout() {
    this.auth.signOut()
    .then(
      () => {
        this.router.navigate(['login']);
      }
    )
    .catch(
      (error) => {
        console.error(error);
      }
    );
    }
}
