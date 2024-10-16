import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  productsData = [
    { name: 'Overexpression Targeted Knock-In', description: 'The product offers a tool for integrating target genes or regulatory cassettes into designated safe harbor sites, such as AAVS1, CCR5.', link: '/products/overexpression', image: '../../assets/Product-1 Overexpression Targeted Knock-In.jpg' },
    { name: 'Gene Knock-In Tagging', description: 'The product offers versatile options for attaching selected tags to the 3\' and 5\' ends of target genes.', link: 'products/gene-knock-in', image: '../../assets/Product-2 Gene Knock-In Tagging.jpg' },
    { name: 'Gene Knock-out', description: 'The product provides a rapid and efficient approach to disrupt gene expression for both research and therapeutic applications.', link: 'products/gene-knock-out', image: '../../assets/Product-3 Gene Knock-out.jpg' },
    { name: 'Gene Deletion', description: 'The product offers a tool for efficiently deleting genomic fragments of various sizes, ranging from short to large deletions over 10 kb.', link: 'products/gene-deletion', image: '../../assets/Product-4 Gene Deletion.jpg' },
    { name: 'CRISPR RNA Knock-down', description: 'The product  offers a more specific and potent alternative to traditional RNAi methods for knocking down RNA expression levels.', link: 'products/rna-knock-down', image: '../../assets/Product-5 CRISPR RNA Knock-Down.jpg' }
  ]

  servicesData = [
    { name: 'Custom Cloning Services', description: 'We offer various plasmid construction services, complemented by a web design that facilitates customer involvement in the plasmid design process.', link: '/services/custom-cloning', image: '../../assets/Service-1 Custom Cloning Services.jpg' },
    { name: 'Lentivirus Package', description: 'We offer high-quality lentivirus package service at a competitive price.', link: '/services/lentivirus-package', image: '../../assets/Service-2 Lentivirus Package.jpg' },
    { name: 'Stable Cell Line Construction', description: 'We offer stable cell line construction tailored to various requirements across different cancer cell lines and adherent cell lines at a relatively affordable price. Our services include gene overexpression, knockout, knock-in, and deletion.', link: '/services/stable-cell-line', image: '../../assets/Service-3 Stable Cell Line Construction.jpeg' }
  ]

  constructor() { }

  get_products() {
    return this.productsData;
  }

  get_services() {
    return this.servicesData;
  }

}
