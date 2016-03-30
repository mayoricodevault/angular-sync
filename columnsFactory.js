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
        DTColumnDefBuilder,
        formatDate,
        columnsFactory;
    w.dtColumsFactory = w.dtColumsFactory || {};
    vzx = w.dtColumsFactory;
    NAME = 'Vizix - Column Factory for Ag-grid';
    PUBLISHED = new Date(2016, 3, 21);
    formatDate = function (d) {
        return '' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
    };
    columnsFactory = function () {
        var testFunc = eval("(function (params) {if (params.value=='true'){return 'truly';} else {return params.value;}})");
        if (!_.isObject(VZXCOLDEFS)) {
            return new Error('Fatal! Cannot support that kind of data in Tables..!!.');
        }
        var columnsDefs=[];
        var vzxColDefs = _.pick(VZXCOLDEFS,'reportProperty');
        var columnObj, cssDefault;
        vzxColDefs.reportProperty.forEach(function(column){
            cssDefault = _.isNull(column.cssClass) ? ' ' : column.cssClass
            columnObj = DTColumnDefBuilder.newColumnDef(column.propertyName)
                .withTitle(column.label)
                .withClass(cssDefault);
            if (!column.sortable) {
                columnObj.notSortable();
            }
            if (!column.show) {
                columnObj.notVisible();
            }
            columnsDefs.push(columnObj);
        });
        return columnsDefs;
    };
    // Required to Build Columns for Data-Tables
    vzx.dtMapColumns = function (DefBuilder, coldefs) {
        if (!_.isObject(coldefs)) return [];
        DTColumnDefBuilder  = DefBuilder;
        VZXCOLDEFS = JSON.parse(JSON.stringify(coldefs));
        return columnsFactory();
    };
    vzx.getVersionInfo = function () {
        return '' + NAME + ' - ' + VERSION + ' (' + formatDate(PUBLISHED) + ')';
    };
}(window,_, jQuery));