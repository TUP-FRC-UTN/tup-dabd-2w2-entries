import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgClass, NgIf} from '@angular/common';
import {AccessService} from "../../../services/access.service";
import {AuthService} from "../../../services/auth.service";
import Swal from "sweetalert2";
import {LoginService} from "../../../services/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {VisitorService} from "../../../services/visitor.service";
import { NgxScannerQrcodeComponent, NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QrComponent } from "../../../old/qr/features/qr/qr.component";

@Component({
  selector: 'app-access-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    NgxScannerQrcodeModule,
    CommonModule,
    QrComponent
],
  templateUrl: './access-form.component.html',
  styleUrl: './access-form.component.css'
})
export class AccessFormComponent implements OnInit {

@ViewChild('scanModal') scannerComponent!: NgxScannerQrcodeComponent

  accessForm: FormGroup = {} as FormGroup;
  checkButtonDisabled = true;

  private accessService = inject(AccessService)
  private url = inject(ActivatedRoute)
  private modalService = inject(NgbModal)

  constructor(private fb: FormBuilder, private authService: AuthService, private loginService: LoginService, private router: Router, private visitorService: VisitorService) {
  }

  ngOnInit(): void {
    this.accessForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      plot_id: ['', Validators.required],
      doc_number: [null, Validators.required],
      action: ['ENTRY', Validators.required], // Nueva acción (ENTRY/SALIDA)
      vehicle_type: ['CAR', Validators.required], // Tipo de vehículo (CAR/MOTORBIKE/etc.)
      vehicle_reg: ['', Validators.required], // Matrícula del vehículo
      vehicle_description: [''], // Descripción detallada del vehículo
      comments: [''] // Comentarios adicionales
    });
    this.accessForm.get('last_name')?.disable();
    this.accessForm.get('first_name')?.disable();
    this.accessForm.get('plot_id')?.disable();

    const lote = this.url.snapshot.queryParamMap.get('lote');
    const doc_number = this.url.snapshot.queryParamMap.get('doc_number');

    if(lote && doc_number){
      this.accessForm.get('doc_number')?.patchValue(doc_number);
      this.accessForm.get('plot_id')?.patchValue(lote);
      this.autocompleteFields(Number(doc_number) , lote);
    }

  }

// Método que se puede llamar desde el HTML al escanear
onScanComplete(data: any) {
  const value = data[0].value;
  const document = value.split('Document: ')[1]; // "46222977"
  this.accessForm.get('doc_number')?.patchValue(document);
  this.autocompleteFields(Number(document));
}


openScanModal() {
this.modalService.open(this.scannerComponent, { centered: true, size: 'lg'});
}

  onSubmit() {
    if (this.accessForm.valid) {
      const formData = this.accessForm.value;
let plate = this.accessForm.get('vehicle_reg')?.value
      if (plate != null) {
        this.visitorService.checkAccess(plate,this.accessForm.get('action')?.value).subscribe(data => {
          if (!data) {
            let text = this.accessForm.get('action')?.value == 'ENTRY' ? 'Entrada' : 'Salida'

            Swal.fire({
              title: text + ' inconsistente',
              text: 'Con esa patente lo ultimo que se registró fue una ' + text.toLowerCase() + ' está seguro de querer registrar otra ' + text.toLowerCase() + '?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Cancelar',
              cancelButtonText: 'Continuar',
              customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-primary'
              }
            }).then((result) => {
              if (result.isDismissed) {
                this.accessService.createAccess(formData, this.loginService.getLogin().id.toString()).subscribe(data => {
                  Swal.fire('Registro exitoso...', "Se registró correctamente", 'success');
                  this.ngOnInit()
                  this.router.navigate(['/access/list']);
                });
              }
            });
          } else {
            this.accessService.createAccess(formData, this.loginService.getLogin().id.toString()).subscribe(data => {
              Swal.fire('Registro exitoso...', "Se registró correctamente", 'success');
              this.ngOnInit()
              this.router.navigate(['/access/list']);
            });
          }
        })
      }


    } else {

      this.markAllAsTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/access/list']);
  }

  onDocNumberChange(event: any) {
    let document = this.accessForm.get('doc_number')?.value;
    this.autocompleteFields(document); // Llama a la función para autocompletar
  }


  autocompleteFields(document: number , lote?: string) {
    if (document != null) {
      this.checkButtonDisabled = false;
    } else {
      this.checkButtonDisabled = true;
      return;
    }
debugger
    this.visitorService.getVisitor(document).subscribe(data => {
      
      switch (data.body) {
        case null:
          this.accessForm.get('last_name')?.setValue("");
          this.accessForm.get('first_name')?.setValue("");
          this.accessForm.get('doc_number')?.setErrors({ unauthorized: true });
          break;
        default:
          this.accessForm.get('last_name')?.setValue(data.body.last_name);
          this.accessForm.get('first_name')?.setValue(data.body.name);
          this.accessForm.get('plot_id')?.setValue(lote);
          this.accessForm.get('doc_number')?.setErrors(null);
          let plots = "";
          this.authService.getValid(document).subscribe(data => {
            data.forEach(auth => {
              plots += auth.plot_id?.toString() + ", ";
            });
            plots = plots.slice(0, plots.length - 2);
            this.accessForm.get('plot_id')?.setValue(plots);
          });
      }
    });
  }
  private markAllAsTouched(): void {
    Object.values(this.accessForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  isAuthorized() {
    let document = this.accessForm.get('doc_number')?.value
    if (this.accessForm.get('doc_number')?.hasError('unauthorized')) {
      Swal.fire({
        title: 'No registrado',
        text: 'Consulte al propietario si autoriza su entrada',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Cerrar',
        cancelButtonText: 'Ir a registrar',
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary'
        }
      }).then((result) => {
        if (result.isDismissed) {
          this.router.navigate(['/auth/form'], { queryParams: { doc_number: document } });
        }
      });
      return
    }
    debugger
    this.authService.getValid(document).subscribe(data => {
      if (data.length > 0) {
        Swal.fire('Autorizado', 'Tiene permitido el ingreso', "success")
      } else {
        Swal.fire({
          title: 'No Autorizado',
          text: 'Consulte al propietario si autoriza su entrada',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Cerrar',
          cancelButtonText: 'Ir a registrar',
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-primary'
          }
        }).then((result) => {
          if (result.isDismissed) {
            this.router.navigate(['/auth/form']);
          }
        });
      }
    })
  }
}
