/**
 * Created by mike.mayori on 3/21/16.
 */
(function (w, _, $) {
    'use strict';
    var vzx,
        NAME,
        VERSION,
        PUBLISHED,
        VZXROWDEFS,
        VZXCOLDEFS=[],
        formatDate,
        validate,
        rowsFactory,
        findByLabel;
    w.agGridRows = w.agGridRows || {};
    vzx = w.agGridRows;
    NAME = 'Vizix - Rows Factory for Ag-grid';
    PUBLISHED = new Date(2016, 3, 21);
    formatDate = function (d) {
        return '' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
    };
    validate = function () {
        var isValid = true;


        return isValid;
    };
    findByLabel = function(labelKey) {
        var obj = _.find(VZXCOLDEFS, function(item) {
            return item.headerName === labelKey;
        });
        return obj;
    };
    rowsFactory = function () {
        if (!validate(VZXROWDEFS)) {
            return new Error('Fatal! Cannot support that kind of data in Tables..!!.');
        }
       var rowsDefs=[];
            //console.dir(VZXROWDEFS);
        var vzxRowDefs = _.pick(VZXROWDEFS,'results');
        vzxRowDefs.results.forEach(function(row){
            var  rowObjs = {};
            for (var i in row) {
                var colDefObj = findByLabel(i);
                if (colDefObj) {
                    var colname = colDefObj.field;
                    var colvalue = row[i];
                    rowObjs[colname] = colvalue;
                }
            }
            rowsDefs.push(rowObjs);
        });
        return rowsDefs;
    };
    vzx.columnsMap = function(coldefs) {
        VZXCOLDEFS = coldefs;
    };
    vzx.mapdata = function (rowdefs) {
        VZXROWDEFS = JSON.parse(JSON.stringify(rowdefs));
        return rowsFactory();
    };
    vzx.getVersionInfo = function () {
        return '' + NAME + ' - ' + VERSION + ' (' + formatDate(PUBLISHED) + ')';
    };
}(window,_, jQuery));