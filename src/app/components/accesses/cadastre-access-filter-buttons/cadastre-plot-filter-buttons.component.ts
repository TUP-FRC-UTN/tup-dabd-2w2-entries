import {Component, inject, Input} from '@angular/core';
import {Subject} from 'rxjs';
import {CadastreExcelService} from '../../../services/cadastre-excel.service';
import {Router} from '@angular/router';
import {AccessService} from "../../../services/access.service";
import {TransformResponseService} from "../../../services/transform-response.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-cadastre-plot-filter-buttons',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './cadastre-plot-filter-buttons.component.html',
  styleUrl: './cadastre-plot-filter-buttons.component.css'
})
export class CadastrePlotFilterButtonsComponent<T extends Record<string, any>> {
  private router = inject(Router);
  filterText: string = ""
  private transformResponseService = inject(TransformResponseService)
  // Reemplazen con su servicio para el getAll.
  private service = inject(AccessService)
  // Inject the Excel service for export functionality
  private excelService = inject(CadastreExcelService);

  LIMIT_32BITS_MAX = 2147483647

  // Input to receive the HTML table from the parent
  @Input() tableName!: HTMLTableElement;
  // Input to receive a generic list from the parent component
  @Input() itemsList!: T[];
  @Input() heads!: string[];
  @Input() props!: string[];
  // Input to redirect to the form.
  @Input() formPath: string = "";
  // Represent the name of the object for the exports.
  // Se va a usar para los nombres de los archivos.
  @Input() objectName: string = ""
  // Represent the dictionaries of ur object.
  // Se va a usar para las traducciones de enum del back.
  @Input() dictionaries: Array<{ [key: string]: any }> = [];

  // Subject to emit filtered results
  private filterSubject = new Subject<string>();
  // Observable that emits filtered owner list
  filter$ = this.filterSubject.asObservable();

  ngOnInit(): void {
  }

  // Se va a usar para los nombres de los archivos.
  getActualDayFormat() {
    const today = new Date();

    const formattedDate = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

    return formattedDate;
  }

  /**
   * Export the HTML table to a PDF file.
   * Calls the `exportTableToPdf` method from the `CadastreExcelService`.
   */
  exportToPdf() {
        this.excelService.exportListToPdf(this.itemsList, this.heads, this.props, `${this.getActualDayFormat()}_${this.objectName}`);


  }

  /**
   * Export the HTML table to an Excel file (.xlsx).
   * Calls the `exportTableToExcel` method from the `CadastreExcelService`.
   */
  //#region TIENEN QUE MODIFICAR EL SERIVCIO CON SU GETALL
  exportToExcel() {

        this.excelService.exportListToExcel(this.itemsList, this.heads, this.props, `${this.getActualDayFormat()}_${this.objectName}`);

  }

  //#endregion

  /**
   * Filters the list of items based on the input value in the text box.
   * The filter checks if any property of the item contains the search string (case-insensitive).
   * The filtered list is then emitted through the `filterSubject`.
   *
   * @param event - The input event from the text box.
   */
  onFilterTextBoxChanged(event: Event) {
    const target = event.target as HTMLInputElement;

    this.filterSubject.next(target.value.toLowerCase());

  }

  /**
   * Translates a value using the provided dictionary.
   *
   * @param value - The value to translate.
   * @param dictionary - The dictionary used for translation.
   * @returns The key that matches the value in the dictionary, or undefined if no match is found.
   */
  translateDictionary(value: any, dictionary?: { [key: string]: any }) {
    if (value !== undefined && value !== null && dictionary) {
      for (const key in dictionary) {
        if (dictionary[key].toString().toLowerCase() === value.toLowerCase()) {
          return key;
        }
      }
    }
    return;
  }

  /**
   * Redirects to the specified form path.
   */
  redirectToForm() {
    console.log(this.formPath);
    this.router.navigate([this.formPath]);
  }

  clearFilter() {
    this.filterText = ""
  }
}
