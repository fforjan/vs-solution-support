/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import * as vscode from 'vscode';

export class DependenciesDocument {
    _emitter: any;
    _uri: any;

	constructor(uri: vscode.Uri, emitter: vscode.EventEmitter<vscode.Uri>) {
		this._uri = uri;

		// The ReferencesDocument has access to the event emitter from
		// the containg provider. This allows it to signal changes
		this._emitter = emitter;		
	}

    get value() {
		return "hello world";
	}
}