import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.css'
})
export class OrderPageComponent {
  displayedColumns: string[] = ['order_class', 'order_id', 'order_placed_date', 'est_work_period', 'product_sku', 'product_name', 'unit_size', 'quantity', 'total_price', 'transaction_status'];
  orders: any;
  ordersData: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) {
    this.ordersData = new MatTableDataSource(this.orders);
  }

  viewOrders() {
    this.userService.viewOrders().subscribe(res => {
      this.orders = res;
      this.ordersData = new MatTableDataSource(this.orders);
    })
  }

  ngOnInit() {
    this.viewOrders();
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
