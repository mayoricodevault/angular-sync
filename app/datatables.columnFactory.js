/**
 * Created by mike.mayori on 3/28/16.
 */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'datatables.columnFactory';
}
(function (w, d, $,_, angular) {
    'use strict';
    var vzx,
        NAME,
        VERSION,
        PUBLISHED,
        VZXCOLDEFS,
        formatDate,
        validate,
        cellRenderTest,
        columnsFactory;
    w.agGridColumns = w.agGridColumns || document.querySelector("vaadin-grid");
    vzx = w.agGridColumns;
    NAME = 'Vizix - Column Factory for Ag-grid';
    PUBLISHED = new Date(2016, 3, 21);
    cellRenderTest= function (params) {
        if (params.value=='true') {
            return 'truly';
        } else {
            return params.value;
        }
    }
    formatDate = function (d) {
        return '' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
    };
    validate = function () {
        var isValid = true;


        return isValid;
    };
    columnsFactory = function () {
        if (!validate(VZXCOLDEFS)) {
            return new Error('Fatal! Cannot support that kind of data in Tables..!!.');
        }
        var columnsDefs=[];
        var vzxColDefs = _.pick(VZXCOLDEFS,'reportProperty');
        var columnObj;
        vzxColDefs.reportProperty.forEach(function(column){
            columnObj = {
                headerName : column.label,
                field : column.propertyName,
                colId : column.propertyName,
                cellStyle: function(params) {
                    if (params.value=='true') {
                        //mark police cells as red
                        return {color: 'red', backgroundColor: 'green'};
                    } else {
                        return null;
                    }
                },
                cellRenderer: cellRenderTest
                //valueGetter: '(data.RegistrationComplete > 0) ? data[colDef.field] : ""'

            }
            columnsDefs.push(columnObj);
        });
        return columnsDefs;
    };
    vzx.mapdata = function (coldefs) {
        VZXCOLDEFS = JSON.parse(JSON.stringify(coldefs));
        return columnsFactory();
    }
    vzx.getVersionInfo = function () {
        return '' + NAME + ' - ' + VERSION + ' (' + formatDate(PUBLISHED) + ')';
    };
})(window, document, jQuery, _, angular);