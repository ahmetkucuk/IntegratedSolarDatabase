package models

import (
	"errors"
	"time"
)

type TimeTuple struct {
	s time.Time
	e time.Time
}

type dateRule struct {
	message  string
}


// Error sets the error message for the rule.
func (v *dateRule) Error(message string) *dateRule {
	return &dateRule{message: message,}
}

// Validate checks if the given value is valid or not.
func (v *dateRule) Validate(value interface{}) error {
	tuple := value.(TimeTuple)
	if tuple.s.After(tuple.e) {
		return errors.New(v.message)
	}
	return nil
}