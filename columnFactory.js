/**
 * Created by mike.mayori on 3/21/16.
 */
(function (w, _, $) {
    'use strict';
    var vzx,
        NAME,
        VERSION,
        PUBLISHED,
        VZXCOLDEFS,
        formatDate,
        validate,
        columnsFactory;
    w.agGridColumns = w.agGridColumns || {};
    vzx = w.agGridColumns;
    NAME = 'Vizix - Column Factory for Ag-grid';
    PUBLISHED = new Date(2016, 3, 21);
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
                maxWidth: 50
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
}(window,_, jQuery));