import { Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DirectionService {
    constructor(@Inject(DOCUMENT) private document: Document) { }

    setDirection(language: string): void {
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        this.document.documentElement.dir = dir;
    }
}
