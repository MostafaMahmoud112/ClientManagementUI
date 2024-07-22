import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { SelectEvent, FileRestrictions } from '@progress/kendo-angular-upload';
import { MessageService } from '@progress/kendo-angular-l10n';
import { NotificationService } from '@progress/kendo-angular-notification';
import { countries } from '../../resources/countries';
import { Iclients } from '../../models/Clients.model';
import { CustomMessagesService } from '../../services/custom-messages.service';
import { ClientService } from './profile.component.service';
import { images } from '../../resources/images';
@Component({
    selector: 'app-profile-component',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
    public formGroup: FormGroup = new FormGroup({});
    public countries = countries;
    public phoneNumberMask = '(+9) 0000-000-00-00';
    public fileRestrictions: FileRestrictions = {
        allowedExtensions: ['.png', '.jpeg', '.jpg']
    };
    public avatars?: NodeList;
    clients: Iclients[] = [];
    public mySelection: string[] = [];
    public customMsgService: CustomMessagesService;

    constructor(public msgService: MessageService,
        private notificationService: NotificationService,
        private _clientService: ClientService,
    ) {
        this.customMsgService = this.msgService as CustomMessagesService;
    }
    ngOnInit(): void {
        this.formGroup = new FormGroup({
            FName: new FormControl('', Validators.required),
            LName: new FormControl('', Validators.required),
            Email: new FormControl('', [Validators.required, Validators.email]),
            Phone: new FormControl('', Validators.required),
            Id: new FormControl(null)
        });
        this.getClients();
    }
    ngAfterViewInit() {
        this.setAvatar();
    }

    public setAvatar() {
        this.avatars = document.querySelectorAll('.k-avatar .k-avatar-image');
        const avatarImg = localStorage.getItem('avatar');
        if (avatarImg) {
            this.avatars.forEach((avatar: any) => {
                avatar.style['background-image'] = `url("${avatarImg}")`;
            });
        }
    }
    //--=====================Save========================
    saveChanges(): void {
        const formValues = this.formGroup.value;
        if (formValues.Id === undefined || formValues.Id === null || formValues.Id <= 0) {
            formValues.Id = 0;
        }
        console.log(formValues)
        this._clientService.saveChanges(formValues).subscribe({
            next: (response) => {
                this.formGroup.markAsPristine();
                this.getClients();
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
    //-=============================get=========================
    getClients(): void {
        this._clientService.getClients().subscribe({
            next: (data) => {
                this.clients = data;
            },
            error: (error) => {
                console.error('Error fetching data', error);
            }
        });
    }
    //--=============================update=============================
    editItem(dataItem: any) {
        this.formGroup.patchValue({
            FName: dataItem.FName,
            LName: dataItem.LName,
            Email: dataItem.Email,
            Phone: dataItem.Phone,
            Id: dataItem.Id,
        });
    }
    //--=========================delete======================
    deleteClient(dataItem: any): void {

        if (confirm('Are you sure you want to delete this client?')) {
            this._clientService.deleteClient(dataItem.Id).subscribe({
                next: () => {
                    this.notificationService.show({
                        content: 'Client deleted successfully..',
                        animation: { type: 'slide', duration: 500 },
                        position: { horizontal: 'center', vertical: 'bottom' },
                        type: { style: 'success', icon: true },
                        hideAfter: 2000
                    });

                    this.getClients();
                },
                error: (error) => {
                    console.error('Error deleting client', error);
                    alert('Failed to delete client.');
                }
            });
        }
    }
    //--===================================resetformGroup========================
    public cancelChanges(): void {
        this.formGroup.patchValue({
            FName: '',
            LName: '',
            Email: '',
            Phone: null,
            Id: -1,
        });
    }

    public isFileAllowed(file: any): boolean {
        return <boolean>this.fileRestrictions.allowedExtensions?.includes(file.extension);
    }
    //--==================RandomphotoURL=====================
    public photoURL(dataItem: any): string {
        const genderCode = Math.random() < 0.5 ? 'F' : 'M';
        const code: string = dataItem.Id + genderCode;
        const image: any = images;
        return image[code];
    }
    

}
