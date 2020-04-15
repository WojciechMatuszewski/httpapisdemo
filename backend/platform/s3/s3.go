package s3

import (
	"errors"
	"fmt"
	"mime"
	"path/filepath"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3iface"
)

// Service represents S3 service
type Service struct {
	api    s3iface.S3API
	bucket string
}

// NewService returns S3 service
func NewService(api s3iface.S3API, bucket string) Service {
	return Service{
		api:    api,
		bucket: bucket,
	}
}

// GetUploadPresignedURL returns pre-signed URL for upload action scoped to given users bucket.
func (s Service) GetUploadPresignedURL(userID, fileName string, exp time.Duration) (string, error) {
	ct := mime.TypeByExtension(filepath.Ext(fileName))
	if !strings.HasPrefix(ct, "image/") {
		return "", errors.New("unknown content type")
	}

	fmt.Println("content type is", ct)

	req, _ := s.api.PutObjectRequest(&s3.PutObjectInput{
		//Bucket: aws.String(s.bucket),
		Bucket:      aws.String(fmt.Sprintf("%v/%v", s.bucket, userID)),
		Key:         aws.String(fileName),
		ContentType: aws.String(ct),
	})

	return req.Presign(exp)
}
