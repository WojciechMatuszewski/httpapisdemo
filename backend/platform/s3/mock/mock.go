//go:generate mockgen -package=mock -destination=./s3.go github.com/aws/aws-sdk-go/service/s3/s3iface S3API
//go:generate mockgen -package=mock -destination=./request.go -source=../requestiface.go

package mock
