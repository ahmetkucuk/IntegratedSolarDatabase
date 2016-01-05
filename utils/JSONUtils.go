package utils


type JSONString string

func (j JSONString) MarshalJSON() ([]byte, error) {
	return []byte(j), nil
}
