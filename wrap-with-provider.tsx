/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import * as React from "react";
import { Provider } from "./src/state/contextprovider";

export default ({ element }: { element: any }) => {
    return <Provider>{element}</Provider>
}