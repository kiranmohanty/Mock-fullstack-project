import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridService } from '../../services/grid.service'; // Hypothetical backend service path
import { GridItem } from '../../models/grid-item.model';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  private gridService = inject(GridService);

  // Use Signals to manage grid state natively
  gridData = signal<GridItem[]>([]);
  isLoading = signal<boolean>(false);
  searchTerm = signal<string>('');

  // Derived state updates automatically when dependencies change
  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.gridData();
    return this.gridData().filter(item => 
      item.name.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadGridData();
  }

  loadGridData(): void {
    this.isLoading.set(true);
    this.gridService.getItems().subscribe({
      next: (data) => {
        this.gridData.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  deleteItem(id: number): void {
    this.gridService.deleteItem(id).subscribe(() => {
      // Functional state mutation via .update()
      this.gridData.update(items => items.filter(item => item.id !== id));
    });
  }
}
