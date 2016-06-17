package utils


const (
	//--Usage example: -- select temporal_filter('ar_spt', 'Equals', 10, 10, 200, 200);
	//ARRAY['ar_spt', 'ch_spt']::TEXT[]
	QUERY_SPATIO_TEMPORAL string = "select * from spatiotemporal_filter_page_all(ARRAY['ar_spt', 'ch_spt', 'sg_spt', 'fl_spt']::TEXT[], 'GreaterThan', 'Intersects','%s', '%s', %s, %s, %s, %s,'event_starttime', 20, 0);"

	//select * from temporal_col_filter_page_all( ARRAY['ar_spt', 'ch_spt']::TEXT[], 'GreaterThan', '2014-12-01 21:36:23', '2014-12-02 01:36:23', 'event_starttime', 100, 0, ARRAY['kb_archivid', 'event_starttime', 'hpc_boundcc', 'hpc_coord', 'event_type']::TEXT[]);
	QUERY_TEMPORAL_COMMON_PAGE string = "select * from temporal_filter_common_page( %s, '%s', '%s', '%s', '%s', %s, %s);"

	ALL_TABLES string = "ar,ce,cd,ch,cw,fi,fe,fa,fl,lp,os,ss,ef,cj,pg,ot,nr,sg,sp,cr,cc,er,to,hy"
	ALL_TABLES_ARRAY string = "ARRAY['ar','ce','cd','ch','cw','fi','fe','fa','fl','lp','os','ss','ef','cj','pg','ot','nr','sg','sp','cr','cc','er','hy']::TEXT[]"
	//select * from temporal_filter_page_all(ARRAY['ar_spt', 'ch_spt']::TEXT[], 'GreaterThan','2014-12-01 21:36:23', '2014-12-02 01:36:23','event_starttime', 10, 20);
	QUERY_TEMPORAL string = "select * from temporal_filter_page_all(%s, '%s','%s', '%s','%s', %s, %s);"


	QUERY_IMAGE_URL string = "SELECT url FROM img_url WHERE wavelength like '%s' AND image_size = %s AND ('%s'::timestamp - INTERVAL '10 Minutes' < image_date) AND ('%s'::timestamp + INTERVAL '10 Minutes' > image_date) ORDER BY GREATEST('%s'::timestamp,  image_date) - LEAST('%s'::timestamp,  image_date) LIMIT 1;"

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

