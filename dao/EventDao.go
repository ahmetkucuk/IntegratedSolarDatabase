package dao

import (
	"fmt"
	"database/sql"
	_ "github.com/lib/pq"
	"solardatabase/models"
	"solardatabase/utils"
	"time"
	"encoding/json"
	"errors"
	"strings"
)


var db *sql.DB

func OpenDBConnection(userName string, host string, dbName string, password string) {

	fmt.Println("Connecting to DB")
	var err error
	//db, err = sql.Open("postgres", "user=ahmetkucuk dbname=dbproject sslmode=disable")
	var dbUrl = fmt.Sprintf("user=%s host=%s dbname=%s password='%s' sslmode=disable", userName, host, dbName, password)
	db, err = sql.Open("postgres", dbUrl)

	if err != nil {
		fmt.Println("error in openning database connection")
	}

	if err = db.Ping(); err != nil {
		fmt.Println("error db connection %e", err)
	}
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

func TemporalSearch(r models.TemporalRequest) (utils.JSONString) {
	//tableNames := "ARRAY['ar', 'ch']::TEXT[]"
	//colNames := "ARRAY['kb_archivid', 'event_starttime', 'hpc_boundcc', 'hpc_coord', 'event_type']::TEXT[]"
	//select * from temporal_col_filter_page_all( ARRAY['ar_spt', 'ch_spt']::TEXT[], 'GreaterThan', '2014-12-01 21:36:23', '2014-12-02 01:36:23', 'event_starttime', 100, 0, ARRAY['kb_archivid', 'event_starttime', 'hpc_boundcc', 'hpc_coord', 'event_type']::TEXT[]);
	var query  = ""
	if r.Interpolated {
		query = fmt.Sprintf(utils.INT_QUERY_TEMPORAL_COMMON_PAGE, r.TableNames, "Overlaps", r.StartTime, r.EndTime, r.SortBy, r.Limit, r.Offset)
	} else {
		query = fmt.Sprintf(utils.QUERY_TEMPORAL_COMMON_PAGE, r.TableNames, "Overlaps", r.StartTime, r.EndTime, "event_starttime", r.Limit, r.Offset)
		if !r.IsWEB {
			query = fmt.Sprintf(utils.SELECT_KB_ARCHIVID, query)
		} else {
			query = query + ";";
		}
	}

	fmt.Println(query)
	resultJson, err := utils.GetJSON(db, query)
	if err != nil {
		fmt.Println("error: ", query, err)
	}
	return resultJson
}

func SpatioTemporalSearch(r models.SpatioTemporalRequest) (utils.JSONString) {
	//tableNames := "ARRAY['ar', 'ch']::TEXT[]"
	//colNames := "ARRAY['kb_archivid', 'event_starttime', 'hpc_boundcc', 'hpc_coord', 'event_type']::TEXT[]"
	//select * from temporal_col_filter_page_all( ARRAY['ar_spt', 'ch_spt']::TEXT[], 'GreaterThan', '2014-12-01 21:36:23', '2014-12-02 01:36:23', 'event_starttime', 100, 0, ARRAY['kb_archivid', 'event_starttime', 'hpc_boundcc', 'hpc_coord', 'event_type']::TEXT[]);
	var query  = ""
	query = fmt.Sprintf(utils.QUERY_SPATIOTEMPORAL_COMMON_PAGE, r.TableNames, r.TemporalPredicate, r.SpatialPredicate, r.StartTime, r.EndTime, r.Xmin, r.Ymin, r.Xmax, r.Ymax, r.SortBy, r.Limit, r.Offset)
	if !r.IsWEB {
		query = fmt.Sprintf(utils.SELECT_KB_ARCHIVID, query)
	}
	fmt.Println(query)
	resultJson, err := utils.GetJSON(db, query)
	if err != nil {
		fmt.Println("error: ", query, err)
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

func GetEventByIdAndTableName(r models.SearchByIdRequest) (utils.JSONString) {
	query := fmt.Sprintf(utils.EVENT_BY_TABLENAME_AND_ID,  r.EventType, r.Id)
	resultJson, err := utils.GetJSON(db, query)
	fmt.Println(query)
	if err != nil {
		fmt.Println("error %e", err)
	}
	return resultJson
}

func GetTrackIDbyEventID(r models.TrackIDRequest) (utils.JSONString, error) {
	query := fmt.Sprintf(utils.TRACKID_BY_TABLENAME_AND_EVENTID,  (r.EventType + "i"), r.EventID)
	fmt.Println(query)
	resultJson, err := utils.GetJSON(db, query)

	if err != nil {
		return resultJson, err
	}

	fmt.Println(resultJson)
	if len(resultJson) <= 2 {
		return resultJson, errors.New("Couldn't find the id")
	}
	return resultJson, nil
}


func GetCloseByEvents(r models.CloseByEventRequest) (utils.JSONString, error) {

	query := utils.FIND_CLOSE_BY_EVENTS
	query = strings.Replace(query, "event1", r.QueryEventType, -1)
	query = strings.Replace(query, "event2", r.TargetEventType, -1)
	fmt.Println(r.LookBack)
	query = strings.Replace(query, "LookBack", fmt.Sprintf("%d", r.LookBack), -1)
	query = strings.Replace(query, "QueryEventID", r.QueryEventID, -1)
	query = strings.Replace(query, "SpatialBuffer", fmt.Sprintf("%.6f", r.SpatialBuffer), -1)

	fmt.Println(query)
	resultJson, err := utils.GetJSON(db, query)

	if err != nil {
		return resultJson, err
	}

	fmt.Println(resultJson)
	if len(resultJson) <= 2 {
		return resultJson, errors.New("Couldn't find the any event")
	}
	return resultJson, nil
}
