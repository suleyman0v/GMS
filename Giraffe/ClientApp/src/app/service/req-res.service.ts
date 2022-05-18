import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class ReqResService {

    constructor(private http: HttpClient) {}

    getData(url): any {
        return this.http.get<any>(url);
    }
    postData(url, obj) {
        return this.http.post<any>(url, obj);
    }
    putData(url, obj, id) {
        return this.http.put<any>(url, obj, id);
    }
}
