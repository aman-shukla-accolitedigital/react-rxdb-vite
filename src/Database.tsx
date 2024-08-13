// @ts-nocheck
import {
    createRxDatabase,
    addRxPlugin,
    removeRxDatabase
} from 'rxdb';
import {
    getRxStorageDexie
} from 'rxdb/plugins/storage-dexie';

import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import React from 'react';
import { heroSchema } from './Schema';
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);
const syncURL = 'http://' + window.location.hostname + ':10103/';
console.log('host: ' + syncURL);

let dbPromise: any = null;

const _create = async () => {
    console.log('DatabaseService: creating database..');
    const date = new Date();
    const db = await createRxDatabase({
        name: 'heroesreactdb'+date,
        storage: getRxStorageDexie()
    });
    console.log('DatabaseService: created database');
    window['db'] = db; // write to window for debugging

    // show leadership in title
    db.waitForLeadership().then(() => {
        console.log('isLeader now');
        document.title = '♛ ' + document.title;
    });

    // create collections
    console.log('DatabaseService: create collections');
    await db.addCollections({
        heroes: {
            schema: heroSchema,
            methods: {
                hpPercent() {
                    return this.hp / this.maxHP * 100;
                }
            }
        }
    });


    // sync
    console.log('DatabaseService: sync');
    await Promise.all(
        Object.values(db.collections).map(async (col) => {
            try {
                // create the CouchDB database
                await fetch(
                    syncURL + col.name + '/',
                    {
                        method: 'PUT'
                    }
                );
            } catch (err) { }
        })
    );
    console.log('DatabaseService: sync - start live');
    Object.values(db.collections).map(col => col.name).map(colName => {
        const url = syncURL + colName + '/';
        console.log('url: ' + url);
        const replicationState = replicateCouchDB({
            collection: db[colName],
            url,
            live: true,
            pull: {},
            push: {},
            autoStart: true
        });
        replicationState.error$.subscribe(err => {
            console.log('Got replication error:');
            console.dir(err);
        });
    });

    return db;
};

export const get = () => {
    if (!dbPromise)
        dbPromise = _create();
    return dbPromise;
};
