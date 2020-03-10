(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "advisory_state",
            alias: "Advisory State",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "friendly_date",
            alias: "magnitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "country_eng",
            alias: "Country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "country_iso",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "canada_travel_advisory_feed",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        var request = new XMLHttpRequest()
		var data=[]
		
		request.open('GET', 'https://travel.gc.ca/travelling/advisories', true)
		request.setRequestHeader("Origin", "travel.gc.ca")
		request.onload = function() {
		  // Begin accessing JSON data here
		  data = (this.response)
		  console.log(data)
		  if (request.status >= 200 && request.status < 400) {

		  } else {
		  }
		}
		request.send()

		extractJSON = data.slice(data.indexOf("indexUpdatedDataJSON"), data.indexOf("// Extract the right content from the JSON data based on the language"))
		eval(extractJSON)
		
		var feat = indexUpdatedDataJSON.data
		console.log(feat)
			tableData = [];

		// Iterate over the JSON object
		for (var i = 0, len = feat.length; i < len; i++) {
			tableData.push({
				"advisory-state": feat[i].advisory_state,
				"friendly-date": feat[i].properties.friendly_date,
				"country-eng": feat[i].properties.country_eng,
				"country-iso": feat[i].country_iso
			});
		}

		table.appendRows(tableData);
		doneCallback();

    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Global Affairs Canada Travel Advisory Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
