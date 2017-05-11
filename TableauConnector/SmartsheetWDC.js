(function () {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        
        var cols = [{
            id: "jobName",
            alias: "Job Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "jobDescription",
            alias: "Job Description",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "requestor",
            alias: "Requestor",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "requestedCompletionDate",
            alias: "Requested Completion Date",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "estimatedJobSize",
            alias: "Estimated Job Size",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "priority",
            alias: "Priority",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "assignedTo",
            alias: "Assigned To",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "status",
            alias: "Status",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "team",
            alias: "Team",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "appsTeamJobs",
            alias: "Apps Team Jobs",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function (table, doneCallback) {

        $.ajax({
            url: 'https://api.smartsheet.com/2.0/sheets/2455526790457220',
            type: 'GET',
            dataType: 'json',
            success: function (resp) {
                var feat = resp.rows,
                    tableData = [];

                // Iterate over the JSON object
                for (var i = 0, len = feat.length; i < len; i++) {
                    tableData.push({
                        "jobName": feat[i].cells[0].displayValue,
                        "jobDescription": feat[i].cells[1].displayValue,
                        "requestor": feat[i].cells[2].displayValue,
                        "requestedCompletionDate": feat[i].cells[3].displayValue,
                        "estimatedJobSize": feat[i].cells[4].displayValue,
                        "priority": feat[i].cells[5].displayValue,
                        "assignedTo": feat[i].cells[6].displayValue,
                        "status": feat[i].cells[7].displayValue,
                        "team": feat[i].cells[8].displayValue
                    });
                }

                table.appendRows(tableData);
                doneCallback();
            },
            error: function (jqXHR, status, error) { tableau.log("SmartsheetWDC Error: " + status + " :: " + error); },
            beforeSend: setHeader
        });
    };

    function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer 6plyzwbv0jeufdhbolemhsxgfg');
    }

      

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();