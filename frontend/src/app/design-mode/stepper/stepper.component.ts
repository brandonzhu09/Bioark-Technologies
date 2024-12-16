import { Component, ViewChild } from '@angular/core';
import {
    Validators,
    FormsModule,
    ReactiveFormsModule,
    FormControl,
    FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { DesignFormService } from '../design-form.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { SummaryComponent } from '../summary/summary.component';

@Component({
    selector: 'stepper',
    templateUrl: './stepper.component.html',
    styleUrl: './stepper.component.css',
    standalone: true,
    imports: [
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        CommonModule,
        MatTabsModule,
        SummaryComponent,
    ],
})
export class StepperComponent {
    constructor(private designFormService: DesignFormService) {}

    @ViewChild('stepper') stepper!: MatStepper;
    isLinear = true;

    errorMessages: string[] = [];

    productCategoryCards: any;
    functionTypeCards: any;
    structureTypeCards: any;
    promoterCards: any;
    proteinTagCards: any;
    fluoresceneMarkerCards: any;
    selectionMarkerCards: any;
    bacterialMarkerCards: any;
    showSearchGeneGroup: boolean = false;
    geneColumns: string[] = [
        'target_sequence',
        'symbol',
        'gene_name',
        'locus_id',
    ];
    geneTable: any[] = [];
    initialGeneSymbol: string = '';

    selectedTargetSequence: string | null | undefined = '';

    toggleSummaryStep = false;

    deliveryFormatColumns: string[] = [
        'delivery_format_name',
        'product_format_description',
        'product_name',
        'quantity',
        'price',
    ];
    deliveryFormatTable: any[] = [];

    firstFormGroup = new FormGroup({
        productCategoryId: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]),
        productCategoryName: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]),
    });
    secondFormGroup = new FormGroup({
        functionTypeId: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]),
        functionTypeName: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]),
    });
    thirdFormGroup = new FormGroup({
        structureTypeSymbol: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
        ]),
        structureTypeName: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
        ]),
    });
    fourthFormGroup = new FormGroup({
        promoterName: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
        ]),
        proteinTagName: new FormControl('None', [
            Validators.required,
            Validators.minLength(1),
        ]),
        fluoresceneMarkerName: new FormControl('None', [
            Validators.required,
            Validators.minLength(1),
        ]),
        selectionMarkerName: new FormControl('None', [
            Validators.required,
            Validators.minLength(1),
        ]),
        bacterialMarkerName: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
        ]),
    });
    fifthFormGroup = new FormGroup({
        geneOption: new FormControl('none', [
            Validators.required,
            Validators.minLength(1),
        ]),
        targetSequence: new FormControl('XXXXXX', [
            Validators.required,
            Validators.minLength(6),
        ]),
        geneSymbol: new FormControl('', [
            Validators.minLength(1),
        ]),
    });
    searchGeneGroup = new FormGroup({
        geneSymbol: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
        ]),
        targetSequence: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });

    // Errors
    addErrorMessage(message: string) {
        this.errorMessages.push(message);
    
        // Remove the message after 10 seconds
        setTimeout(() => {
          this.errorMessages.shift();
        }, 10000);
    }

    checkFormCompletion(form: FormGroup) {
        if (form.invalid) {
          this.addErrorMessage('Please complete all required fields.');
        }
      }

    // Forms
    handleProductCategoryClick = (card: any) => {
        this.firstFormGroup.controls.productCategoryId.setValue(
            card.category_id
        );
        this.firstFormGroup.controls.productCategoryName.setValue(
            card.category_name
        );
    };
    handleFunctionTypeClick = (card: any) => {
        this.secondFormGroup.controls.functionTypeId.setValue(
            card.function_type_id
        );
        this.secondFormGroup.controls.functionTypeName.setValue(
            card.function_type_name
        );
    };
    handleDeliveryTypeClick = (card: any) => {
        this.thirdFormGroup.controls.structureTypeSymbol.setValue(
            card.structure_type_symbol
        );
        this.thirdFormGroup.controls.structureTypeName.setValue(
            card.structure_type_name
        );
    };
    handlePromoterClick = (card: any) => {
        this.fourthFormGroup.controls.promoterName.setValue(card.promoter_name);
    };
    handleProteinTagClick = (card: any) => {
        this.fourthFormGroup.controls.proteinTagName.setValue(
            card.protein_tag_name
        );
    };
    handleFluoresceneMarkerClick = (card: any) => {
        this.fourthFormGroup.controls.fluoresceneMarkerName.setValue(
            card.fluorescene_marker_name
        );
    };
    handleSelectionMarkerClick = (card: any) => {
        this.fourthFormGroup.controls.selectionMarkerName.setValue(
            card.selection_marker_name
        );
    };
    handleBacterialMarkerClick = (card: any) => {
        this.fourthFormGroup.controls.bacterialMarkerName.setValue(
            card.bacterial_marker_name
        );
    };
    handleTargetSequenceClick = (option: string, sequence: string) => {
        this.fifthFormGroup.controls.geneOption.setValue(option);
        this.fifthFormGroup.controls.targetSequence.setValue(sequence);
    };

    resetFormsAfter(index: number) {
        this.toggleSummaryStep = false;
        if (index == 5) {
            this.toggleSummaryStep = true;
        }
        if (index <= 5) {
            this.searchGeneGroup.reset();
        }
        if (index <= 4) {
            this.fifthFormGroup.reset();
        }
        if (index <= 3) {
            this.fourthFormGroup.reset();
            this.fourthFormGroup.patchValue({
                promoterName: 'PCMV', // Restore the default value
                proteinTagName: 'None',
                fluoresceneMarkerName: 'None',
                selectionMarkerName: 'None',
            });
        }
        if (index <= 2) {
            this.thirdFormGroup.reset();
        }
        if (index == 1) {
            this.secondFormGroup.reset();
        }
    }

    submitFirstForm() {
        let category_id = this.firstFormGroup.value.productCategoryId;
        if (category_id != '' && category_id != null) {
            this.designFormService
                .getFunctionTypesByCategory(category_id)
                .subscribe((response) => {
                    this.functionTypeCards = response;
                });
        }
    }

    submitSecondForm() {
        let function_type_id = this.secondFormGroup.value.functionTypeId;
        if (function_type_id != '' && function_type_id != null) {
            this.designFormService
                .getStructureTypesByFunctionType(function_type_id)
                .subscribe((response) => {
                    this.structureTypeCards = response;
                });
        }
    }

    submitThirdForm() {
        let function_type_id = this.secondFormGroup.value.functionTypeId;
        let structure_type_symbol =
            this.thirdFormGroup.value.structureTypeSymbol;
        if (function_type_id != null && structure_type_symbol != null) {
            this.designFormService
                .getCodeP(function_type_id, structure_type_symbol)
                .subscribe((response) => {
                    this.promoterCards = response.promoters;
                    this.proteinTagCards = response.protein_tags;
                    this.fluoresceneMarkerCards = response.fluorescene_markers;
                    this.selectionMarkerCards = response.selection_markers;
                    this.bacterialMarkerCards = response.bacterial_markers;
                });
        }
    }

    submitFifthForm() {
        if (this.fifthFormGroup.value.geneOption == 'geneSearch') {
            this.showSearchGeneGroup = true;
            this.fifthFormGroup.controls.geneSymbol.setValidators(Validators.required);
            if (this.fifthFormGroup.value.geneSymbol !== this.initialGeneSymbol) {
                let gene_symbol = this.fifthFormGroup.value.geneSymbol!;
                this.fifthFormGroup.controls.targetSequence.reset();
                this.initialGeneSymbol = gene_symbol;
                this.designFormService
                    .getGeneTableBySymbol(gene_symbol)
                    .subscribe((response) => {
                        if (response.length == 0) {
                            this.geneTable = [];
                        } else {
                            this.geneTable = response;
                        }
                    });
                this.toggleSummaryStep = true;
            }
        } else {
            this.fifthFormGroup.controls.geneSymbol.clearValidators();
            this.showSearchGeneGroup = false;
            this.selectedTargetSequence =
                this.fifthFormGroup.value.targetSequence;
            this.toggleSummaryStep = true;
        }
    }

    getTargetSequence() {
        if (this.fifthFormGroup.value.targetSequence == null || this.fifthFormGroup.value.targetSequence === "IGNORE") {
            return "XXXXXX";
        }
        return this.fifthFormGroup.value.targetSequence;
    }

    // loadSummaryResources() {
    //   let structure_type_name = this.thirdFormGroup.value.structureTypeName;
    //   if (structure_type_name != null) {
    //     this.designFormService.loadSummaryResources(structure_type_name).subscribe(
    //       (response) => {this.deliveryFormats = response; console.log(response)}
    //     )
    //   }

    ngOnInit() {
        this.designFormService.getProductCategories().subscribe((response) => {
            this.productCategoryCards = response;
        });
    }
}
