package env

import (
	"fmt"
	"os"
)

func Get(key string) string {
	v, found := os.LookupEnv(key)
	if !found {
		panic(fmt.Sprintf("environment variable of key: %v not found", key))
	}

	return v
}
