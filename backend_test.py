#!/usr/bin/env python3
"""
SentinelX Defender Backend API Test Suite
Tests all API endpoints and authentication flows
"""

import requests
import sys
import json
from datetime import datetime
from urllib.parse import urljoin

class SentinelXTester:
    def __init__(self, base_url="https://malware-vault.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = urljoin(base_url, "/api")
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_result(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} | {name}")
        if details:
            print(f"     Details: {details}")
        if success:
            self.tests_passed += 1
        else:
            self.failed_tests.append({"name": name, "details": details})

    def make_request(self, method, endpoint, data=None, expected_status=200, auth_required=False):
        """Make HTTP request with proper error handling"""
        url = urljoin(self.api_base, endpoint)
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            else:
                return False, f"Unsupported method: {method}", {}

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}
                
            details = f"Status: {response.status_code}"
            if not success:
                details += f" (expected {expected_status})"
                if response_data:
                    details += f" | Response: {json.dumps(response_data)[:200]}"
            
            return success, details, response_data
            
        except requests.exceptions.Timeout:
            return False, "Request timeout (>10s)", {}
        except requests.exceptions.ConnectionError:
            return False, "Connection error - server may be down", {}
        except Exception as e:
            return False, f"Request error: {str(e)}", {}

    def test_health_endpoint(self):
        """Test /api/health endpoint"""
        print("\n🔍 Testing Health Check Endpoint")
        success, details, data = self.make_request('GET', '/health')
        self.log_result("Health Check", success, details)
        
        if success and data:
            # Verify expected fields in health response
            expected_fields = ['status', 'yara_engine', 'gbm_model', 'llm_layer', 'timestamp']
            has_all_fields = all(field in data for field in expected_fields)
            self.log_result("Health Response Fields", has_all_fields, 
                          f"Fields present: {list(data.keys())}")
        return success

    def test_stats_endpoint(self):
        """Test /api/stats endpoint"""
        print("\n📊 Testing Stats Endpoint")
        success, details, data = self.make_request('GET', '/stats')
        self.log_result("Get Stats", success, details)
        
        if success and data:
            # Verify stats structure
            expected_fields = ['total_analyzed', 'accuracy', 'false_negative_rate', 'malware_families']
            has_all_fields = all(field in data for field in expected_fields)
            self.log_result("Stats Response Structure", has_all_fields,
                          f"Fields present: {list(data.keys())}")
        return success

    def test_admin_login(self):
        """Test admin authentication"""
        print("\n🔐 Testing Admin Authentication")
        
        # Test with correct credentials
        login_data = {
            "email": "admin@sentinelx.io",
            "password": "sentinel2024"
        }
        
        success, details, data = self.make_request('POST', '/admin/login', login_data)
        self.log_result("Admin Login (Valid Credentials)", success, details)
        
        if success and data and 'token' in data:
            self.token = data['token']
            self.log_result("Token Received", True, f"Token length: {len(self.token)}")
            
            # Verify token with /admin/verify
            verify_success, verify_details, verify_data = self.make_request(
                'GET', '/admin/verify', auth_required=True
            )
            self.log_result("Token Verification", verify_success, verify_details)
        else:
            self.token = None
            
        # Test with invalid credentials
        invalid_login = {
            "email": "wrong@example.com", 
            "password": "wrongpass"
        }
        fail_success, fail_details, _ = self.make_request(
            'POST', '/admin/login', invalid_login, expected_status=401
        )
        self.log_result("Admin Login (Invalid Credentials)", fail_success, fail_details)
        
        return success and self.token is not None

    def test_scanner_endpoint(self):
        """Test /api/analyze/features endpoint"""
        print("\n🔍 Testing Scanner Analysis Endpoint")
        
        # Test with sample malicious features
        malicious_features = {
            "file_entropy": 7.5,
            "num_sections": 6,
            "num_imports": 80,
            "num_strings": 300,
            "section_entropy_avg": 6.5,
            "overlay_ratio": 0.3,
            "resource_entropy": 7.0,
            "file_size_kb": 1200,
            "import_entropy": 6.0,
            "has_packing_artifacts": True,
            "pe_timestamp_anomaly": True,
            "has_debug_info": False,
            "num_exports": 5,
            "has_upx_signature": True,
            "suspicious_import_count": 15,
            "suspicious_string_count": 25,
            "anti_debug_calls": 3,
            "network_indicators": 5,
            "registry_indicators": 4,
            "high_entropy_sections": 3
        }
        
        success, details, data = self.make_request('POST', '/analyze/features', malicious_features)
        self.log_result("Analyze Malicious Features", success, details)
        
        if success and data:
            # Verify response structure
            expected_fields = ['scan_id', 'threat_level', 'confidence_score', 'detection_path']
            has_fields = all(field in data for field in expected_fields)
            self.log_result("Analysis Response Structure", has_fields,
                          f"Threat Level: {data.get('threat_level', 'N/A')}")
            
            # Test with benign features
            benign_features = {
                "file_entropy": 4.0,
                "num_sections": 4,
                "num_imports": 20,
                "num_strings": 100,
                "section_entropy_avg": 3.5,
                "overlay_ratio": 0.0,
                "resource_entropy": 3.0,
                "file_size_kb": 200,
                "import_entropy": 3.5,
                "has_packing_artifacts": False,
                "pe_timestamp_anomaly": False,
                "has_debug_info": True,
                "num_exports": 0,
                "has_upx_signature": False,
                "suspicious_import_count": 0,
                "suspicious_string_count": 2,
                "anti_debug_calls": 0,
                "network_indicators": 0,
                "registry_indicators": 0,
                "high_entropy_sections": 0
            }
            
            benign_success, benign_details, benign_data = self.make_request(
                'POST', '/analyze/features', benign_features
            )
            self.log_result("Analyze Benign Features", benign_success,
                          f"Threat Level: {benign_data.get('threat_level', 'N/A')}")
        
        return success

    def test_protected_endpoints(self):
        """Test admin-protected endpoints"""
        print("\n🔒 Testing Protected Admin Endpoints")
        
        if not self.token:
            self.log_result("Protected Endpoints Test", False, "No auth token available")
            return False
        
        # Test benchmark results
        benchmark_success, benchmark_details, benchmark_data = self.make_request(
            'GET', '/benchmark/results', auth_required=True
        )
        self.log_result("Benchmark Results", benchmark_success, benchmark_details)
        
        # Test dataset info
        dataset_success, dataset_details, dataset_data = self.make_request(
            'GET', '/dataset/info', auth_required=True
        )
        self.log_result("Dataset Info", dataset_success, dataset_details)
        
        # Test model info
        model_success, model_details, model_data = self.make_request(
            'GET', '/model/info', auth_required=True
        )
        self.log_result("Model Info", model_success, model_details)
        
        # Test dataset samples
        samples_success, samples_details, samples_data = self.make_request(
            'GET', '/dataset/samples?page=1&per_page=5', auth_required=True
        )
        self.log_result("Dataset Samples", samples_success, samples_details)
        
        # Test model explanation  
        explain_success, explain_details, explain_data = self.make_request(
            'GET', '/model/explain', auth_required=True
        )
        self.log_result("Model Explanation", explain_success, explain_details)
        
        return all([benchmark_success, dataset_success, model_success, samples_success, explain_success])

    def test_recent_scans(self):
        """Test recent scans endpoint"""
        print("\n📋 Testing Recent Scans Endpoint")
        success, details, data = self.make_request('GET', '/scans/recent?limit=5')
        self.log_result("Recent Scans", success, details)
        return success

    def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 SentinelX Defender Backend API Test Suite")
        print("=" * 60)
        print(f"Testing against: {self.base_url}")
        print(f"API Base URL: {self.api_base}")
        
        # Core functionality tests
        health_ok = self.test_health_endpoint()
        stats_ok = self.test_stats_endpoint()
        
        # Authentication tests
        auth_ok = self.test_admin_login()
        
        # Scanner functionality
        scanner_ok = self.test_scanner_endpoint()
        
        # Protected endpoints (requires auth)
        protected_ok = self.test_protected_endpoints() if auth_ok else False
        
        # Additional endpoints
        scans_ok = self.test_recent_scans()
        
        # Final results
        print("\n" + "=" * 60)
        print("🎯 TEST SUMMARY")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  • {test['name']}: {test['details']}")
        
        # Overall assessment
        critical_tests = [health_ok, auth_ok, scanner_ok]
        all_critical_pass = all(critical_tests)
        
        if all_critical_pass:
            print(f"\n✅ BACKEND STATUS: OPERATIONAL")
            print("All critical endpoints working correctly")
            return 0
        else:
            print(f"\n❌ BACKEND STATUS: ISSUES DETECTED")
            print("Critical endpoints have failures - needs attention")
            return 1

if __name__ == "__main__":
    tester = SentinelXTester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)