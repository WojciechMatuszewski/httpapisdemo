package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/pkg/errors"
	"github.com/rs/zerolog"
)

// Handler is the lambda handler
type Handler func(ctx context.Context, event events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error)

// URLGetter is responsible for generating presigned url
type URLGetter interface {
	GetUploadPresignedURL(userID, fileName string, exp time.Duration) (string, error)
}

// Response represents data returned by lambda
type Response struct {
	URL string `json:"url"`
}

// NewHandler returns Handler
func NewHandler(urlGetter URLGetter) Handler {
	logger := zerolog.New(os.Stdout).With().Logger()
	return func(ctx context.Context, event events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error) {

		logger.Info().Fields(map[string]interface{}{"headers": event.Headers}).Msg("headers")
		logger.Info().Fields(map[string]interface{}{"authorizer": event.RequestContext.Authorizer}).Msg("foo")

		userID := event.RequestContext.AccountID
		fmt.Println("userID", userID)
		fileName, found := event.QueryStringParameters["fileName"]
		if !found {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusBadRequest,
				Body:       "fileName parameter not found",
			}, nil
		}

		signedURL, err := urlGetter.GetUploadPresignedURL(userID, fileName, 10*time.Minute)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Body:       http.StatusText(http.StatusInternalServerError),
			}, errors.Wrap(err, "while generating presinged URL")
		}

		resp := Response{URL: signedURL}
		respB, err := json.Marshal(&resp)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Body:       http.StatusText(http.StatusInternalServerError),
			}, errors.Wrap(err, "while marshaling response")
		}

		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusOK,
			Body:       string(respB),
		}, nil

	}
}
