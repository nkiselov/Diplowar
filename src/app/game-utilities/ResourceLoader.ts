import { HttpClient, HttpHeaders } from '@angular/common/http'

export interface ResourceLoader{
    load(uri:string, onLoad:(blob:Blob) => void, onError:(err:Error) => void) : void
}

export class HttpResourceLoader implements ResourceLoader{
    httpClient:HttpClient

    constructor(httpClient:HttpClient){
        this.httpClient = httpClient
    }

    load(uri: string, onLoad: (blob:Blob) => void, onError:(err:Error) => void) : void{
        this.httpClient
        .get(uri, { responseType: 'blob' })
        .subscribe(
            data => onLoad(data),
            error => onError(error)
        );
    }
}