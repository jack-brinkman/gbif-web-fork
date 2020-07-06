const _ = require('lodash');

const terms = [
    {
    "simpleName": "gbifID",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/gbifID",
    "group": "Occurrence",
    "source": "GbifTerm"
    },
    {
    "simpleName": "abstract",
    "qualifiedName": "http://purl.org/dc/terms/abstract",
    "source": "DcTerm"
    },
    {
    "simpleName": "accessRights",
    "qualifiedName": "http://purl.org/dc/terms/accessRights",
    "source": "DcTerm"
    },
    {
    "simpleName": "accrualMethod",
    "qualifiedName": "http://purl.org/dc/terms/accrualMethod",
    "source": "DcTerm"
    },
    {
    "simpleName": "accrualPeriodicity",
    "qualifiedName": "http://purl.org/dc/terms/accrualPeriodicity",
    "source": "DcTerm"
    },
    {
    "simpleName": "accrualPolicy",
    "qualifiedName": "http://purl.org/dc/terms/accrualPolicy",
    "source": "DcTerm"
    },
    {
    "simpleName": "alternative",
    "qualifiedName": "http://purl.org/dc/terms/alternative",
    "source": "DcTerm"
    },
    {
    "simpleName": "audience",
    "qualifiedName": "http://purl.org/dc/terms/audience",
    "source": "DcTerm"
    },
    {
    "simpleName": "available",
    "qualifiedName": "http://purl.org/dc/terms/available",
    "source": "DcTerm"
    },
    {
    "simpleName": "bibliographicCitation",
    "qualifiedName": "http://purl.org/dc/terms/bibliographicCitation",
    "source": "DcTerm"
    },
    {
    "simpleName": "conformsTo",
    "qualifiedName": "http://purl.org/dc/terms/conformsTo",
    "source": "DcTerm"
    },
    {
    "simpleName": "contributor",
    "qualifiedName": "http://purl.org/dc/terms/contributor",
    "source": "DcTerm"
    },
    {
    "simpleName": "coverage",
    "qualifiedName": "http://purl.org/dc/terms/coverage",
    "source": "DcTerm"
    },
    {
    "simpleName": "created",
    "qualifiedName": "http://purl.org/dc/terms/created",
    "source": "DcTerm"
    },
    {
    "simpleName": "creator",
    "qualifiedName": "http://purl.org/dc/terms/creator",
    "source": "DcTerm"
    },
    {
    "simpleName": "date",
    "qualifiedName": "http://purl.org/dc/terms/date",
    "source": "DcTerm"
    },
    {
    "simpleName": "dateAccepted",
    "qualifiedName": "http://purl.org/dc/terms/dateAccepted",
    "source": "DcTerm"
    },
    {
    "simpleName": "dateCopyrighted",
    "qualifiedName": "http://purl.org/dc/terms/dateCopyrighted",
    "source": "DcTerm"
    },
    {
    "simpleName": "dateSubmitted",
    "qualifiedName": "http://purl.org/dc/terms/dateSubmitted",
    "source": "DcTerm"
    },
    {
    "simpleName": "description",
    "qualifiedName": "http://purl.org/dc/terms/description",
    "source": "DcTerm"
    },
    {
    "simpleName": "educationLevel",
    "qualifiedName": "http://purl.org/dc/terms/educationLevel",
    "source": "DcTerm"
    },
    {
    "simpleName": "extent",
    "qualifiedName": "http://purl.org/dc/terms/extent",
    "source": "DcTerm"
    },
    {
    "simpleName": "format",
    "qualifiedName": "http://purl.org/dc/terms/format",
    "source": "DcTerm"
    },
    {
    "simpleName": "hasFormat",
    "qualifiedName": "http://purl.org/dc/terms/hasFormat",
    "source": "DcTerm"
    },
    {
    "simpleName": "hasPart",
    "qualifiedName": "http://purl.org/dc/terms/hasPart",
    "source": "DcTerm"
    },
    {
    "simpleName": "hasVersion",
    "qualifiedName": "http://purl.org/dc/terms/hasVersion",
    "source": "DcTerm"
    },
    {
    "simpleName": "identifier",
    "qualifiedName": "http://purl.org/dc/terms/identifier",
    "source": "DcTerm"
    },
    {
    "simpleName": "instructionalMethod",
    "qualifiedName": "http://purl.org/dc/terms/instructionalMethod",
    "source": "DcTerm"
    },
    {
    "simpleName": "isFormatOf",
    "qualifiedName": "http://purl.org/dc/terms/isFormatOf",
    "source": "DcTerm"
    },
    {
    "simpleName": "isPartOf",
    "qualifiedName": "http://purl.org/dc/terms/isPartOf",
    "source": "DcTerm"
    },
    {
    "simpleName": "isReferencedBy",
    "qualifiedName": "http://purl.org/dc/terms/isReferencedBy",
    "source": "DcTerm"
    },
    {
    "simpleName": "isReplacedBy",
    "qualifiedName": "http://purl.org/dc/terms/isReplacedBy",
    "source": "DcTerm"
    },
    {
    "simpleName": "isRequiredBy",
    "qualifiedName": "http://purl.org/dc/terms/isRequiredBy",
    "source": "DcTerm"
    },
    {
    "simpleName": "isVersionOf",
    "qualifiedName": "http://purl.org/dc/terms/isVersionOf",
    "source": "DcTerm"
    },
    {
    "simpleName": "issued",
    "qualifiedName": "http://purl.org/dc/terms/issued",
    "source": "DcTerm"
    },
    {
    "simpleName": "language",
    "qualifiedName": "http://purl.org/dc/terms/language",
    "source": "DcTerm"
    },
    {
    "simpleName": "license",
    "qualifiedName": "http://purl.org/dc/terms/license",
    "source": "DcTerm"
    },
    {
    "simpleName": "mediator",
    "qualifiedName": "http://purl.org/dc/terms/mediator",
    "source": "DcTerm"
    },
    {
    "simpleName": "medium",
    "qualifiedName": "http://purl.org/dc/terms/medium",
    "source": "DcTerm"
    },
    {
    "simpleName": "modified",
    "qualifiedName": "http://purl.org/dc/terms/modified",
    "source": "DcTerm"
    },
    {
    "simpleName": "provenance",
    "qualifiedName": "http://purl.org/dc/terms/provenance",
    "source": "DcTerm"
    },
    {
    "simpleName": "publisher",
    "qualifiedName": "http://purl.org/dc/terms/publisher",
    "source": "DcTerm"
    },
    {
    "simpleName": "references",
    "qualifiedName": "http://purl.org/dc/terms/references",
    "source": "DcTerm"
    },
    {
    "simpleName": "relation",
    "qualifiedName": "http://purl.org/dc/terms/relation",
    "source": "DcTerm"
    },
    {
    "simpleName": "replaces",
    "qualifiedName": "http://purl.org/dc/terms/replaces",
    "source": "DcTerm"
    },
    {
    "simpleName": "requires",
    "qualifiedName": "http://purl.org/dc/terms/requires",
    "source": "DcTerm"
    },
    {
    "simpleName": "rights",
    "qualifiedName": "http://purl.org/dc/terms/rights",
    "source": "DcTerm"
    },
    {
    "simpleName": "rightsHolder",
    "qualifiedName": "http://purl.org/dc/terms/rightsHolder",
    "source": "DcTerm"
    },
    {
    "simpleName": "source",
    "qualifiedName": "http://purl.org/dc/terms/source",
    "source": "DcTerm"
    },
    {
    "simpleName": "spatial",
    "qualifiedName": "http://purl.org/dc/terms/spatial",
    "source": "DcTerm"
    },
    {
    "simpleName": "subject",
    "qualifiedName": "http://purl.org/dc/terms/subject",
    "source": "DcTerm"
    },
    {
    "simpleName": "tableOfContents",
    "qualifiedName": "http://purl.org/dc/terms/tableOfContents",
    "source": "DcTerm"
    },
    {
    "simpleName": "temporal",
    "qualifiedName": "http://purl.org/dc/terms/temporal",
    "source": "DcTerm"
    },
    {
    "simpleName": "title",
    "qualifiedName": "http://purl.org/dc/terms/title",
    "source": "DcTerm"
    },
    {
    "simpleName": "type",
    "qualifiedName": "http://purl.org/dc/terms/type",
    "source": "DcTerm"
    },
    {
    "simpleName": "valid",
    "qualifiedName": "http://purl.org/dc/terms/valid",
    "source": "DcTerm"
    },
    {
    "simpleName": "institutionID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/institutionID",
    "group": "Record",
    "source": "DwcTerm"
    },
    {
    "simpleName": "collectionID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/collectionID",
    "group": "Record",
    "source": "DwcTerm"
    },
    {
    "simpleName": "datasetID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/datasetID",
    "group": "Record",
    "source": "DwcTerm"
    },
    {
    "simpleName": "institutionCode",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/institutionCode",
    "group": "Record",
    "source": "DwcTerm"
    },
    {
    "simpleName": "collectionCode",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/collectionCode",
    "group": "Record",
    "source": "DwcTerm"
    },
    {
    "simpleName": "datasetName",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/datasetName",
    "group": "Record",
    "source": "DwcTerm"
    },
    {
    "simpleName": "ownerInstitutionCode",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/ownerInstitutionCode",
    "group": "Record",
    "source": "DwcTerm"
    },
    {
    "simpleName": "basisOfRecord",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/basisOfRecord",
    "group": "Record",
    "source": "DwcTerm"
    },
    {
    "simpleName": "informationWithheld",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/informationWithheld",
    "group": "Record",
    "source": "DwcTerm"
    },
    {
    "simpleName": "dataGeneralizations",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/dataGeneralizations",
    "group": "Record",
    "source": "DwcTerm"
    },
    {
    "simpleName": "dynamicProperties",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/dynamicProperties",
    "group": "Record",
    "source": "DwcTerm"
    },
    {
    "simpleName": "occurrenceID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/occurrenceID",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "catalogNumber",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/catalogNumber",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "recordNumber",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/recordNumber",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "recordedBy",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/recordedBy",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "individualCount",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/individualCount",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "organismQuantity",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/organismQuantity",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "organismQuantityType",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/organismQuantityType",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "sex",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/sex",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "lifeStage",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/lifeStage",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "reproductiveCondition",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/reproductiveCondition",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "behavior",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/behavior",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "establishmentMeans",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/establishmentMeans",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "occurrenceStatus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/occurrenceStatus",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "preparations",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/preparations",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "disposition",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/disposition",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "associatedReferences",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/associatedReferences",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "associatedSequences",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/associatedSequences",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "associatedTaxa",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/associatedTaxa",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "otherCatalogNumbers",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/otherCatalogNumbers",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "occurrenceRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/occurrenceRemarks",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "organismID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/organismID",
    "group": "Organism",
    "source": "DwcTerm"
    },
    {
    "simpleName": "organismName",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/organismName",
    "group": "Organism",
    "source": "DwcTerm"
    },
    {
    "simpleName": "organismScope",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/organismScope",
    "group": "Organism",
    "source": "DwcTerm"
    },
    {
    "simpleName": "associatedOccurrences",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/associatedOccurrences",
    "group": "Organism",
    "source": "DwcTerm"
    },
    {
    "simpleName": "associatedOrganisms",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/associatedOrganisms",
    "group": "Organism",
    "source": "DwcTerm"
    },
    {
    "simpleName": "previousIdentifications",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/previousIdentifications",
    "group": "Organism",
    "source": "DwcTerm"
    },
    {
    "simpleName": "organismRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/organismRemarks",
    "group": "Organism",
    "source": "DwcTerm"
    },
    {
    "simpleName": "materialSampleID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/materialSampleID",
    "group": "MaterialSample",
    "source": "DwcTerm"
    },
    {
    "simpleName": "eventID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/eventID",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "parentEventID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/parentEventID",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "fieldNumber",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/fieldNumber",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "eventDate",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/eventDate",
    "group": "Event",
    "source": "DwcTerm",
    "esField": "eventDateSingle"
    },
    {
    "simpleName": "eventTime",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/eventTime",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "startDayOfYear",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/startDayOfYear",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "endDayOfYear",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/endDayOfYear",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "year",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/year",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "month",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/month",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "day",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/day",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "verbatimEventDate",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimEventDate",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "habitat",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/habitat",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "samplingProtocol",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/samplingProtocol",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "samplingEffort",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/samplingEffort",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "sampleSizeValue",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/sampleSizeValue",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "sampleSizeUnit",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/sampleSizeUnit",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "fieldNotes",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/fieldNotes",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "eventRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/eventRemarks",
    "group": "Event",
    "source": "DwcTerm"
    },
    {
    "simpleName": "locationID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/locationID",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "higherGeographyID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/higherGeographyID",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "higherGeography",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/higherGeography",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "continent",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/continent",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "waterBody",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/waterBody",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "islandGroup",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/islandGroup",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "island",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/island",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "countryCode",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/countryCode",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "stateProvince",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/stateProvince",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "county",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/county",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "municipality",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/municipality",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "locality",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/locality",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "verbatimLocality",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimLocality",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "verbatimElevation",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimElevation",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "verbatimDepth",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimDepth",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "minimumDistanceAboveSurfaceInMeters",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/minimumDistanceAboveSurfaceInMeters",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "maximumDistanceAboveSurfaceInMeters",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/maximumDistanceAboveSurfaceInMeters",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "locationAccordingTo",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/locationAccordingTo",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "locationRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/locationRemarks",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "decimalLatitude",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/decimalLatitude",
    "group": "Location",
    "source": "DwcTerm",
    "esField": "coordinates.lat"
    },
    {
    "simpleName": "decimalLongitude",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/decimalLongitude",
    "group": "Location",
    "source": "DwcTerm",
    "esField": "coordinates.lon"
    },
    {
    "simpleName": "coordinateUncertaintyInMeters",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/coordinateUncertaintyInMeters",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "coordinatePrecision",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/coordinatePrecision",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "pointRadiusSpatialFit",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/pointRadiusSpatialFit",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "verbatimCoordinateSystem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimCoordinateSystem",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "verbatimSRS",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimSRS",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "footprintWKT",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/footprintWKT",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "footprintSRS",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/footprintSRS",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "footprintSpatialFit",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/footprintSpatialFit",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "georeferencedBy",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/georeferencedBy",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "georeferencedDate",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/georeferencedDate",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "georeferenceProtocol",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/georeferenceProtocol",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "georeferenceSources",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/georeferenceSources",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "georeferenceVerificationStatus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/georeferenceVerificationStatus",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "georeferenceRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/georeferenceRemarks",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "geologicalContextID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/geologicalContextID",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "earliestEonOrLowestEonothem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/earliestEonOrLowestEonothem",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "latestEonOrHighestEonothem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/latestEonOrHighestEonothem",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "earliestEraOrLowestErathem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/earliestEraOrLowestErathem",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "latestEraOrHighestErathem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/latestEraOrHighestErathem",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "earliestPeriodOrLowestSystem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/earliestPeriodOrLowestSystem",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "latestPeriodOrHighestSystem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/latestPeriodOrHighestSystem",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "earliestEpochOrLowestSeries",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/earliestEpochOrLowestSeries",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "latestEpochOrHighestSeries",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/latestEpochOrHighestSeries",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "earliestAgeOrLowestStage",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/earliestAgeOrLowestStage",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "latestAgeOrHighestStage",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/latestAgeOrHighestStage",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "lowestBiostratigraphicZone",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/lowestBiostratigraphicZone",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "highestBiostratigraphicZone",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/highestBiostratigraphicZone",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "lithostratigraphicTerms",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/lithostratigraphicTerms",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "group",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/group",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "formation",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/formation",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "member",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/member",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "bed",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/bed",
    "group": "GeologicalContext",
    "source": "DwcTerm"
    },
    {
    "simpleName": "identificationID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/identificationID",
    "group": "Identification",
    "source": "DwcTerm"
    },
    {
    "simpleName": "identificationQualifier",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/identificationQualifier",
    "group": "Identification",
    "source": "DwcTerm"
    },
    {
    "simpleName": "typeStatus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/typeStatus",
    "group": "Identification",
    "source": "DwcTerm"
    },
    {
    "simpleName": "identifiedBy",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/identifiedBy",
    "group": "Identification",
    "source": "DwcTerm"
    },
    {
    "simpleName": "dateIdentified",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/dateIdentified",
    "group": "Identification",
    "source": "DwcTerm"
    },
    {
    "simpleName": "identificationReferences",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/identificationReferences",
    "group": "Identification",
    "source": "DwcTerm"
    },
    {
    "simpleName": "identificationVerificationStatus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/identificationVerificationStatus",
    "group": "Identification",
    "source": "DwcTerm"
    },
    {
    "simpleName": "identificationRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/identificationRemarks",
    "group": "Identification",
    "source": "DwcTerm"
    },
    {
    "simpleName": "taxonID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/taxonID",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "scientificNameID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/scientificNameID",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "acceptedNameUsageID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/acceptedNameUsageID",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "parentNameUsageID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/parentNameUsageID",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "originalNameUsageID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/originalNameUsageID",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "nameAccordingToID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/nameAccordingToID",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "namePublishedInID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/namePublishedInID",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "taxonConceptID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/taxonConceptID",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "scientificName",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/scientificName",
    "group": "Taxon",
    "source": "DwcTerm",
    "esField": "gbifClassification.usage.name"
    },
    {
    "simpleName": "acceptedNameUsage",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/acceptedNameUsage",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "parentNameUsage",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/parentNameUsage",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "originalNameUsage",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/originalNameUsage",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "nameAccordingTo",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/nameAccordingTo",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "namePublishedIn",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/namePublishedIn",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "namePublishedInYear",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/namePublishedInYear",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "higherClassification",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/higherClassification",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "kingdom",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/kingdom",
    "group": "Taxon",
    "source": "DwcTerm",
    "esField": "gbifClassification.kingdom"
    },
    {
    "simpleName": "phylum",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/phylum",
    "group": "Taxon",
    "source": "DwcTerm",
    "esField": "gbifClassification.phylum"
    },
    {
    "simpleName": "class",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/class",
    "group": "Taxon",
    "source": "DwcTerm",
    "esField": "gbifClassification.class"
    },
    {
    "simpleName": "order",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/order",
    "group": "Taxon",
    "source": "DwcTerm",
    "esField": "gbifClassification.order"
    },
    {
    "simpleName": "family",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/family",
    "group": "Taxon",
    "source": "DwcTerm",
    "esField": "gbifClassification.family"
    },
    {
    "simpleName": "genus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/genus",
    "group": "Taxon",
    "source": "DwcTerm",
    "esField": "gbifClassification.genus"
    },
    {
    "simpleName": "subgenus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/subgenus",
    "group": "Taxon",
    "source": "DwcTerm",
    "esField": "gbifClassification.subgenus"
    },
    {
    "simpleName": "specificEpithet",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/specificEpithet",
    "group": "Taxon",
    "source": "DwcTerm",
    "esField": "gbifClassification.usageParsedName.specificEpithet"
    },
    {
    "simpleName": "infraspecificEpithet",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/infraspecificEpithet",
    "group": "Taxon",
    "source": "DwcTerm",
    "esField": "gbifClassification.usageParsedName.infraspecificEpithet"
    },
    {
    "simpleName": "taxonRank",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/taxonRank",
    "group": "Taxon",
    "source": "DwcTerm",
    "esField": "gbifClassification.usageParsedName.rank"
    },
    {
    "simpleName": "verbatimTaxonRank",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimTaxonRank",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "vernacularName",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/vernacularName",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "nomenclaturalCode",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/nomenclaturalCode",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "taxonomicStatus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/taxonomicStatus",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "nomenclaturalStatus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/nomenclaturalStatus",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "taxonRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/taxonRemarks",
    "group": "Taxon",
    "source": "DwcTerm"
    },
    {
    "simpleName": "datasetKey",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/datasetKey",
    "group": "Dataset",
    "source": "GbifTerm"
    },
    {
    "simpleName": "publishingCountry",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/publishingCountry",
    "group": "Dataset",
    "source": "GbifTerm"
    },
    {
    "simpleName": "lastInterpreted",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/lastInterpreted",
    "group": "Occurrence",
    "source": "GbifTerm"
    },
    {
    "simpleName": "elevation",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/elevation",
    "group": "Location",
    "source": "GbifTerm"
    },
    {
    "simpleName": "elevationAccuracy",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/elevationAccuracy",
    "group": "Location",
    "source": "GbifTerm"
    },
    {
    "simpleName": "depth",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/depth",
    "group": "Location",
    "source": "GbifTerm"
    },
    {
    "simpleName": "depthAccuracy",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/depthAccuracy",
    "group": "Location",
    "source": "GbifTerm"
    },
    {
    "simpleName": "distanceAboveSurface",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/distanceAboveSurface",
    "group": "Location",
    "source": "GbifTerm"
    },
    {
    "simpleName": "distanceAboveSurfaceAccuracy",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/distanceAboveSurfaceAccuracy",
    "group": "Location",
    "source": "GbifTerm"
    },
    {
    "simpleName": "issue",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/issue",
    "group": "Occurrence",
    "source": "GbifTerm"
    },
    {
    "simpleName": "mediaType",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/mediaType",
    "group": "Occurrence",
    "source": "GbifTerm"
    },
    {
    "simpleName": "hasCoordinate",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/hasCoordinate",
    "group": "Occurrence",
    "source": "GbifTerm"
    },
    {
    "simpleName": "hasGeospatialIssues",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/hasGeospatialIssues",
    "group": "Occurrence",
    "source": "GbifTerm"
    },
    {
    "simpleName": "taxonKey",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/taxonKey",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "acceptedTaxonKey",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/acceptedTaxonKey",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "kingdomKey",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/kingdomKey",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "phylumKey",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/phylumKey",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "classKey",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/classKey",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "orderKey",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/orderKey",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "familyKey",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/familyKey",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "genusKey",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/genusKey",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "subgenusKey",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/subgenusKey",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "speciesKey",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/speciesKey",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "species",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/species",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "genericName",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/genericName",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "acceptedScientificName",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/acceptedScientificName",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "verbatimScientificName",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/verbatimScientificName",
    "group": "Taxon",
    "source": "GbifTerm"
    },
    {
    "simpleName": "typifiedName",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/typifiedName",
    "group": "Identification",
    "source": "GbifTerm"
    },
    {
    "simpleName": "protocol",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/protocol",
    "group": "Crawling",
    "source": "GbifTerm"
    },
    {
    "simpleName": "lastParsed",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/lastParsed",
    "group": "Crawling",
    "source": "GbifTerm"
    },
    {
    "simpleName": "lastCrawled",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/lastCrawled",
    "group": "Crawling",
    "source": "GbifTerm"
    },
    {
    "simpleName": "repatriated",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/repatriated",
    "group": "Occurrence",
    "source": "GbifTerm"
    },
    {
    "simpleName": "relativeOrganismQuantity",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/relativeOrganismQuantity",
    "group": "MaterialSample",
    "source": "GbifTerm"
    },
    {
    "simpleName": "recordedByID",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/recordedByID",
    "group": "Occurrence",
    "source": "GbifTerm"
    },
    {
    "simpleName": "identifiedByID",
    "qualifiedName": "http://rs.gbif.org/terms/1.0/identifiedByID",
    "group": "Identification",
    "source": "GbifTerm"
    },
    {
    "simpleName": "associatedMedia",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/associatedMedia",
    "group": "Occurrence",
    "source": "DwcTerm"
    },
    {
    "simpleName": "country",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/country",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "minimumElevationInMeters",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/minimumElevationInMeters",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "maximumElevationInMeters",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/maximumElevationInMeters",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "minimumDepthInMeters",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/minimumDepthInMeters",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "maximumDepthInMeters",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/maximumDepthInMeters",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "geodeticDatum",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/geodeticDatum",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "verbatimCoordinates",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimCoordinates",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "verbatimLatitude",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "verbatimLongitude",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
    "group": "Location",
    "source": "DwcTerm"
    },
    {
    "simpleName": "scientificNameAuthorship",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/scientificNameAuthorship",
    "group": "Taxon",
    "source": "DwcTerm"
    }
    ];


const groupedTerms = terms.reduce((acc, cur) => {
    _.set(acc, `${cur.group}.${cur.simpleName}`, cur)
    return acc
}, {})

const getRemarks = ({value, verbatim}) => {
    if(!verbatim){
        return "inferred"
    } else if(value != verbatim){
        return "altered"
    } else { return null};

}
  module.exports = Object.keys(groupedTerms).reduce((acc, cur) => {
    acc[cur] = (occurrence) => {
      return Object.keys(groupedTerms[cur]).reduce((a,c) => {
        const value = groupedTerms[cur][c].esField ? _.get(occurrence, groupedTerms[cur][c].esField) : _.get(occurrence, groupedTerms[cur][c].simpleName) ?  _.get(occurrence, groupedTerms[cur][c].simpleName) : _.get(occurrence, `verbatim.core["${groupedTerms[cur][c].qualifiedName}"]`)
            if(value){
                a[c] =  {
                    value,
                    verbatim: _.get(occurrence, `verbatim.core["${groupedTerms[cur][c].qualifiedName}"]`)
                }
                a[c].remarks = getRemarks(a[c])

            }   
                return  a;
            
      }, {})
    }
    return acc;
  }, {});

