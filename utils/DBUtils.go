package utils
import (
	"database/sql"
	"encoding/json"
	"bytes"
	"strings"
	"fmt"
)


func GetJSON(db *sql.DB, sqlString string) (JSONString, error) {
	jsonData, err := GetResultInBytes(db, sqlString)
	if err != nil {
		return "", err
	}
	return JSONString(jsonData), nil
}

func GetAsString(db *sql.DB, sqlString string) (string, error) {
	jsonData, err := GetResultInBytes(db, sqlString)
	if err != nil {
		return "", err
	}
	return string(jsonData), nil
}


func GetResultInBytes(db *sql.DB, sqlString string) ([]byte, error) {
	rows, err := db.Query(sqlString)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	count := len(columns)
	tableData := make([]map[string]interface{}, 0)
	values := make([]interface{}, count)
	valuePtrs := make([]interface{}, count)
	for rows.Next() {
		for i := 0; i < count; i++ {
			valuePtrs[i] = &values[i]
		}
		rows.Scan(valuePtrs...)
		entry := make(map[string]interface{})
		for i, col := range columns {
			var v interface{}
			val := values[i]
			b, ok := val.([]byte)
			if ok {
				v = string(b)
			} else {
				v = val
			}
			entry[col] = v
		}
		tableData = append(tableData, entry)
	}
	jsonData, err := json.Marshal(tableData)
	if err != nil {
		return nil, err
	}
	return jsonData, nil
}


func CreateTableNameString(tnames []string) string {

	if (len(tnames) == 0) || (tnames[0] == "") || (tnames[0] == "all") {
		return ALL_TABLES_ARRAY
	}
	var buffer bytes.Buffer
	buffer.WriteString("ARRAY['")
	buffer.WriteString(strings.Join(tnames, "','"))
	buffer.WriteString("']::TEXT[]")
	return buffer.String()
}

func CreateAggragateAllEventsByMonthQuery(tnames []string, startTime string, endTime string, isArea bool) string {

	var buffer bytes.Buffer
	if isArea {
		buffer.WriteString("select mon as month, yyyy as year, mm month_id, Sum(ST_Area(cc)) as area_of_events FROM (")
	} else {
		buffer.WriteString("select mon as month, yyyy as year, mm month_id, Count(*) as number_of_events FROM (")
	}
	for i, v := range tnames {
		buffer.WriteString("(")
		if isArea {
			buffer.WriteString(fmt.Sprintf(AREASUM_EVENT_BY_MONTH_BASE,  v, startTime, endTime))
		} else {
			buffer.WriteString(fmt.Sprintf(COUNT_EVENT_BY_MONTH_BASE,  v, startTime, endTime))
		}
		buffer.WriteString(")")
		if i != len(tnames) - 1 {
			buffer.WriteString(" UNION ALL ")
		}
	}

	buffer.WriteString(") t group by 1,2,3 Order by 2,3")
	fmt.Println(buffer.String())
	return buffer.String()
}
