package models

import (
	"errors"
	"time"
)

type TimeRange struct {
	start time.Time
	end time.Time
}

type dateRule struct {
	message  string
	timeRange TimeRange
}


// Error sets the error message for the rule.
func (v *dateRule) Error(message string) *dateRule {
	return &dateRule{
		message: message,
		timeRange: v.timeRange,
	}
}

// Validate checks if the given value is valid or not.
func (v *dateRule) Validate(value interface{}) error {
	timeRange := v.timeRange
	if timeRange.start.After(timeRange.end) {
		return errors.New(v.message)
	}
	return nil
}