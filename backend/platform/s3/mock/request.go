// Code generated by MockGen. DO NOT EDIT.
// Source: ../requestiface.go

// Package mock is a generated GoMock package.
package mock

import (
	gomock "github.com/golang/mock/gomock"
	reflect "reflect"
	time "time"
)

// MockRequest is a mock of Request interface
type MockRequest struct {
	ctrl     *gomock.Controller
	recorder *MockRequestMockRecorder
}

// MockRequestMockRecorder is the mock recorder for MockRequest
type MockRequestMockRecorder struct {
	mock *MockRequest
}

// NewMockRequest creates a new mock instance
func NewMockRequest(ctrl *gomock.Controller) *MockRequest {
	mock := &MockRequest{ctrl: ctrl}
	mock.recorder = &MockRequestMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use
func (m *MockRequest) EXPECT() *MockRequestMockRecorder {
	return m.recorder
}

// Presign mocks base method
func (m *MockRequest) Presign(expire time.Duration) (string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Presign", expire)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Presign indicates an expected call of Presign
func (mr *MockRequestMockRecorder) Presign(expire interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Presign", reflect.TypeOf((*MockRequest)(nil).Presign), expire)
}
