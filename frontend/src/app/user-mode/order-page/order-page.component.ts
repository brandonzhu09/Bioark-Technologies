import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';


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
  reagentOrdersData: any;
  otherOrdersData: any;
  crisprOrders: MatTableDataSource<any>;
  overexpressionOrders: MatTableDataSource<any>;
  rnaiOrders: MatTableDataSource<any>;
  reagentOrders: MatTableDataSource<any>;
  otherOrders: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  status: string = '';

  crisprNumItems = 0;
  overexpressionNumItems = 0;
  rnaiNumItems = 0;
  reagentNumItems = 0;
  otherNumItems = 0;

  constructor(private userService: UserService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.status = params['status'] || '';
    });

    this.crisprOrders = new MatTableDataSource(this.crisprOrdersData);
    this.overexpressionOrders = new MatTableDataSource(this.overexpressionOrdersData);
    this.rnaiOrders = new MatTableDataSource(this.rnaiOrdersData);
    this.reagentOrders = new MatTableDataSource(this.reagentOrdersData);
    this.otherOrders = new MatTableDataSource(this.otherOrdersData);
  }

  viewOrders() {
    this.userService.viewOrders('Cloning-CRISPR', this.status).subscribe(res => {
      this.crisprOrdersData = res.order_items;
      this.crisprNumItems = res.total;
      this.crisprOrders = new MatTableDataSource(this.crisprOrdersData);
    })
    this.userService.viewOrders('Cloning-Overexpression', this.status).subscribe(res => {
      this.overexpressionOrdersData = res.order_items;
      this.overexpressionNumItems = res.total;
      this.overexpressionOrders = new MatTableDataSource(this.overexpressionOrdersData);
    })
    this.userService.viewOrders('Cloning-RNAi', this.status).subscribe(res => {
      this.rnaiOrdersData = res.order_items;
      this.rnaiNumItems = res.total;
      console.log(res.order_items);
      this.rnaiOrders = new MatTableDataSource(this.rnaiOrdersData);
    })
    this.userService.viewOrders('Reagents', this.status).subscribe(res => {
      this.reagentOrdersData = res.order_items;
      this.reagentNumItems = res.total;
      this.reagentOrders = new MatTableDataSource(this.reagentOrdersData);
    })
    this.userService.viewOrders('Other', this.status).subscribe(res => {
      this.otherOrdersData = res.order_items;
      this.otherNumItems = res.total;
      this.otherOrders = new MatTableDataSource(this.otherOrdersData);
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

    this.reagentOrders.paginator = this.paginator;
    this.reagentOrders.sort = this.sort;

    this.otherOrders.paginator = this.paginator;
    this.otherOrders.sort = this.sort;
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

  applyReagentFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.reagentOrders.filter = filterValue.trim().toLowerCase();

    if (this.reagentOrders.paginator) {
      this.reagentOrders.paginator.firstPage();
    }
  }

  applyOtherFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.otherOrders.filter = filterValue.trim().toLowerCase();

    if (this.otherOrders.paginator) {
      this.otherOrders.paginator.firstPage();
    }
  }


  getBadgeClass(status: string): string {
    switch (status) {
      case 'open':
        return 'bg-info';
      case 'in_progress':
        return 'bg-primary';
      case 'ready_for_delivery':
        return 'bg-warning';
      case 'invoiced':
        return 'bg-danger';
      case 'paid':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  getStatus(status: string) {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in_progress':
        return 'In Progress';
      case 'ready_for_delivery':
        return 'Ready for Delivery';
      case 'invoiced':
        return 'Invoiced';
      case 'paid':
        return 'Paid';
      default:
        return 'Unknown';
    }
  }

  handleCrisprPageEvent(event: any) {
    this.userService.viewOrders('Cloning-CRISPR', this.status, event.pageIndex + 1, event.pageSize).subscribe(res => {
      this.crisprOrdersData = res.order_items;
      this.crisprNumItems = res.total;
      this.crisprOrders = new MatTableDataSource(this.crisprOrdersData);
    })
  }

  handleOverexpressionPageEvent(event: any) {
    this.userService.viewOrders('Cloning-Overexpression', this.status, event.pageIndex + 1, event.pageSize).subscribe(res => {
      this.overexpressionOrdersData = res.order_items;
      this.overexpressionNumItems = res.total;
      this.overexpressionOrders = new MatTableDataSource(this.overexpressionOrdersData);
    })
  }

  handleRnaiPageEvent(event: any) {
    this.userService.viewOrders('Cloning-RNAi', this.status, event.pageIndex + 1, event.pageSize).subscribe(res => {
      this.rnaiOrdersData = res.order_items;
      this.rnaiNumItems = res.total;
      this.rnaiOrders = new MatTableDataSource(this.rnaiOrdersData);
    })
  }

  handleReagentPageEvent(event: any) {
    this.userService.viewOrders('Reagents', this.status, event.pageIndex + 1, event.pageSize).subscribe(res => {
      this.reagentOrdersData = res.order_items;
      this.reagentNumItems = res.total;
      this.reagentOrders = new MatTableDataSource(this.reagentOrdersData);
    })
  }

  handleOtherPageEvent(event: any) {
    this.userService.viewOrders('Other', this.status, event.pageIndex + 1, event.pageSize).subscribe(res => {
      this.otherOrdersData = res.order_items;
      this.otherNumItems = res.total;
      this.otherOrders = new MatTableDataSource(this.otherOrdersData);
    })
  }

}
