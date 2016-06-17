package models

type TemporalQueryType int
type SpatialQueryType int

const (
	T_Equals TemporalQueryType = 1 + iota
	T_LessThan
	T_GreaterThan
	T_Contains
	T_ContainedBy
	T_Overlaps
	T_Precedes
	T_PrecededBy
)



var temporalQTypes = [...]string {
	"Equals",
	"LessThan",
	"GreaterThan",
	"Contains",
	"ContainedBy",
	"Overlaps",
	"Precedes",
	"PrecededBy",
}

const (
	S_Intersects SpatialQueryType = 1 + iota
	S_Disjoint
	S_Within
	S_CoveredBy
	S_Covers
	S_Overlaps
	S_Contains
	S_Equals
	S_Touches
)

var spatialQTypes = [...]string {
	"Intersects",
	"Disjoint",
	"Within",
	"CoveredBy",
	"Covers",
	"Overlaps",
	"Contains",
	"Equals",
	"Touches",
}


func Tvalue(q TemporalQueryType) string {
	return temporalQTypes[q - 1]
}

func Svalue(q SpatialQueryType) string {
	return spatialQTypes[q - 1]
}