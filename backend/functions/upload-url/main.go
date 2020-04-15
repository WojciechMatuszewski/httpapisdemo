package main

import (
	"backend/internal/env"
	"backend/platform/s3"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"

	awss3 "github.com/aws/aws-sdk-go/service/s3"
)

func main() {
	sess := session.Must(session.NewSession())
	s3API := awss3.New(sess)
	s3Service := s3.NewService(s3API, env.Get(env.BUCKET_NAME))

	handler := NewHandler(s3Service)
	lambda.Start(handler)
}
