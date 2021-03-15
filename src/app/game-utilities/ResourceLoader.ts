import { HttpClient, HttpHeaders } from '@angular/common/http'

export interface ResourceLoader{
    load(uri:string, onLoad:(blob:Blob) => void, onError:() => void)
}

export class HttpResourceLoader implements ResourceLoader{
    httpClient:HttpClient

    load(uri: string, onLoad: (blob:Blob) => void, onError:() => void) {
        this.httpClient
        .get(uri, { responseType: 'blob' })
        .toPromise()
        .then(res=>onLoad(res as Blob))
        .catch(onError);
    }
}