import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs';
import { API_BASE_URI } from '../../config'

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
    showOnlyDiff: boolean,
    sourceData: FormLayout[],
    destData: FormLayout[],
}

@Injectable()
export class DbCompareListStore extends ComponentStore<DbCompareListState> {
    sourceDataUrl = `${API_BASE_URI}/source-data`;
    destDataUrl = `${API_BASE_URI}/dest-data`;

    destUpdateUrl = `${API_BASE_URI}/update-dest-data`;
    srcUpdateUrl = `${API_BASE_URI}/update-source-data`;

    constructor(
        private http: HttpClient
    ) {
        super({
            query: '',
            loading: false,
            showOnlyDiff: true,
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
    showOnlyDiff$ = this.select(s => s.showOnlyDiff);

    result$ = this.select(this.sourceData$, this.destData$, this.query$, this.showOnlyDiff$, (sourceData, destData, query, showOnlyDiff) => {
        let result: any[] = []
        let diffCnt = 0;
        sourceData.filter(src=>src.name?.includes(query)).forEach(src => {
            const dest = destData.find(d => d.name === src.name);
            if(src.config !== dest?.config) {
                diffCnt ++
            }
            if(showOnlyDiff && src.config !== dest?.config) {
                result.push({
                    name: src.name,
                    src,
                    dest,
                })
            } else if(!showOnlyDiff) {
                result.push({
                    name: src.name,
                    src,
                    dest,
                })
            }
        })
        console.log("source", sourceData)
        destData.filter(dest=>dest.name?.includes(query)).forEach(dest => {
            const src = sourceData.find(s => s.name === dest.name)
            if(!src) {
                diffCnt++
                result.push({
                    name: dest.name,
                    src: null,
                    dest: dest
                })
            }
        })
        
        console.log("result", result)

        return {
            diffCnt,
            result
        }
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
            result: result.result?.sort((a, b) => - (a.src?.updatedAt ? Date.parse(a.src.updatedAt) : 0) + (b.src?.updatedAt ? Date.parse(b.src.updatedAt) : 0)),
            diffCnt: result.diffCnt
        })
    )

    setQuery = this.updater((s, query: string) => ({
        ...s,
        query,
    }))
    toggleShowOnly = this.updater((s) => ({
        ...s,
        showOnlyDiff: !s.showOnlyDiff
    }))
    updateDest = this.updater((s, formId: string) => {
        const dest = s.sourceData.find(src=>src.id === formId)
        return {
            ...s,
            destData: [...s.destData.filter(s=>s.name !== dest?.name), dest] as FormLayout[]
        }
    })
    updateSrc = this.updater((s, formId: string) => {
        const src = s.destData.find(src=>src.id === formId)
        return {
            ...s,
            sourceData: [...s.sourceData.filter(s=>s.name !== src?.name), src] as FormLayout[]
        }
    })

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
                    this.updateDest(recordId)
                    window.alert('successfully updated.')
                },
                (error) => {
                    console.log(error)
                }
            )
        ))
    ))

    updateSrcDataEffect = this.effect<string>(recordId$ => recordId$.pipe(
        switchMap(recordId => this.http.post(this.srcUpdateUrl, { recordId }).pipe(
            tapResponse(
                (resp: any) => {
                    this.updateSrc(recordId)
                    window.alert('successfully updated.')
                },
                (error) => {
                    console.log(error)
                }
            )
        ))
    ))

}