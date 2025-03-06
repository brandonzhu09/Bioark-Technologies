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
  displayedColumns: string[] = ['order_id', 'order_placed_date', 'work_period', 'est_delivery_date', 'product_sku', 'product_name', 'quantity', 'total_price', 'status'];
  crisprOrdersData: any;
  overexpressionOrdersData: any;
  rnaiOrdersData: any;
  crisprOrders: MatTableDataSource<any>;
  overexpressionOrders: MatTableDataSource<any>;
  rnaiOrders: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  crisprNumItems = 0;
  overexpressionNumItems = 0;
  rnaiNumItems = 0;

  constructor(private userService: UserService) {
    this.crisprOrders = new MatTableDataSource(this.crisprOrdersData);
    this.overexpressionOrders = new MatTableDataSource(this.overexpressionOrdersData);
    this.rnaiOrders = new MatTableDataSource(this.rnaiOrdersData);
  }

  viewOrders() {
    this.userService.viewCloningCRISPROrders().subscribe(res => {
      this.crisprOrdersData = res.order_items;
      this.crisprNumItems = res.total;
      this.crisprOrders = new MatTableDataSource(this.crisprOrdersData);
    })
    this.userService.viewCloningOverexpressionOrders().subscribe(res => {
      this.overexpressionOrdersData = res.order_items;
      this.overexpressionNumItems = res.total;
      this.overexpressionOrders = new MatTableDataSource(this.overexpressionOrdersData);
    })
    this.userService.viewCloningRNAiOrders().subscribe(res => {
      this.rnaiOrdersData = res.order_items;
      this.rnaiNumItems = res.total;
      this.rnaiOrders = new MatTableDataSource(this.rnaiOrdersData);
    })
  }

  ngOnInit() {
    this.viewOrders();
  }

  ngAfterViewInit() {
    this.crisprOrders.paginator = this.paginator;
    this.crisprOrders.sort = this.sort;

    this.overexpressionOrders.paginator = this.paginator;
    this.overexpressionOrders.sort = this.sort;

    this.rnaiOrders.paginator = this.paginator;
    this.rnaiOrders.sort = this.sort;
  }

  applyCrisprFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.crisprOrders.filter = filterValue.trim().toLowerCase();

    if (this.crisprOrders.paginator) {
      this.crisprOrders.paginator.firstPage();
    }
  }

  applyOverexpressionFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.overexpressionOrders.filter = filterValue.trim().toLowerCase();

    if (this.overexpressionOrders.paginator) {
      this.overexpressionOrders.paginator.firstPage();
    }
  }

  applyRnaiFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.rnaiOrders.filter = filterValue.trim().toLowerCase();

    if (this.rnaiOrders.paginator) {
      this.rnaiOrders.paginator.firstPage();
    }
  }


  getBadgeClass(status: string): string {
    switch (status) {
      case 'in_progress':
        return 'bg-primary'; // Blue
      case 'ready_for_delivery':
        return 'bg-warning'; // Green
      case 'arrived':
        return 'bg-success'; // Green
      default:
        return 'bg-secondary'; // Grey for unknown status
    }
  }

  getStatus(status: string) {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'ready_for_delivery':
        return 'Ready for Delivery';
      case 'arrived':
        return 'Arrived';
      default:
        return 'Unknown Status';
    }
  }

  handleCrisprPageEvent(event: any) {
    this.userService.viewCloningCRISPROrders(event.pageIndex + 1, event.pageSize).subscribe(res => {
      this.crisprOrdersData = res.order_items;
      this.crisprNumItems = res.total;
      this.crisprOrders = new MatTableDataSource(this.crisprOrdersData);
    })
  }

  handleOverexpressionPageEvent(event: any) {
    this.userService.viewCloningOverexpressionOrders(event.pageIndex + 1, event.pageSize).subscribe(res => {
      this.overexpressionOrdersData = res.order_items;
      this.overexpressionNumItems = res.total;
      this.overexpressionOrders = new MatTableDataSource(this.overexpressionOrdersData);
    })
  }

  handleRnaiPageEvent(event: any) {
    this.userService.viewCloningRNAiOrders(event.pageIndex + 1, event.pageSize).subscribe(res => {
      this.rnaiOrdersData = res.order_items;
      this.rnaiNumItems = res.total;
      this.rnaiOrders = new MatTableDataSource(this.rnaiOrdersData);
    })
  }

}
