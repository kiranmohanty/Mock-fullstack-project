import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClient } from '@angular/common/http';

interface GridItem {
  id: number;
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ScrollingModule],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnInit {
  @ViewChild('viewport') viewport: any;

  data: GridItem[] = [];
  filteredData: GridItem[] = [];
  gridRows: GridItem[][] = [];
  searchTerm: string = '';
  itemHeight: number = 120;
  itemsPerRow: number = 5;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // Mock data generation - replace with actual API call
    this.data = this.generateMockData(100);
    this.filteredData = [...this.data];
    this.organizeIntoRows();
  }

  private generateMockData(count: number): GridItem[] {
    const mockData: GridItem[] = [];
    for (let i = 1; i <= count; i++) {
      mockData.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        phone: `555-${String(i).padStart(4, '0')}`,
      });
    }
    return mockData;
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    this.filteredData = this.data.filter((item) =>
      this.matchesSearchTerm(item)
    );
    this.organizeIntoRows();
  }

  private matchesSearchTerm(item: GridItem): boolean {
    const term = this.searchTerm;
    return (
      item.name.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.phone.toLowerCase().includes(term)
    );
  }

  private organizeIntoRows(): void {
    this.gridRows = [];
    for (let i = 0; i < this.filteredData.length; i += this.itemsPerRow) {
      this.gridRows.push(
        this.filteredData.slice(i, i + this.itemsPerRow)
      );
    }
  }

  trackByRowId(index: number, row: GridItem[]): string {
    return row[0]?.id?.toString() || String(index);
  }

  trackByItemId(index: number, item: GridItem): number {
    return item.id;
  }
}
