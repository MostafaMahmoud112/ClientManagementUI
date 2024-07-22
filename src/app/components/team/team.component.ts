import { Component, OnInit, ViewChild } from '@angular/core';

import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { MessageService } from '@progress/kendo-angular-l10n';
import { process } from '@progress/kendo-data-query';
import { SVGIcon, fileExcelIcon, filePdfIcon } from '@progress/kendo-svg-icons';
import { IstockQuotes } from '../../models/stockQuotes.model';
import { CustomMessagesService } from '../../services/custom-messages.service';
import { StockQuotesService } from './team.component.service';
import { NotificationService } from '@progress/kendo-angular-notification';

@Component({
    selector: 'app-team-component',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css']
    
})
export class TeamComponent implements OnInit {
    @ViewChild(DataBindingDirective) dataBinding?: DataBindingDirective;
     stockQuotes: IstockQuotes[] = [];
    public excelIcon: SVGIcon = fileExcelIcon;
    public pdfIcon: SVGIcon = filePdfIcon;

    public mySelection: string[] = [];

    public customMsgService: CustomMessagesService;

    constructor(public msgService: MessageService,
        private _stockQuotesService: StockQuotesService,
        private notificationService: NotificationService,
    ) {
        this.customMsgService = this.msgService as CustomMessagesService;
    }

    public ngOnInit(): void {
        this.getStockQuotes();
        this.stockQuotes = this.stockQuotes.slice(25, 50);
    }
    // public onTeamChange(pageSize: number): void {
    //     pageSize === 25
    //         ? (this.stockQuotes = this.stockQuotes.slice(pageSize, pageSize * 2))
    //         : (this.stockQuotes = this.stockQuotes.slice(0, pageSize));
    // }

    public onFilter(inputValue: string): void {
        this.stockQuotes = process(this.stockQuotes, {
            filter: {
                logic: 'or',
                filters: [
                    {
                        field: this.getField,
                        operator: 'contains',
                        value: inputValue
                    }
                ]
            }
        }).data;

        this.dataBinding ? (this.dataBinding.skip = 0) : null;
    }
//--======================onFilter======================================
public getField = (args: IstockQuotes) => {
    return `${args.Id}_${args.V}_${args.VW}_${args.O}_${args.C}_${args.H}_${args.L}_${args.T}_${args.N}`;
};
   //-=============================get=========================
    getStockQuotes(): void {
        this._stockQuotesService.getStockQuotes().subscribe({
            next: (data) => {
                this.stockQuotes = data;
            },
            error: (error) => {
                console.error('Error fetching data', error);
            }
        });
    }
    //--=============================update=============================
    public editItem(dataItem: IstockQuotes): void {
        dataItem.dataStatus = 1;
    }
    public undoAddEdit(dataItem: IstockQuotes): void {
        dataItem.dataStatus = 4;
    }
  //--==============================save==============

  saveItem(dataItem: IstockQuotes): void {
    if (dataItem.Id === undefined || dataItem.Id === null || dataItem.Id <= 0) {
        dataItem.Id = 0;
    }
    console.log(dataItem)
    this._stockQuotesService.saveStockQuotes(dataItem).subscribe({
        next: (response) => {
            this.getStockQuotes();
            this.notificationService.show({
                content: 'Profile changes have been saved.',
                animation: { type: 'slide', duration: 500 },
                position: { horizontal: 'center', vertical: 'bottom' },
                type: { style: 'success', icon: true },
                hideAfter: 2000
            });
        },
        error: (error) => {
            this.notificationService.show({
                content: 'Failed to save profile changes.',
                animation: { type: 'slide', duration: 500 },
                position: { horizontal: 'center', vertical: 'bottom' },
                type: { style: 'error', icon: true },
                hideAfter: 2000
            });
        }
    });
}
        //--=========================delete======================
      public deleteItem(dataItem: any): void {
        if (confirm('Are you sure you want to delete this client?')) {
            this._stockQuotesService.deleteStockQuotes(dataItem.Id).subscribe({
                next: () => {
                    this.notificationService.show({
                        content: 'Client deleted successfully..',
                        animation: { type: 'slide', duration: 500 },
                        position: { horizontal: 'center', vertical: 'bottom' },
                        type: { style: 'success', icon: true },
                        hideAfter: 2000
                    });

                    this.getStockQuotes();
                },
                error: (error) => {
                    console.error('Error deleting client', error);
                    alert('Failed to delete client.');
                }
            });
        }
      }
}
