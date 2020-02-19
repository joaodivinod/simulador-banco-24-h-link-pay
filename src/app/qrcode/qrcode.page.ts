import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

export interface AtivarSaque {
  task: string;
  type: string;
  createdAt: any;
  idClient: string;
  value: string;
}

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})

export class QrcodePage implements OnInit {


  mostraValores: boolean = false;

  retirarDinheiro: boolean = false;

  valoresSaque = [
    {
      valor: "R$ 50.00",
      valor2: "R$ 100.00"
    },
    {
      valor: "R$ 150.00",
      valor2: "R$ 200.00"
    },
    {
      valor: "R$ 250.00",
      valor2: "R$ 300.00"
    },
  ]

  valorIDQrcode: string;

  private eventSacar: AngularFirestoreCollection<any>;
  private listevent: Array<any>;

  constructor(db: AngularFirestore, public toastController: ToastController, public loadingController: LoadingController) {
    this.eventSacar = db.collection<AtivarSaque>('saques');
    this.valorIDQrcode = Math.random().toString(36).substring(2);
  }

  ngOnInit() {
    this.eventSacar.snapshotChanges().subscribe(res => {
      this.listevent = res.map(r => {
        let data = r.payload.doc.data() as AtivarSaque;
        return { data };
      });

      console.log(this.listevent);
      this.listevent.forEach(item => {
        if (item.data.value == this.valorIDQrcode) {
          this.presentLoading();
          this.presentToast();
          setTimeout(() => {
            this.mostraValores = true;
          }, 1700);
        } else {
          this.mostraValores = false;
        }
      });

    }, err => {
      console.log(err);
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Autenticação efetuada com sucesso!',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Carregando...',
      duration: 2000
    });
    await loading.present();
  }

  sacar() {
    this.presentLoading();
    setTimeout(() => {
      this.retirarDinheiro = true;
    }, 1800);
  }

}
