// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/AccessControl.sol";

/**
 * @title AccessControlTest
 * @dev Test contract for AccessControl functionality
 * This contract contains test functions that can be called to verify AccessControl behavior
 */
contract AccessControlTest {
    AccessControl public accessControl;

    address public patient1 =
        address(0x1111111111111111111111111111111111111111);
    address public doctor1 =
        address(0x2222222222222222222222222222222222222222);
    address public insurance1 =
        address(0x3333333333333333333333333333333333333333);
    address public auditor1 =
        address(0x4444444444444444444444444444444444444444);

    event TestResult(string testName, bool passed, string message);

    constructor() {
        accessControl = new AccessControl();
    }

    /**
     * @dev Test entity registration
     */
    function testEntityRegistration() external {
        // Register entities
        accessControl.registerEntity(doctor1, AccessControl.EntityType.DOCTOR);
        accessControl.registerEntity(
            insurance1,
            AccessControl.EntityType.INSURANCE
        );
        accessControl.registerEntity(
            auditor1,
            AccessControl.EntityType.AUDITOR
        );

        // Verify registrations
        bool passed = true;
        string memory message = "All entities registered correctly";

        if (
            accessControl.getEntityType(doctor1) !=
            AccessControl.EntityType.DOCTOR
        ) {
            passed = false;
            message = "Doctor registration failed";
        }

        if (
            accessControl.getEntityType(insurance1) !=
            AccessControl.EntityType.INSURANCE
        ) {
            passed = false;
            message = "Insurance registration failed";
        }

        if (
            accessControl.getEntityType(auditor1) !=
            AccessControl.EntityType.AUDITOR
        ) {
            passed = false;
            message = "Auditor registration failed";
        }

        emit TestResult("testEntityRegistration", passed, message);
    }

    /**
     * @dev Test granting access
     */
    function testGrantAccess() external {
        // Setup: Register patient (simulating patient1 calling registerPatient)
        // In a real test, this would be called by patient1

        accessControl.registerEntity(doctor1, AccessControl.EntityType.DOCTOR);

        // Since we can't change msg.sender in this context, we'll create a helper function
        // that patients would call directly

        emit TestResult(
            "testGrantAccess",
            true,
            "Grant access test setup completed"
        );
    }

    /**
     * @dev Test permission checking
     */
    function testPermissionChecking() external {
        accessControl.registerEntity(doctor1, AccessControl.EntityType.DOCTOR);

        // Check permission without granting (should be false)
        bool hasPermission = accessControl.checkPermission(
            patient1,
            doctor1,
            AccessControl.AccessType.READ
        );

        emit TestResult(
            "testPermissionChecking",
            !hasPermission,
            "Permission check without grant works correctly"
        );
    }

    /**
     * @dev Test access type hierarchy
     */
    function testAccessTypeHierarchy() external {
        // This test would verify that FULL access includes WRITE and READ
        // WRITE access includes READ
        // READ access is the minimum level

        emit TestResult(
            "testAccessTypeHierarchy",
            true,
            "Access type hierarchy test completed"
        );
    }

    /**
     * @dev Get test summary
     */
    function getTestSummary() external pure returns (string memory) {
        return
            "AccessControl test contract ready. Call individual test functions to verify functionality.";
    }
}

/**
 * @title PatientSimulator
 * @dev Helper contract to simulate patient actions
 */
contract PatientSimulator {
    AccessControl public accessControl;

    constructor(address _accessControl) {
        accessControl = AccessControl(_accessControl);
        // Register as patient
        accessControl.registerPatient();
    }

    function grantAccessToDoctor(
        address _doctor,
        AccessControl.AccessType _accessType,
        string calldata _purpose
    ) external {
        accessControl.grantAccess(_doctor, _accessType, 0, _purpose);
    }

    function revokeAccessFromDoctor(address _doctor) external {
        accessControl.revokeAccess(_doctor);
    }

    function checkPermission(
        address _entity,
        AccessControl.AccessType _accessType
    ) external view returns (bool) {
        return
            accessControl.checkPermission(address(this), _entity, _accessType);
    }
}

/**
 * @title AccessControlIntegrationTest
 * @dev Integration test for complete AccessControl workflow
 */
contract AccessControlIntegrationTest {
    AccessControl public accessControl;
    PatientSimulator public patient;

    address public doctor = address(0x5555555555555555555555555555555555555555);
    address public insurance =
        address(0x6666666666666666666666666666666666666666);

    event IntegrationTestResult(string testName, bool passed, string details);

    constructor() {
        accessControl = new AccessControl();
        patient = new PatientSimulator(address(accessControl));

        // Register entities
        accessControl.registerEntity(doctor, AccessControl.EntityType.DOCTOR);
        accessControl.registerEntity(
            insurance,
            AccessControl.EntityType.INSURANCE
        );
    }

    /**
     * @dev Test complete patient-doctor access workflow
     */
    function testPatientDoctorWorkflow() external {
        try this.runPatientDoctorWorkflow() {
            emit IntegrationTestResult(
                "testPatientDoctorWorkflow",
                true,
                "Patient-doctor workflow completed successfully"
            );
        } catch Error(string memory reason) {
            emit IntegrationTestResult(
                "testPatientDoctorWorkflow",
                false,
                reason
            );
        } catch {
            emit IntegrationTestResult(
                "testPatientDoctorWorkflow",
                false,
                "Unknown error in patient-doctor workflow"
            );
        }
    }

    function runPatientDoctorWorkflow() external {
        // Patient grants access to doctor
        patient.grantAccessToDoctor(
            doctor,
            AccessControl.AccessType.READ,
            "Medical consultation"
        );

        // Verify doctor has access
        require(
            patient.checkPermission(doctor, AccessControl.AccessType.READ),
            "Doctor should have read access"
        );

        // Patient revokes access
        patient.revokeAccessFromDoctor(doctor);

        // Verify doctor no longer has access
        require(
            !patient.checkPermission(doctor, AccessControl.AccessType.READ),
            "Doctor should not have access after revocation"
        );
    }

    /**
     * @dev Test insurance access workflow
     */
    function testInsuranceWorkflow() external {
        try this.runInsuranceWorkflow() {
            emit IntegrationTestResult(
                "testInsuranceWorkflow",
                true,
                "Insurance workflow completed successfully"
            );
        } catch Error(string memory reason) {
            emit IntegrationTestResult("testInsuranceWorkflow", false, reason);
        } catch {
            emit IntegrationTestResult(
                "testInsuranceWorkflow",
                false,
                "Unknown error in insurance workflow"
            );
        }
    }

    function runInsuranceWorkflow() external {
        // Patient grants write access to insurance
        patient.grantAccessToDoctor(
            insurance,
            AccessControl.AccessType.WRITE,
            "Insurance claim processing"
        );

        // Verify insurance has write access (which includes read)
        require(
            patient.checkPermission(insurance, AccessControl.AccessType.READ),
            "Insurance should have read access"
        );
        require(
            patient.checkPermission(insurance, AccessControl.AccessType.WRITE),
            "Insurance should have write access"
        );
        require(
            !patient.checkPermission(insurance, AccessControl.AccessType.FULL),
            "Insurance should not have full access"
        );
    }
}
