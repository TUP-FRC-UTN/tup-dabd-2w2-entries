import { Component } from '@angular/core';
import { QrService } from '../../../services/qr/qr.service';

@Component({
  selector: 'app-qr-form',
  standalone: true,
  imports: [],
  templateUrl: './qr-form.component.html',
  styleUrl: './qr-form.component.scss',
})
export class QrFormComponent {
  docNumber: number = 0;
  qrImageSrc: string = '';

  constructor(private qrService: QrService) {}

  generateQr() {
    this.qrService.getQr(this.docNumber).subscribe((response) => {
      const reader = new FileReader();
      reader.readAsDataURL(response);
      reader.onloadend = () => {
        this.qrImageSrc = reader.result as string;
      };
    });
  }
}
