/**
 * Created by mike.mayori on 3/21/16.
 */
if(typeof(_)=='undefined'){
    window.alert("Underscore not defined");
}
if(typeof(jQuery)=='undefined'){
    window.alert("jQuery not defined");
}
if(typeof(VzxReportFactory)=='undefined'){
    window.alert("VzxReportFactory not defined");
}
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
        convertDwel,
        rowsFactory,
        treeFactory,
        headerFactory,
        findColumnByPropertyName;
    w.dtVzxFactory = w.dtVzxFactory || {};
    vzx = w.dtVzxFactory;
    NAME = 'Vizix - Dashboard DataTables Factory';
    PUBLISHED = new Date(2016, 3, 21);
    formatDate = function (d) {
        return '' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
    };
    convertDwel = function(tst){
        tst  = (tst < 0) ? tst * -1 : tst;
        var x = parseInt(tst / 1000);
        var seconds = x % 60;
        x = parseInt(x/60);
        var minutes = x % 60;
        x = parseInt(x/60);
        var hours = x % 24;
        x = parseInt(x/24);

        hours =  (hours<10 ? '0'+hours +':': hours+':');
        minutes =(minutes<10 ? '0'+minutes+':' : minutes+':');
        seconds = seconds<10 ? '0'+ seconds : seconds;
        return hours + minutes + seconds;
    };
    findColumnByLabel = function(labelKey) {
        var obj = _.find(VZXCOLDEFSARRAY, function(item) {
            return item.label === labelKey;
        });
        return obj;
    };
    findColumnByPropertyName = function(treeDefs,grpKey) {
        if (treeDefs.length==0) return false;
        return  _.find(treeDefs, function(group) {
            if (_.isUndefined(group)) return false;
            return !_.isUndefined(group.groupName) && group.groupName === grpKey;
        });
    };
    columnsFactory = function () {
        if (!_.isObject(VZXCOLDEFS)) {
            return new Error('Fatal! Cannot support that kind of data in Tables..!!.');
        }
        var columnsDefs=[];
        var vzxColDefs = _.pick(VZXCOLDEFS,'reportProperty');
        var columnObj, ngClassDefault;
        var headerDefs=[];
        var groupCount = 0;
        var newGroup;
        var devFunc;
        var dtDefs;
        vzxColDefs.reportProperty.forEach(function(column){
            var colDefInternal = rf.dtMapColumnDef(REPORTID,column.propertyName);
            if (colDefInternal) {
                devFunc = rf.dtMapColumnDef(REPORTID,column.propertyName).ngClass;
            } else {
                devFunc = null;
            }
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
        columnsDefs = _.sortBy(columnsDefs, function(o) { return o.displayOrder; })
        dtDefs =  rf.dtMapDataTablesDef(REPORTID);
        columnsDefs.forEach(function(column){
            var groupFound = rf.dtMapGroupDef(REPORTID,column.model);

            if (_.isObject(groupFound) && !_.isUndefined(groupFound)) {
                newGroup = {
                    "title" : groupFound.title,
                    "groupName": groupFound.groupName,
                    "id" : groupCount,
                    "colSpan" : 1
                };
                var obj = findColumnByPropertyName(headerDefs, groupFound.groupName );
                if (_.isObject(obj) && obj) {
                    newGroup = {
                        "title" : obj.title,
                        "groupName": obj.groupName,
                        "id" : obj.id,
                        "colSpan" : obj.colSpan += 1
                    };
                    headerDefs[newGroup.id] = newGroup;
                } else {
                    headerDefs[newGroup.id] = newGroup;
                    groupCount +=1;
                }
            } else {
                newGroup = {
                    "title" : "",
                    "id" : groupCount,
                    "groupName" : "",
                    "colSpan" : 1
                };
                headerDefs[newGroup.id] = newGroup;
                groupCount +=1;
            }

        });
        return { "cols" :columnsDefs, "header" : headerDefs , "dt" : dtDefs};
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
    headerFactory = function (columnsDefs) {
        if (!_.isObject(columnsDefs)) {
            return new Error('Fatal! Cannot support that kind of data in Tables..!!.');
        }
        var treeDefs=[];
        var groupCount = 0;
        var newGroup;
        columnsDefs.forEach(function(column){
            var groupFound = rf.dtMapGroupDef(REPORTID,column.model);

            if (_.isObject(groupFound) && !_.isUndefined(groupFound)) {
                newGroup = {
                    "title" : groupFound.title,
                    "groupName": groupFound.groupName,
                    "id" : groupCount,
                    "colSpan" : 1
                };
                var obj = findColumnByPropertyName(treeDefs, groupFound.groupName );
                if (_.isObject(obj) && obj) {
                    //console.log(obj);
                    newGroup = {
                        "title" : obj.title,
                        "groupName": obj.groupName,
                        "id" : obj.id,
                        "colSpan" : obj.colSpan += 1
                    };
                    treeDefs[newGroup.id] = newGroup;
                } else {
                    treeDefs[newGroup.id] = newGroup;
                    groupCount +=1;
                }
            } else {
                newGroup = {
                    "title" : "",
                    "id" : groupCount,
                    "groupName" : "",
                    "colSpan" : 1
                };
                treeDefs[newGroup.id] = newGroup;
                groupCount +=1;
            }

        });
        return treeDefs;
    };
    rowsFactory = function () {
        if (!_.isObject(VZXROWDEFS)) {
            return new Error('Fatal! Cannot support that kind of data in Tables..!!.');
        }
        var rowsDefs=[],coltTYPE,colTypeId,colDefObj, colMask, rowValue;
        var vzxRowDefs = _.pick(VZXROWDEFS,'results', 'thingFieldTypeMap');
        var vzxMasksDefs = rf.dtMapMasks(REPORTID);
        VZXROWSTYPEDEFS = vzxRowDefs.thingFieldTypeMap;
        vzxRowDefs.results.forEach(function(row){
            var  rowObjs = {};
            for (var i in row) {
                colDefObj = findColumnByLabel(i);
                colTypeId = VZXROWSTYPEDEFS[i];
                rowValue = row[i];
                if (colDefObj) {
                    var devFunc = rf.dtMapColumnDef(REPORTID,colDefObj.propertyName);
                    if (devFunc) {
                        colDefObj.type = devFunc.type;
                    }
                    if (colDefObj.type) {
                        coltTYPE = colDefObj.type;
                    } else {
                        coltTYPE=rf.dtMapDataTypeByID(colTypeId.thingFieldType);
                    }

                    if(coltTYPE=='RELATIVETIME') {
                        rowValue = convertDwel(rowValue);
                    }
                    if (parseInt(rowValue,0) ==0) {
                        rowValue = null;
                    }
                    colMask = vzxMasksDefs.mask[coltTYPE];
                    if(_.isUndefined(colMask)) {
                        colMask ='';
                    }
                    rowObjs[colDefObj.propertyName] = {
                        value : rowValue,
                        type : coltTYPE,
                        mask : colMask
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
    vzx.dtMapHeaders = function ( coldefs, reportID) {
        if (!_.isObject(coldefs)) return [];
        if (!_.isNumber(reportID)) return [];
        REPORTID = reportID;
        VZXCOLDEFS = JSON.parse(JSON.stringify(coldefs));
        VZXCOLDEFSARRAY =  _.pick(coldefs,'reportProperty').reportProperty;
        var columnsDefs = columnsFactory();
        return headerFactory(columnsDefs);
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