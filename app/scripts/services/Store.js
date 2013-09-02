'use strict';

angular.module('firereaderApp').factory('Store', ['$rootScope', function ($rootScope) {
    //private members
    var mdb = null,
        name = "firereaderstore",
        version = 1,
        Store = {},
        trace = function(msg) {
            console.log(msg);
        };
        Store.getDb = function(fname, params) {
            if (mdb == null) {
                init(fname, params);
            } else {
                if (fname == "Store.add") {
                        add(params[0], params[1]);
                } else if (fname == "Store.query") {
                        query(params[0]);
                } else if (fname == "Store.delete") {
                        del(params[0]);
                }
            }
        };
        var init = function(fname, params) {
            //2. Make indexedDB compatible
            if (compatibility()) {
                //2.1 Delete database
                //~ deletedb(name);
                //3.Open database
                open(fname, params);
            }
        };
        var compatibility = function() {
            window.mindexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
            window.mIDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || window.OIDBTransaction;
            window.mIDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

            if (window.indexedDB) {
                return true;
            }

            trace("Your browser does not support a stable version of IndexedDB.");
            return false;
        };
        var deletedb = function(dbname) {
            var request = window.mindexedDB.deleteDatabase(dbname);
            request.onsuccess = function() {
                trace("Database " + dbname + " deleted!");
            };
            request.onerror = function(event) {
                trace("Error on deleting DB:" + event);
            };
        };
        var open = function(fname, params) {
            //3.1. Open a database async
            var request = window.mindexedDB.open(name, version);

            //3.2 The database has changed its version (For IE 10 and Firefox)
            request.onupgradeneeded = function(event) {
                trace("Upgrade needed!");
                mdb = event.target.result;
                modifydb(); //Here we can modify the database
            };

            request.onsuccess = function(event) {
                trace("Database opened: " + name);
                mdb = event.target.result;

                Store.getDb(fname, params);
                $rootScope.DBOpened = true;

                //3.2 The database has changed its version (For Chrome)
                if (version != mdb.version && window.webkitIndexedDB) {
                    trace("DB version is different");
                    var setVersionreq = mdb.setVersion(version);
                    setVersionreq.onsuccess = modifydb; //Here we can modify the database
                }
            };

            request.onerror = function(event) {
                trace("Database error: " + event);
            };
        };
        var modifydb = function() {
            //3.3 Create / Modify object stores in our database
            //2.Delete previous object store
            if (mdb.objectStoreNames.contains("mystore")) {
                mdb.deleteObjectStore("mystore");
                trace("db.deleteObjectStore('mystore');");
            }

            //3.Create object store
            var store = mdb.createObjectStore("mystore", {
                keyPath: "key"
            });
            store.createIndex("key", "key", { unique: true });
        };
        var add = function(key, value) {
            //4. Add objects
            var trans = mdb.transaction(["mystore"], "readwrite"),
                store = trans.objectStore("mystore");
            var data = {
                "key": key,
                text: value
            };
            store.add(data);
        };
        var query = function(key) {
            //5. Read
            var trans = mdb.transaction(["mystore"], "readonly"),
                store = trans.objectStore("mystore"),
                index = store.index("key"),
                request = index.openCursor(IDBKeyRange.only(key));

            request.onsuccess = function(event) {
                var result = event.target.result;
                if (result === false || result === null || result === undefined) {
                    $rootScope.$emit(key + ".noqueryresult");
                    return;
                }
                onqueryresult(result.value, key);
            };
        };
        var onqueryresult = function(result, key) {
            $rootScope.$emit(key + ".queryresult", result.text);
        };
        var del = function(key) {
            //6. Delete items
            var transaction = mdb.transaction(["mystore"], "readwrite");
            var store = transaction.objectStore("mystore");
            var request = store.delete(key);

            request.onerror = function(event) {
                trace("Error deleting: " + e);
            };
        };
    //public members
    return Store;
}]);
