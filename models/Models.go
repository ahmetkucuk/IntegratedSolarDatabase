package models
import "time"


type Hello struct {
	Name string
	Msg  string
	Age  int
}

type Event struct {
	Id string
	StartTime  time.Time
	HpcBBox  string
}

func NewEvents() (events []*Event) {
	return events
}
