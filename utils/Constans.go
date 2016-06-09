package utils


const (
	//--Usage example: -- select temporal_filter('ar_spt', 'Equals', 10, 10, 200, 200);
	QUERY_TEMPORAL string = "select temporal_filter('%s', '%s', '%s', '%s');"

	QUERY_IMAGE_URL string = "SELECT url FROM img_url WHERE wavelength like '%s' AND image_size = %s ORDER BY GREATEST('%s'::timestamp,  image_date) - LEAST('%s'::timestamp,  image_date) LIMIT 1;"

	IMAGE_URL_BASE string = "http://sdo.gsfc.nasa.gov/assets/img/browse/"

	// HTTPMethodPost represents the HTTP Method for POST requests, literally "POST".
	HTTPMethodPost string = "POST"
// HTTPMethodPut represents the HTTP Method for PUT requests, literally "PUT".
	HTTPMethodPut string = "PUT"
// HTTPMethodPatch represents the HTTP Method for PATCH requests, literally "PATCH".
	HTTPMethodPatch string = "PATCH"
// HTTPMethodDelete represents the HTTP Method for DELETE requests, literally "DELETE".
	HTTPMethodDelete string = "DELETE"
)

/*
static final double CDELT = 0.599733;
static final double HPCCENTER = 4096.0 / 2.0;

public static Coordinate convertHPCToPixXY(Coordinate pointIn) {
double PixX = (CoordinateSystemConverter.HPCCENTER + (pointIn.getX() / CoordinateSystemConverter.CDELT));
double PixY = (CoordinateSystemConverter.HPCCENTER - (pointIn.getY() / CoordinateSystemConverter.CDELT));
return new Coordinate(PixX, PixY);
}
 */

