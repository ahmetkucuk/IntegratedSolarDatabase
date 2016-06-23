package dao

import (
	"fmt"
	"database/sql"
	_ "github.com/lib/pq"
	"solardatabase/models"
	"solardatabase/utils"
	"time"
	"encoding/json"
)


var db *sql.DB

func OpenDBConnection(userName string, host string, dbName string, password string) {

	fmt.Println("Connecting to DB")
	var err error
	//db, err = sql.Open("postgres", "user=ahmetkucuk dbname=dbproject sslmode=disable")
	var dbUrl = fmt.Sprintf("user=%s host=%s dbname=%s password='%s' sslmode=disable", userName, host, dbName, password)
	db, err = sql.Open("postgres", dbUrl)

	if err != nil {
		fmt.Println("error")
	}

	if err = db.Ping(); err != nil {
		fmt.Println("error db connection %e", err)
	}
}

func GetAllEvents() ([]*models.Event) {

	rows, err := db.Query("SELECT kb_archivid as id, event_starttime as starttime, ST_AsText(hpc_bbox) as hpcbbox, ST_AsText(hpc_coord) as coordinate FROM ar LIMIT 10")

	if err != nil {
		fmt.Println("error %e", err)
	}

	var id, hpcbbox, coordinate string
	var starttime time.Time
	events := models.NewEvents()
	for rows.Next() {
		err := rows.Scan(&id, &starttime, &hpcbbox, &coordinate)
		if err != nil {
			fmt.Println("error", err)
		}
		event := &models.Event{
			Id: id,
			StartTime:  starttime,
			HpcBbox:  hpcbbox,
			Coordinate:  coordinate,
		}
		events = append(events, event)
	}
	return events
}

func GetEventsFromQuery(query string) ([]*models.Event) {
	result, err := utils.GetResultInBytes(db, query)
	fmt.Println(query)
	if err != nil {
		fmt.Println("error %e", err)
	}
	var events []*models.Event
	er := json.Unmarshal(result, &events)
	if er != nil {
		panic(er)
	}

	return events
}

func GetEventsByQuery(query string) ([]*models.Event) {
	rows, err := db.Query(query)

	events := models.NewEvents()
	if err != nil {
		fmt.Println("error %e", err)
		fmt.Println("query was %s", query)
		return events
	}

	var Id, HpcBbox, Coordinate, Type string
	var StartTime time.Time
	for rows.Next() {
		err := rows.Scan(&Id, &StartTime, &HpcBbox, &Coordinate, &Type)
		if err != nil {
			fmt.Println("error", err)
		}
		event := &models.Event{
			Id: Id,
			StartTime:  StartTime,
			HpcBbox:  HpcBbox,
			Coordinate:  Coordinate,
			Type: Type,
		}
		events = append(events, event)
	}
	return events
}

func EventsByTimeRange(r models.EventByTimeRangeRequest) ([]*models.Event) {



	fmt.Println("r.Startime:" + r.StartTime)
	query := fmt.Sprintf("Select kb_archivid as Id, event_starttime as StartTime, ST_AsText(hpc_bbox) as HpcBbox, ST_AsText(hpc_coord) as Coordinate, event_type as Type from ar WHERE event_starttime > '%s' AND event_starttime < '%s' ORDER BY event_starttime LIMIT 20;", r.StartTime, r.EndTime)
	fmt.Println("r.Endtime:" + query)
	//return GetEventsByQuery(query)
	return GetEventsFromQuery(query)
	//fmt.Printf(query)
	//resultJson, err := utils.GetJSON(db, query)
	//if err != nil {
	//	fmt.Println("error %e", err)
	//}
	//return resultJson;
}

func TemporalSearch(r models.TemporalRequest) (utils.JSONString) {
	//tableNames := "ARRAY['ar', 'ch']::TEXT[]"
	//colNames := "ARRAY['kb_archivid', 'event_starttime', 'hpc_boundcc', 'hpc_coord', 'event_type']::TEXT[]"
	//select * from temporal_col_filter_page_all( ARRAY['ar_spt', 'ch_spt']::TEXT[], 'GreaterThan', '2014-12-01 21:36:23', '2014-12-02 01:36:23', 'event_starttime', 100, 0, ARRAY['kb_archivid', 'event_starttime', 'hpc_boundcc', 'hpc_coord', 'event_type']::TEXT[]);
	query := fmt.Sprintf(utils.QUERY_TEMPORAL_COMMON_PAGE, utils.ALL_TABLES_ARRAY, "Overlaps", r.StartTime, r.EndTime, "event_starttime", r.Limit, r.Offset)
	fmt.Println(query)
	resultJson, err := utils.GetJSON(db, query)
	if err != nil {
		fmt.Println("error %e", err)
	}
	return resultJson
}

func GetClosestImage(r models.ImageRequest) (models.ImageUrl) {
	query := fmt.Sprintf(utils.QUERY_IMAGE_URL, r.Wavelength, r.Size, r.ImageDate, r.ImageDate, r.ImageDate, r.ImageDate)
	result, err := utils.GetResultInBytes(db, query)
	fmt.Println(query)
	if err != nil {
		fmt.Println("error %e", err)
	}
	var imageUrl []models.ImageUrl
	er := json.Unmarshal(result, &imageUrl)
	if er != nil {
		panic(er)
	}

	selectUrl := models.ImageUrl{}

	if len(imageUrl) != 0 {
		selectUrl.URL = utils.IMAGE_URL_BASE + imageUrl[0].URL
	} else {
		selectUrl.URL = utils.IMAGE_URL_BASE + "2013/06/11/20130611_231750_2048_0094.jpg"
	}
	return selectUrl
}
