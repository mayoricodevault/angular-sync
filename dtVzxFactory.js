/**
 * Created by mike.mayori on 3/21/16.
 */
(function (w, _, $, rf) {
    'use strict';
    var vzx,
        NAME,
        VERSION,
        PUBLISHED,
        VZXCOLDEFS,
        VZXCOLDEFSARRAY,
        VZXROWDEFS,
        VZXROWSTYPEDEFS,
        REPORTID,
        formatDate,
        findColumnByLabel,
        columnsFactory,
        rowsFactory,
        treeFactory;
    w.dtVzxFactory = w.dtVzxFactory || {};
    vzx = w.dtVzxFactory;
    NAME = 'Vizix - Dashboard DataTables Factory';
    PUBLISHED = new Date(2016, 3, 21);
    formatDate = function (d) {
        return '' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
    };
    findColumnByLabel = function(labelKey) {
        var obj = _.find(VZXCOLDEFSARRAY, function(item) {
            return item.label === labelKey;
        });
        return obj;
    };
    columnsFactory = function () {
        if (!_.isObject(VZXCOLDEFS)) {
            return new Error('Fatal! Cannot support that kind of data in Tables..!!.');
        }
        var columnsDefs=[];
        var vzxColDefs = _.pick(VZXCOLDEFS,'reportProperty');
        var columnObj, ngClassDefault;
        vzxColDefs.reportProperty.forEach(function(column){
            var devFunc = rf.dtMapColumnDef(REPORTID,column.propertyName).ngClass;
            ngClassDefault = _.isNull(devFunc) ? '' : devFunc;
            columnObj = {
                headerName : column.label,
                model : column.propertyName,
                width : '90px',
                displayOrder : column.displayOrder,
                sortable : true,
                align :'center',
                ngClass: ngClassDefault
            }
            if (column.sortable && !column.sortable) {
                columnObj.sortable= false
            }
            if (column.hidden && column.hidden==true) {
                columnObj.hidden = true;
            }
            columnsDefs.push(columnObj);
        });
        return _.sortBy(columnsDefs, function(o) { return o.displayOrder; });
    };
    treeFactory = function (columnsDefs) {
        if (!_.isObject(columnsDefs)) {
            return new Error('Fatal! Cannot support that kind of data in Tables..!!.');
        }
        var treeDefs=[];
        columnsDefs.forEach(function(column){
            var groudFound = rf.dtMapGroupDef(REPORTID,column.model);
            if (_.isObject(groudFound)) {
                var obj = _.find(treeDefs, function(item) {
                    return item.groupName === groudFound.groupName;
                });
                if (!obj) {
                    column.groupName = groudFound.groupName;
                    column.groupTitle = groudFound.title;
                    treeDefs.push(column);
                }
            } else {
                column.groupName = "";
                column.groupTitle = "";
                treeDefs.push(column);
            }
        });

        return treeDefs;
    };
    rowsFactory = function () {
        if (!_.isObject(VZXROWDEFS)) {
            return new Error('Fatal! Cannot support that kind of data in Tables..!!.');
        }
        var rowsDefs=[];
        var vzxRowDefs = _.pick(VZXROWDEFS,'results', 'thingFieldTypeMap');
        VZXROWSTYPEDEFS = vzxRowDefs.thingFieldTypeMap;
        vzxRowDefs.results.forEach(function(row){
            var  rowObjs = {};
            for (var i in row) {
                var colDefObj = findColumnByLabel(i);
                var colTypeId = VZXROWSTYPEDEFS[i];

                if (colDefObj) {
                    var colname = colDefObj.propertyName;
                    var colvalue = row[i];
                    var coltTYPE=rf.dtMapDataTypeByID(colTypeId.thingFieldType);
                    rowObjs[colname] = {
                        value : colvalue,
                        type : coltTYPE
                    };
                }
            }
            rowsDefs.push(rowObjs);
        });


        return rowsDefs;
    };
    // Required to Build Columns for Data-Tables
    vzx.dtMapColumns = function ( coldefs, reportID) {
        if (!_.isObject(coldefs)) return [];
        if (!_.isNumber(reportID)) return [];
        REPORTID = reportID;
        VZXCOLDEFS = JSON.parse(JSON.stringify(coldefs));
        VZXCOLDEFSARRAY =  _.pick(coldefs,'reportProperty').reportProperty;
        return columnsFactory();
    };
    vzx.dtMapTree = function ( coldefs, reportID) {
        if (!_.isObject(coldefs)) return [];
        if (!_.isNumber(reportID)) return [];
        REPORTID = reportID;
        VZXCOLDEFS = JSON.parse(JSON.stringify(coldefs));
        VZXCOLDEFSARRAY =  _.pick(coldefs,'reportProperty').reportProperty;
        var columnsDefs = columnsFactory();

        return treeFactory(columnsDefs);
    };
    vzx.dtMapRows = function (rowdefs) {
        if (!_.isObject(rowdefs)) return [];
        if (!_.isObject(VZXCOLDEFS)) return [];
        VZXROWDEFS = JSON.parse(JSON.stringify(rowdefs));
        return rowsFactory();
    };
    vzx.getVersionInfo = function () {
        return '' + NAME + ' - ' + VERSION + ' (' + formatDate(PUBLISHED) + ')';
    };
}(window,_, jQuery, VzxReportFactory));