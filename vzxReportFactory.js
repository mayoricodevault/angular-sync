/**
 * Created by mike.mayori on 3/21/16.
 */
if(typeof(jQuery)=='undefined'){
  window.alert("jQuery not defined");
}
if(typeof(_)=='undefined'){
  window.alert("Underscore not defined");
}
(function (w, _, $) {
  'use strict';
  var VZXREPORTDEFINITION = [
        {
          "report" : 3,
          "datatable": {
              "search" : true,
              "pagination" : true,
              "pagesize" : 10,
              "fullscreen" : true,
              "startpage" : 0
          },
          "mask" : {
            "DATE"    : "dd/mm/yy",
            "TIMESTAMP"    : "hh:mm a",
            "DATETIME"     : "dd/mm/yy hh:mm",
            "RELATIVETIME"   : "hh:mm:ss",
            "NUMBER" : "number:0",
            "FLOAT" : "number:2",
            "CURRENCY" : "'USD$':0"
          },
          "cols" :[
            {
              "propertyName" : "WorkflowTypes",
              "ngClass" :"{'icon-doctor': key[col.model].value == 'Consult', 'icon-health-2': key[col.model].value == 'Treatment'}",
            },
            {
              "propertyName" : "name",
              "ngClass" :"default"
            },
            {
              "propertyName" : "AbbreviationFN",
              "ngClass" :"default"
            },
            {
              "propertyName" : "PhysicianName",
              "ngClass" :"default"
            },
            {
              "propertyName" : "TreatmentTypes",
              "ngClass" :"default"
            },
            {
              "propertyName" : "zone",
              "ngClass" :"default"
            },
            {
              "propertyName" : "RegistrationComplete",
              "ngClass" :"{'bg-progressTable-alt':key.RegistrationComplete.value, 'bg-na': (key.WaitingStart.value || WaitingComplete.value || key.TreatmentRoomValue.value || key.TreatmentStart.value || key.TreatmentComplete.value || key.WaitingExamStart.value || key.WaitingExamComplete.value || key.ExamRoomValue.value || key.ExamStart.value || key.ExamComplete.value) && !key.RegistrationComplete.value}"
            },
            {
              "propertyName" : "WaitingStart",
              "ngClass" : "{'bg-progressTable-alt':key.WaitingStart.value,'bg-na': (WaitingComplete.value || key.TreatmentRoomValue.value || key.TreatmentStart.value || key.TreatmentComplete.value || key.WaitingExamStart.value || key.WaitingExamComplete.value || key.ExamRoomValue.value || key.ExamStart.value || key.ExamComplete.value) && !key.WaitingStart.value}"
            },
            {
              "propertyName" : "WaitingComplete",
              "ngClass" :"{'bg-progressTable-alt':key.WaitingComplete.value,'bg-na': (key.TreatmentRoomValue.value || key.TreatmentStart.value || key.TreatmentComplete.value || key.WaitingExamStart.value || key.WaitingExamComplete.value || key.ExamRoomValue.value || key.ExamStart.value || key.ExamComplete.value) && !key.WaitingComplete.value}"
            },
            {
              "propertyName" : "TreatmentRoomValue",
              "ngClass" :"{'bg-progressTable-alt':key.TreatmentRoomValue.value,'bg-na': (key.TreatmentStart.value || key.TreatmentComplete.value || key.WaitingExamStart.value || key.WaitingExamComplete.value || key.ExamRoomValue.value || key.ExamStart.value || key.ExamComplete.value) && !key.TreatmentRoomValue.value}"
            },
            {
              "propertyName" : "TreatmentStart",
              "ngClass" :"{'bg-progressTable-alt':key.TreatmentStart.value,'bg-na': (key.TreatmentComplete.value || key.WaitingExamStart.value || key.WaitingExamComplete.value || key.ExamRoomValue.value || key.ExamStart.value || key.ExamComplete.value) && !key.TreatmentStart.value}"
            },
            {
              "propertyName" : "TreatmentComplete",
              "ngClass" :"{'bg-progressTable-alt':key.TreatmentComplete.value,'bg-na': (key.WaitingExamStart.value || key.WaitingExamComplete.value || key.ExamRoomValue.value || key.ExamStart.value || key.ExamComplete.value) && !key.TreatmentComplete.value}"
            },
            {
              "propertyName" :"WaitingExamStart",
              "ngClass" : "{'bg-progressTable-alt':key.WaitingExamStart.value,'bg-na': (key.WaitingExamComplete.value || key.ExamRoomValue.value || key.ExamStart.value || key.ExamComplete.value) && !key.WaitingExamStart.value}"
            },
            {
              "propertyName" :"WaitingExamComplete",
              "ngClass" : "{'bg-progressTable-alt':key.WaitingExamComplete.value, 'bg-na': (key.ExamRoomValue.value || key.ExamStart.value || key.ExamComplete.value) && !key.WaitingExamComplete.value}"
            },
            {
              "propertyName" : "ExamRoomValue",
              "ngClass" : "{'bg-progressTable-alt':key.ExamRoomValue.value,'bg-na': (key.ExamStart.value || key.ExamComplete.value) && !key.ExamRoom.value}"

            },
            {
              "propertyName" : "ExamStart",
              "ngClass" :"{'bg-progressTable-alt':key.ExamStart.value,'bg-na': key.ExamComplete.value && !key.ExamStart.value}"
            },
            {
              "propertyName" : "ExamComplete",
              "ngClass" :"{'bg-progressTable-alt':key.ExamComplete.value && key.ExamComplete.value !='0'}"
            },
            {
              "propertyName" : "LOS",
              "ngClass" :"default"
            },
            {
              "propertyName" : "dwellTime( LOS )",
              "ngClass" :"default",
              "type" : "RELATIVETIME"
            }
          ],
          "groups" :[{
            "title" : "Registration",
            "groupName" : "RegistrationStage",
            "subHeader" : [
              {
                "propertyName"  : "RegistrationComplete",
                "label" : "Complete"
              }
            ]},
            {
              "title" : "Waiting",
              "groupName" : "WaitingStage",
              "subHeader" : [
                {
                  "propertyName"  : "WaitingStart",
                  "label" : "Start"
                },
                {
                  "propertyName"  : "WaitingComplete",
                  "label" : "Complete"
                }
              ]},
            {
              "title" : "Treatment",
              "groupName" : "TreatmentStage",
              "subHeader" : [
                {
                  "propertyName"  : "TreatmentRoomValue",
                  "label" : "Room"
                },
                {
                  "propertyName"  : "TreatmentStart",
                  "label" : "Start"
                },
                {
                  "propertyName"  : "TreatmentComplete",
                  "label" : "Complete"
                }
              ]
            },
            {
              "title" : "Waiting Exam",
              "groupName" : "WaitingExamStage",
              "subHeader" : [
                {
                  "propertyName"  : "WaitingExamStart",
                  "label" : "Start"
                },
                {
                  "propertyName"  : "WaitingExamComplete",
                  "label" : "Complete"
                }
              ]
            },
            {
              "title" : "Exam",
              "groupName" : "ExamStage",
              "subHeader" : [
                {
                  "propertyName"  : "ExamRoomValue",
                  "label" : "Room"
                },
                {
                  "propertyName"  : "ExamStart",
                  "label" : "Start"
                },
                {
                  "propertyName"  : "ExamComplete",
                  "label" : "Complete"
                }
              ]
            }
          ]
        }
      ],
      VZXDATATYPEDEF =[
        {
          "id":0,
          "description":"Calc Value",
          "value":"Calc",
          "code":"CALC",
          "type":"Standard Data Types"
        },
        {
          "id":28,
          "description":"Attach one or many files",
          "value":"Attachments",
          "code":"ATTACHMENT",
          "type":"Standard Data Types"
        },
        {
          "id":5,
          "description":"Boolean",
          "value":"Boolean",
          "code":"BOOLEAN",
          "type":"Standard Data Types"
        },
        {
          "id":2,
          "description":"Coordinates",
          "value":"Coordinates",
          "code":"COORDINATES",
          "type":"Standard Data Types"
        },
        {
          "id":11,
          "description":"Date",
          "value":"Date",
          "code":"DATE",
          "type":"Standard Data Types"
        },
        {
          "id":26,
          "description":"Expression of formula",
          "value":"Expression",
          "code":"FORMULA",
          "type":"Standard Data Types"
        },
        {
          "id":22,
          "description":"Group",
          "value":"Group",
          "code":"GROUP",
          "type":"Native Objects"
        },
        {
          "id":6,
          "description":"Image",
          "value":"Image",
          "code":"IMAGE",
          "type":"Standard Data Types"
        },
        {
          "id":8,
          "description":"Image URL",
          "value":"Image URL",
          "code":"IMAGE_URL",
          "type":"Standard Data Types"
        },
        {
          "id":23,
          "description":"Logical Reader",
          "value":"Logical Reader",
          "code":"LOGICAL_READER",
          "type":"Native Objects"
        },
        {
          "id":4,
          "description":"Number (Float)",
          "value":"Number (Float)",
          "code":"NUMBER",
          "type":"Standard Data Types"
        },
        {
          "id":25,
          "description":"Sequence",
          "value":"Sequence",
          "code":"SEQUENCE",
          "type":"Standard Data Types"
        },
        {
          "id":7,
          "description":"Shift",
          "value":"Shift",
          "code":"SHIFT",
          "type":"Native Objects"
        },
        {
          "id":1,
          "description":"String",
          "value":"String",
          "code":"STRING",
          "type":"Standard Data Types"
        },
        {
          "id":24,
          "description":"Timestamp",
          "value":"Timestamp",
          "code":"TIMESTAMP",
          "type":"Standard Data Types"
        },
        {
          "id":12,
          "description":"Url",
          "value":"Url",
          "code":"URL",
          "type":"Standard Data Types"
        },
        {
          "id":3,
          "description":"XYZ",
          "value":"XYZ",
          "code":"XYZ",
          "type":"Standard Data Types"
        },
        {
          "id":9,
          "description":"Zone",
          "value":"Zone",
          "code":"ZONE",
          "type":"Native Objects"
        },
        {
          "id":13,
          "description":"ZPL Script",
          "value":"ZPL Script",
          "code":"ZPL_SCRIPT",
          "type":"Standard Data Types"
        }
      ],
      vzx,
      NAME,
      PUBLISHED,
      VZXREPODEFS,
      VZXGROUPSDEFS,
      formatDate,
      getReportDefinition,
      getColumnDefinition,
      getGroupsDefinition,
      getColumnGroupDefinition,
      getMaskDefinition,
      getDtDefinition;

  w.VzxReportFactory = w.VzxReportFactory || {};
  vzx = w.VzxReportFactory;
  NAME = 'Vizix - Dashboard DataTables Report Definitions Factory';
  PUBLISHED = new Date(2016, 3, 21);
  formatDate = function (d) {
    return '' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
  };
  getReportDefinition = function(idKey) {
    var obj = _.find(VZXREPORTDEFINITION, function(item) {
      return item.report === idKey;
    });
    return _.pick(obj, 'cols');
  };
  getGroupsDefinition = function(idKey) {
    var obj = _.find(VZXREPORTDEFINITION, function(item) {
      return item.report === idKey;
    });
    return _.pick(obj, 'groups');
  };
  getDtDefinition = function(idKey) {
    var obj = _.find(VZXREPORTDEFINITION, function(item) {
      return item.report === idKey;
    });
    return _.pick(obj, 'datatable');
  };
  getMaskDefinition = function(idKey) {
    var obj = _.find(VZXREPORTDEFINITION, function(item) {
      return item.report === idKey;
    });
    return _.pick(obj, 'mask');
  };
  getColumnGroupDefinition = function(colKey) {
    return  _.find(VZXGROUPSDEFS.groups, function(group) {
      return  _.find(group.subHeader, function(item) {
        return item.propertyName === colKey;
      });
    });
  };

  getColumnDefinition = function(colKey) {
    var obj = _.find(VZXREPODEFS.cols, function(item) {
      return item.propertyName === colKey;
    });
    return obj;
  };
  vzx.dtMapMasks = function(reportID) {
    if (!_.isNumber(reportID)) return '';
    VZXREPODEFS = getReportDefinition(reportID);
    if (!_.isObject(VZXREPODEFS)) return '';
    return getMaskDefinition(reportID);
  };
  vzx.dtMapDataTypeByID = function(idKey) {
    var obj = _.find(VZXDATATYPEDEF, function(item) {
      return item.id === idKey;
    });
    return obj.code;
  };
  vzx.dtMapColumnDef = function (reportID, colDef) {
    if (!_.isString(colDef)) return [];
    if (!_.isNumber(reportID)) return [];
    VZXREPODEFS = getReportDefinition(reportID);
    if (!_.isObject(VZXREPODEFS)) return [];
    return getColumnDefinition(colDef);
  };
  vzx.dtMapGroupDef = function (reportID, colDef) {
    if (!_.isString(colDef)) return [];
    if (!_.isNumber(reportID)) return [];
    VZXREPODEFS = getReportDefinition(reportID);
    if (!_.isObject(VZXREPODEFS)) return [];
    VZXGROUPSDEFS = getGroupsDefinition(reportID);
    return getColumnGroupDefinition(colDef);
  };
  vzx.dtMapDataTablesDef = function (reportID) {
    if (!_.isNumber(reportID)) return {};
    VZXREPODEFS = getReportDefinition(reportID);
    if (!_.isObject(VZXREPODEFS)) return {};
    return getDtDefinition(reportID).datatable;
  };
  vzx.getVersionInfo = function () {
    return '' + NAME + ' - ' + VERSION + ' (' + formatDate(PUBLISHED) + ')';
  };

}(window,_, jQuery));