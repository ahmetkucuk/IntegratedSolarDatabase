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

func OpenDBConnection() {

	fmt.Println("Connecting to DB")
	var err error
	db, err = sql.Open("postgres", "user=ahmetkucuk dbname=dbproject sslmode=disable")

	if err != nil {
		fmt.Println("error")
	}

	if err = db.Ping(); err != nil {
		fmt.Println("error db connection")
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
			HpcBBox:  hpcbbox,
			Coordinate:  coordinate,
		}
		events = append(events, event)
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

	var id, hpcbbox, coordinate string
	var starttime time.Time
	for rows.Next() {
		err := rows.Scan(&id, &starttime, &hpcbbox, &coordinate)
		if err != nil {
			fmt.Println("error", err)
		}
		event := &models.Event{
			Id: id,
			StartTime:  starttime,
			HpcBBox:  hpcbbox,
			Coordinate:  coordinate,
		}
		events = append(events, event)
	}
	return events
}

func EventsByTimeRange(r models.EventByTimeRangeRequest) ([]*models.Event) {



	fmt.Println("r.Startime:" + r.StartTime)
	fmt.Println("r.Endtime:" + r.EndTime)
	query := fmt.Sprintf("Select kb_archivid as id, event_starttime as starttime, ST_AsText(hpc_bbox) as hpcbbox, ST_AsText(hpc_coord) as coordinate from ar WHERE event_starttime > '%s' AND event_starttime < '%s' ORDER BY event_starttime LIMIT 20;", r.StartTime, r.EndTime)
	return GetEventsByQuery(query)
	//fmt.Printf(query)
	//resultJson, err := utils.GetJSON(db, query)
	//if err != nil {
	//	fmt.Println("error %e", err)
	//}
	//return resultJson;
}

func GetEventsByTimeFilter(r models.TemporalRequest) (string) {
	query := fmt.Sprintf(utils.QUERY_TEMPORAL, r.TableName, r.QueryType, r.StartTime, r.EndTime)
	resultJson, err := utils.GetAsString(db, query)
	if err != nil {
		fmt.Println("error %e", err)
	}
	return resultJson
}

func EventTemporalSearch(r models.TemporalRequest) (utils.JSONString) {
	query := fmt.Sprintf(utils.QUERY_TEMPORAL, r.TableName, r.QueryType, r.StartTime, r.EndTime)
	resultJson, err := utils.GetJSON(db, query)
	if err != nil {
		fmt.Println("error %e", err)
	}
	return resultJson
}

func GetClosestImage(r models.ImageRequest) (models.ImageUrl) {
	query := fmt.Sprintf(utils.QUERY_IMAGE_URL, r.Wavelength, r.Size, r.ImageDate, r.ImageDate)
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
	imageUrl[0].URL = utils.IMAGE_URL_BASE + imageUrl[0].URL
	return imageUrl[0]
}
