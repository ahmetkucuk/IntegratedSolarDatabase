package utils
import (
	"database/sql"
	"encoding/json"
//	"fmt"
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

