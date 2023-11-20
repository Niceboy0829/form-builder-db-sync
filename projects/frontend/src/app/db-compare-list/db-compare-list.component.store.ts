import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs';


export interface FormLayout {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    config: string
    type: number
    previewImage: string
    testData: string
    order: number
    parentId: string
    title: string
    modelData: string
    isModal: boolean
    active: boolean
}
export interface DbCompareListState {
    loading: boolean,
    query: string,
    sourceData: FormLayout[],
    destData: FormLayout[],
}

@Injectable()
export class DbCompareListStore extends ComponentStore<DbCompareListState> {
    sourceDataUrl = 'http://localhost:3000/api/source-data';
    destDataUrl = 'http://localhost:3000/api/dest-data';

    destUpdateUrl = 'http://localhost:3000/api/update-dest-data';

    constructor(
        private http: HttpClient
    ) {
        super({
            query: '',
            loading: false,
            sourceData: [],
            destData: [],
        })
        console.log()
        this.loadSourceDataEffect()
        this.loadDestDataEffect()
    }

    loading$ = this.select(s => s.loading)
    sourceData$ = this.select(s => s.sourceData)
    destData$ = this.select(s => s.destData)
    query$ = this.select(s => s.query);

    result$ = this.select(this.sourceData$, this.destData$, this.query$, (sourceData, destData, query) => {
        let result: any[] = []
        sourceData.filter(src=>src.name?.includes(query)).forEach(src => {
            const dest = destData.find(d => d.name === src.name);
            result.push({
                name: src.name,
                src,
                dest,
            })
        })
        return result
    })     

    vm$ = this.select(
        this.loading$,
        // this.sourceData$,
        // this.destData$,
        this.query$,
        this.result$,
        (
            loading,
            // sourceData,
            // destData,
            query,
            result
        ) => ({
            loading,
            // sourceData,
            // destData
            query,
            result
        })
    )

    setQuery = this.updater((s, query: string) => ({
        ...s,
        query,
    }))
    
    loadSourceDataEffect = this.effect<void>($ => $.pipe(
        tap($ => {this.patchState({ loading: true })}),
        switchMap($ => this.http.get(this.sourceDataUrl).pipe(
            tapResponse(
                (resp: any) => {
                    this.patchState({
                        loading: false,
                        sourceData: resp?.recordset
                    })
                },
                (error) => {
                    this.patchState({
                        loading: false,
                    })

                }
            )
        ))
    ))
    
    loadDestDataEffect = this.effect<void>($ => $.pipe(
        tap($ => {this.patchState({ loading: true })}),
        switchMap(() => this.http.get(this.destDataUrl).pipe(
            tapResponse(
                (resp: any) => {
                    console.log({resp})
                    this.patchState({
                        loading: false,
                        destData: resp?.recordset
                    })
                },
                (error) => {
                    console.log(error)
                    this.patchState({
                        loading: false,
                    })

                }
            )
        ))
    ))

    updateDestDataEffect = this.effect<string>(recordId$ => recordId$.pipe(
        switchMap(recordId => this.http.post(this.destUpdateUrl, { recordId }).pipe(
            tapResponse(
                (resp: any) => {
                    console.log({resp});
                    window.alert('successfully updated.')
                },
                (error) => {
                    console.log(error)
                }
            )
        ))
    ))

}