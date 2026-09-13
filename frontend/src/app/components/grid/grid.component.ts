import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, Subject } from 'rxjs';

import { ItemService } from '../../services/item.service';
import { Item, GridResponse } from '../../models/item.model';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ScrollingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule
  ],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  items: Item[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'address', 'createdAt', 'actions'];
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  sortBy: string = 'id';
  sortOrder: string = 'asc';
  searchText: string = '';
  isLoading: boolean = false;

  private searchSubject = new Subject<string>();

  constructor(
    private itemService: ItemService,
    private dialog: MatDialog
  ) {
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(searchText => {
      this.searchText = searchText;
      this.currentPage = 0;
      this.loadItems();
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading = true;
    this.itemService.getItems(
      this.currentPage + 1,
      this.pageSize,
      this.sortBy,
      this.sortOrder,
      this.searchText
    ).subscribe({
      next: (response: GridResponse) => {
        this.items = response.items;
        this.totalItems = response.totalCount;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadItems();
  }

  onSortChange(event: Sort): void {
    this.sortBy = event.active;
    this.sortOrder = event.direction.toLowerCase() || 'asc';
    this.currentPage = 0;
    this.loadItems();
  }

  editItem(item: Item): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: { item: { ...item } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemService.updateItem(item.id, result).subscribe({
          next: () => {
            this.loadItems();
          },
          error: (error) => console.error('Error updating item:', error)
        });
      }
    });
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.deleteItem(id).subscribe({
        next: () => {
          this.loadItems();
        },
        error: (error) => console.error('Error deleting item:', error)
      });
    }
  }
}
