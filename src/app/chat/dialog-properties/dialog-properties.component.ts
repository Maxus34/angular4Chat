import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from "@angular/common";
import { NgModel } from "@angular/forms";

import { Dialog, Message, User } from "../../_models/_models";
import { AlertService, ApiService, ChatService, UserService } from "../../_services/_services";

import { DialogHelper } from "../../_helpers/dialog.helper";

import 'rxjs/add/operator/switchMap';

@Component({
    selector: `dialog-properties`,
    templateUrl: `./dialog-properties.component.html`,
    styleUrls: [`./dialog-properties.component.css`]
})
export class DialogPropertiesComponent implements OnInit {

    private dialogHelper: DialogHelper;

    public isLoadingDialog: boolean = true;

    public dialog: Dialog;
    public changedDialog: Dialog;

    public currentUser: User = this.userService.currentUser;
    public availableUsers: User[] = [];

    @ViewChild('usersSelect') public usersSelect: ElementRef;

    constructor(
        private chatService: ChatService,
        private alertService: AlertService,
        private apiService: ApiService,
        private userService: UserService,

        private route: ActivatedRoute,
        private router: Router,
    ) { }

    async ngOnInit() {
        let dialogId = this.route.snapshot.params['id'] || null;

        if (dialogId) {
            try {
                this.dialogHelper = await this.chatService.getDialogHelper(dialogId);
            } catch (e) { this.router.navigate(['/']); this.alertService.error(e, true); }

            this.dialog = await this.dialogHelper.dialog;

            this.copyDialogToChangedDialog();
            await this.findUsersForDialogReferences();
            await this.loadAvailableUsers();

        } else {
            this.changedDialog = new Dialog();
            await this.loadAvailableUsers();
        }

        this.isLoadingDialog = false;
    }

    public async confirmChanges() {

        // Updating dialog
        if (this.dialog) {
            this.updateDialog();
            // Creating a new Dialog
        } else {
            this.createDialog();
        }

    }

    public cancelChanges() {
        this.router.navigate(['chat', this.dialog.id]);
    }

    public deleteRef(reference) {
        reference.isActive = false;
    }

    public restoreRef(reference) {
        reference.isActive = true;
    }

    public addRef() {
        let elem: any = document.querySelector("#usersSelect");

        let userToAdd = this.availableUsers.find(user => {
            return user.id == elem.selectedOptions[0].value;
        });

        this.changedDialog.dialogReferences.push({
            userId: userToAdd.id,
            user: userToAdd,
            createdByUser: this.currentUser,
            createdAt: new Date(),
            isActive: 1,
        });

        this.availableUsers = this.availableUsers.filter(user => {
            return user.id !== userToAdd.id;
        })
    }

    protected findUsersForDialogReferences() {
        this.changedDialog.dialogReferences.forEach(async ref => {
            ref.user = await this.userService.getById(ref.userId);
            ref.createdByUser = await this.userService.getById(ref.createdBy);
        });
    }

    protected copyDialogToChangedDialog() {
        this.changedDialog = JSON.parse(JSON.stringify(this.dialog)) as Dialog;
    }

    protected async loadAvailableUsers() {
        this.availableUsers = await this.userService.getAll();

        this.availableUsers = this.availableUsers.filter(item => {

            let res = true;

            if (this.dialog)
                this.dialog.dialogReferences.forEach(reference => {
                    if (reference.userId == item.id)
                        res = false;
                })

            if (item.id == this.currentUser.id)
                res = false;

            return res;
        })
    }

    protected async updateDialog() {
        let users = [];

        this.changedDialog.dialogReferences.forEach(reference => {
            if (reference.isActive)
                users.push(reference.userId);
        });
        
        try{
            await this.dialogHelper.updateDialog(this.changedDialog.title, users);
        } catch (e) {this.alertService.error(e); return;}

        this.alertService.success(`Dialog ${this.dialog.title} was updated`);
        this.router.navigate([`/chat`, this.dialog.id]);
    }

    protected async createDialog() {
        let users = [];
        this.changedDialog.dialogReferences.forEach(reference => {
            if (reference.isActive)
                users.push(reference.userId);
        });
        
        let dialog;
        try{
            dialog = await this.chatService.createDialog(this.changedDialog.title, users);
            
        } catch(e) {this.alertService.error(e, true); this.router.navigate(['chat/'])}
        
        this.router.navigate(['chat/', dialog.id]);
    }

}