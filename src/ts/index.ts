/// <reference path="one.ts" />

import { One } from './one.ts';

class Main {
    private one : One;
    private appName : string;

    constructor(appName: string) {
        this.appName = appName;
        this.one = new One(this.appName);
    }

    public start() {
        //console.log(this.one.getName());
    }
}