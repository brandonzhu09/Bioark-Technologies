import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.css'
})
export class OrderPageComponent {
  displayedColumns: string[] = ['id'];
  ordersData: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    const orders = [{ 'id': 1 }, { 'id': 2 }];
    this.ordersData = new MatTableDataSource(orders);
  }

  ngAfterViewInit() {
    this.ordersData.paginator = this.paginator;
    this.ordersData.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ordersData.filter = filterValue.trim().toLowerCase();

    if (this.ordersData.paginator) {
      this.ordersData.paginator.firstPage();
    }
  }

}
