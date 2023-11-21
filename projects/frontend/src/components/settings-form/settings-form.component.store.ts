import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { switchMap, tap, withLatestFrom } from 'rxjs';

export interface SettingsFormState {
    loading: boolean,
    query: string,
    type: string,
    message?: string,
    error?: boolean,
    data: {
        user: string,
        password: string,
        server: string,
        database: string,
        port: number,
        encrypt: boolean,
        trustServerCertificate: boolean,
        dialect: string,
        dialectOptions: {
            instanceName: string,
        }
    }
}

@Injectable()
export class SettingsFormStore extends ComponentStore<SettingsFormState> {

    constructor(
        private http: HttpClient,
    ) {
        super({
            query: '',
            loading: false,
            type: '',
            data: {
                user: '',
                password: '',
                server: '',
                database: '',
                port: 1433,
                encrypt: false,
                trustServerCertificate: true,
                dialect: "mssql",
                dialectOptions: {
                    instanceName: '',
                }
            }
        })
    }

    setType = this.updater((s, type: string) => ({
        ...s,
        type
    }))

    data$ = this.select(s => s.data)
    loading$ = this.select(s => s.loading)
    type$ = this.select(s => s.type);
    error$ = this.select(s => s.error)
    message$ = this.select(s => s.message)

    vm$ = this.select(
        this.loading$,
        this.type$,
        this.data$,
        this.error$,
        this.message$,
        (
            loading,
            type,
            data,
            error,
            message,
        ) => ({
            loading,
            type,
            data,
            error,
            message,
        })
    )

    loadSettingsEffect = this.effect<void>($ => $.pipe(
        withLatestFrom(
            this.type$,
        ),
        switchMap(([, type]) => this.http.get(`http://localhost:3000/api/db-settings/${type}`).pipe(
            tapResponse(
                (data: any) => {
                    this.patchState({data})
                },
                (error: any) => {
                    console.log(error)
                    const message = error.response?.data?.message || error.message || 'Faild to get settings.'

                    this.patchState({
                        message,
                        error: true,
                    })
                }
            )
        ))
    ))

    saveDbSettingsEffect = this.effect<any>(input$ => input$.pipe(
        withLatestFrom(
            this.type$,
        ),
        switchMap(([input, type]) => this.http.post(`http://localhost:3000/api/db-settings/${type}`, {...input}).pipe(
            tapResponse(
                (data: any) => {
                    console.log(data)
                    this.patchState({
                        message: 'Successfully saved.',
                        error: false,
                    })
                    // this.patchState({ data })
                },
                (error: any) => {
                    const message = error.response?.data?.message || error.message || 'Faild to save.'
                    this.patchState({
                        message,
                        error: true,
                    })
                    console.log(error)
                }
            )
        ))
    ))

    

    testConnectionEffect = this.effect<void>($ => $.pipe(
        withLatestFrom(
            this.type$,
        ),
        switchMap(([, type]) => this.http.get(`http://localhost:3000/api/db-settings/test/${type}`).pipe(
            tapResponse(
                (data: any) => {
                    window.alert("success!!!")
                    console.log(data)
                    // this.patchState({ data })
                },
                (error) => {
                    this.patchState({
                        message: 'Faild to test.',
                        error: true,
                    })
                    console.log(error)
                }
            )
        ))
    ))

    
}