package utils

const (
	//--Usage example: -- select temporal_filter('ar_spt', 'Equals', 10, 10, 200, 200);
	//ARRAY['ar_spt', 'ch_spt']::TEXT[]
	QUERY_SPATIO_TEMPORAL string = "select * from spatiotemporal_filter_page_all(ARRAY['ar_spt', 'ch_spt', 'sg_spt', 'fl_spt']::TEXT[], 'GreaterThan', 'Intersects','%s', '%s', %s, %s, %s, %s,'event_starttime', 20, 0);"

	//select * from temporal_col_filter_page_all( ARRAY['ar_spt', 'ch_spt']::TEXT[], 'GreaterThan', '2014-12-01 21:36:23', '2014-12-02 01:36:23', 'event_starttime', 100, 0, ARRAY['kb_archivid', 'event_starttime', 'hpc_boundcc', 'hpc_coord', 'event_type']::TEXT[]);
	QUERY_TEMPORAL_COMMON_PAGE string = "select * from temporal_filter_common_page( %s, '%s', '%s', '%s', '%s', %d, %d);"
	INT_QUERY_TEMPORAL_COMMON_PAGE string = "select * from int_temporal_filter_common_page( %s, '%s', '%s', '%s', '%s', %d, %d);"

	QUERY_SPATIOTEMPORAL_COMMON_PAGE string = "select * from spatiotemporal_filter_common_page( %s, '%s', '%s', '%s', '%s', %g, %g, %g, %g, '%s', %d, %d);"

	ALL_TABLES string = "ar,ce,cd,ch,cw,fi,fe,fa,fl,lp,os,ss,ef,cj,pg,ot,nr,sg,sp,cr,cc,er,to,hy"
	ALL_TABLES_ARRAY string = "ARRAY['ar','ce','cd','ch','cw','fi','fe','fa','fl','lp','os','ss','ef','cj','pg','ot','nr','sg','sp','cr','cc','er','hy']::TEXT[]"
	//INT_ALL_TABLES_ARRAY string = "ARRAY['ar_interpolated','ce_interpolated','cd_interpolated','ch_interpolated','cw_interpolated','fi_interpolated','fe_interpolated','fa_interpolated','fl_interpolated','lp_interpolated','os_interpolated','ss_interpolated','ef_interpolated','cj_interpolated','pg_interpolated','ot_interpolated','nr_interpolated','sg_interpolated','sp_interpolated','cr_interpolated','cc_interpolated','er_interpolated','hy_interpolated']::TEXT[]"

	//ALL_TABLES_ARRAY string = "ARRAY['ar','ce','cd','ch','cw','fi','fe','fa','fl','lp','os','ss','ef','cj','pg','ot','nr','sg','sp','cr','cc','er','hy']::TEXT[]"
	//select * from temporal_filter_page_all(ARRAY['ar_spt', 'ch_spt']::TEXT[], 'GreaterThan','2014-12-01 21:36:23', '2014-12-02 01:36:23','event_starttime', 10, 20);
	QUERY_TEMPORAL string = "select * from temporal_filter_page_all(%s, '%s','%s', '%s','%s', %s, %s);"


	QUERY_IMAGE_URL string = "SELECT url FROM img_url WHERE wavelength like '%s' AND image_size = %s AND ('%s'::timestamp - INTERVAL '1440 Minutes' < image_date) AND ('%s'::timestamp + INTERVAL '1440 Minutes' > image_date) ORDER BY GREATEST('%s'::timestamp,  image_date) - LEAST('%s'::timestamp,  image_date) LIMIT 1;"

	EVENT_BY_TABLENAME_AND_ID string = "SELECT *, st_asText(hpc_bbox) as hpc_bbox,st_asText(hpc_coord) as hpc_coord, st_asText(hpc_boundcc) as hpc_boundcc, st_asText(hpc_geom) as hpc_geom, " +
		"st_asText(hgs_bbox) as hgs_bbox,st_asText(hgs_coord) as hgs_coord, st_asText(hgs_boundcc) as hgs_boundcc, " +
		"st_asText(hgc_bbox) as hgc_bbox,st_asText(hgc_coord) as hgc_coord, st_asText(hgc_boundcc) as hgc_boundcc, " +
		"st_asText(hrc_bbox) as hrc_bbox,st_asText(hrc_coord) as hrc_coord, st_asText(hrc_boundcc) as hrc_boundcc " +
		" FROM %s WHERE kb_archivid='%s';"

	TRACKID_BY_TABLENAME_AND_EVENTID string = "SELECT trackid from %s WHERE kbarchivid = '%s';"

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

