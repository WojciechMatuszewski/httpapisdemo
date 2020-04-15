package main

import (
	"context"
	"errors"
	"net/http"
	"testing"

	"backend/functions/upload-url/mock"
	"github.com/aws/aws-lambda-go/events"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
)

func TestNewHandler(t *testing.T) {
	ctx := context.Background()

	t.Run("no fileName within query params", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		defer ctrl.Finish()

		urlGetter := mock.NewMockURLGetter(ctrl)
		handler := NewHandler(urlGetter)
		in := events.APIGatewayV2HTTPRequest{
			QueryStringParameters: map[string]string{"foo": "bar"},
		}

		res, err := handler(ctx, in)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusBadRequest, res.StatusCode)
	})

	t.Run("error while generating presigned URL", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		defer ctrl.Finish()

		urlGetter := mock.NewMockURLGetter(ctrl)
		handler := NewHandler(urlGetter)
		in := events.APIGatewayV2HTTPRequest{
			QueryStringParameters: map[string]string{"fileName": "tata.jpg"},
			RequestContext: events.APIGatewayV2HTTPRequestContext{
				AccountID: "123",
			},
		}

		urlGetter.EXPECT().
			GetUploadPresignedURL("123", "tata.jpg", gomock.Any()).
			Return("", errors.New("boom"))

		res, err := handler(ctx, in)
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, res.StatusCode)
	})

	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		defer ctrl.Finish()

		urlGetter := mock.NewMockURLGetter(ctrl)
		handler := NewHandler(urlGetter)
		in := events.APIGatewayV2HTTPRequest{
			QueryStringParameters: map[string]string{"fileName": "tata.jpg"},
			RequestContext: events.APIGatewayV2HTTPRequestContext{
				AccountID: "123",
			},
		}

		urlGetter.EXPECT().
			GetUploadPresignedURL("123", "tata.jpg", gomock.Any()).
			Return("http://foo.com", nil)

		res, err := handler(ctx, in)
		assert.NoError(t, err)
		assert.Equal(t, res.Body, "http://foo.com")
		assert.Equal(t, http.StatusOK, res.StatusCode)
	})
}
