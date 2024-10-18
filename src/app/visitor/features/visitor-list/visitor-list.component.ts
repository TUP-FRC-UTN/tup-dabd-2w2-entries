import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableColumn, TableComponent, TablePagination } from 'ngx-dabd-grupo01';
import { Observable } from 'rxjs';
import { Visitor } from '../../../models/visitors/visitor.model';
import { VisitorService } from '../../../services/visitors/visitor.service';

@Component({
  selector: 'app-visitor-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterOutlet, TableComponent],
  templateUrl: './visitor-list.component.html',
})
export class VisitorListComponent {
  
  visitors: Visitor[] = [];
  private visitorService = inject(VisitorService);
  isLoading = true;
  searchFilter: string = ''; 
  
  columns: TableColumn[] =[
    { headerName: 'Nombre', accessorKey: 'name' },
    { headerName: 'Apellido', accessorKey: 'last_name' },
    { headerName: 'Tipo de documento', accessorKey: 'doc_type' },
    { headerName: 'Numero de documento', accessorKey: 'doc_number' },
    { headerName: 'Fecha de Nacimiento', accessorKey: 'birth_date' },
  ];

  page: number = 1;
  size: number = 100;
  totalItems: number = 0;
 

  ngOnInit(): void {
    this.loadVisitors();
  }

  loadVisitors(filter?: string): void {
    this.isLoading = true;
    this.visitorService.getVisitors(this.page -1, this.size , filter).subscribe({
    next: (data) => {
      console.log(data)
      this.visitors = data.items;
      this.totalItems = data.total_elements;
      this.isLoading = false;
    },
    error : (error) => {
      console.log(error);
    }
    });
  }

 
  onPageChange = (page: number): void => {
    this.page = page;
    this.loadVisitors();
  };

  onPageSizeChange = (size: number): void => {
    this.size = size;
    this.loadVisitors();
  };

 onFilterChange = (filter: string): void => {
    console.log(filter);
    
    if(filter === '') {
      this.loadVisitors();
    }else{
      this.loadVisitors(filter);
    }
  };

  deleteVisitor(id: number): void {
    if (confirm('¿Está seguro que quiere eliminar este visitante?')) {
      this.visitorService.deleteVisitor(id).subscribe(() => {
        this.visitors = this.visitors.filter((v) => v.visitor_id !== id);
      });
    }
  }
}
