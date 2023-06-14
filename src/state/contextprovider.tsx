import * as React from 'react'
import { createContext, Dispatch, useReducer } from "react"
import reducer, { initialState, RootState } from "./reducer"
import { ActionTypes } from './actions'
import _ from "lodash"

export interface ContextPropsValue {
    state: RootState
    dispatch: Dispatch<ActionTypes>
}

export interface ContextProps {
    value: ContextPropsValue
}

export const Context = createContext({} as ContextProps);

export const ContextProvider = (props: React.PropsWithChildren<ContextProps>) => {
    return (
        <Context.Provider value={_.omit(props, "children")}>
            {props.children}
        </Context.Provider>
    )
}

export const Provider = (props: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const transferParameter: ContextPropsValue = { state, dispatch }
    return <ContextProvider value={transferParameter}>{props.children}</ContextProvider>
}