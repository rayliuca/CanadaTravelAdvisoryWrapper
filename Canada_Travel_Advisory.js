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
            id: "date_published",
            dataType: tableau.dataTypeEnum.dateTime
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
	// console.log("entering myConnector.getData")
    myConnector.getData = function(table, doneCallback) {
		// console.log("in myConnector.getData")
        var request = new XMLHttpRequest()
		var data=[]
		
		request.open('GET', 'https://cors-anywhere.herokuapp.com/https://travel.gc.ca/travelling/advisories', true)
		request.setRequestHeader("x-requested-with", "travel.gc.ca")
		request.onload = function() {
		  // Begin accessing JSON data here
		  data = (this.response)
		  // console.log(data)
		  if (request.status >= 200 && request.status < 400) {
			  // console.log("request.status= "+request.status)
			  
			extractJSON = data.slice(data.indexOf("indexUpdatedDataJSON"), data.indexOf("// Extract the right content from the JSON data based on the language"))
			eval(extractJSON)
			
			var feat = indexUpdatedDataJSON.data
			
			// console.log(feat)
				tableData = [];

			// Iterate over the JSON object
			feat_keys=Object.keys(feat)
			for (var i = 0, len = feat_keys.length; i < len; i++) {
				tableData.push({
					"advisory_state": feat[feat_keys[i]]["advisory-state"],
					"date_published": feat[feat_keys[i]]["date-published"]["asp"],
					"country_eng": feat[feat_keys[i]]["country-eng"],
					"country_iso": feat[feat_keys[i]]["country-iso"]
				});
			}
			console.log(tableData)
			table.appendRows(tableData);
			doneCallback();
		  } else {
		  }
		}
		request.send()

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
