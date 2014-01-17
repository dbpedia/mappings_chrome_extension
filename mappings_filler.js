var $textBox = $("#wpTextbox1");
var templateNameRegex = /http:\/\/mappings\.dbpedia\.org\/index\.php\?title=Mapping_(.*):(.*)\&action=edit/;

var templateMappingOpen = "{{TemplateMapping | mapToClass = ";
var templateMappingMappings = "\n" + "| mappings = " + "\n";
var templateMappingClose = "}}";
var propertyMappingOpen = "\t<!-- {{ PropertyMapping | templateProperty = ";
var propertyMappingClose = " | ontologyProperty = }} -->\n";

function getTemplateMapping( templateTable ) {
	// http://mappings.dbpedia.org/server/templatestatistics/it/?template=Edizione_di_competizione_sportiva
	var templateMapping = templateMappingOpen;
	
	if ( templateTable ) {
	templateMapping += templateMappingMappings;
	templateTable.find("tr").each(function(index) {
		if (index > 0) {
			var $property = $(this).find("td:nth-child(2)")
			var propertyName = $property.text().trim();
			templateMapping += propertyMappingOpen;
			templateMapping += propertyName;
			templateMapping += propertyMappingClose;
		}
	});
	}
	
	templateMapping += templateMappingClose;
	return templateMapping;
}

if (!$textBox.val()) {
	var templateInfo = templateNameRegex.exec(document.URL);
	var templateLang = templateInfo[1];
	var templateName = templateInfo[2];
	
	$.ajax({
		url: "http://mappings.dbpedia.org/server/templatestatistics/" + templateLang + "/?template=" + templateName,
		dataType: "html",
	}).done(function (data) {

		var templateMapping = getTemplateMapping($(data).find('tbody').eq(1));
		if (templateMapping) {
			$textBox.text(templateMapping);
		}
	}).fail(function () {
		var templateMapping = getTemplateMapping(null);
                if (templateMapping) {
                        $textBox.text(templateMapping);
                }
	});
}
