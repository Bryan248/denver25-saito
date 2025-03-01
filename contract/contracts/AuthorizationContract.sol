 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

contract AuthorizationContract is EIP712 {

    // Mapping from resourceId (bytes32) to the owner address
    mapping(bytes32 => address) public resourceOwners;
    // Mapping from resourceId (bytes32) to approved requesters
    mapping(bytes32 => mapping(address => bool)) public resourceApprovals;
    // Mapping from resourceId (bytes32) to requesters
    mapping(bytes32 => mapping(address => bool)) public resourceRequests;

    // EIP712 Domain Separator Name
    string private constant SIGNING_DOMAIN = "AuthorizationContract";
    string private constant SIGNATURE_VERSION = "1";

    // Events to log access requests and approvals
    event AccessRequested(bytes32 indexed resourceId, address indexed requester);
    event AccessApproved(bytes32 indexed resourceId, address indexed requester, address indexed approver);

    constructor() EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {}

    // Function to create a new resource and set its owner
    function createResource(bytes32 resourceId, address owner) external {
        require(resourceOwners[resourceId] == address(0), "Resource already exists");
        resourceOwners[resourceId] = owner;
    }

    // Function for anyone to request access to a resource
    function requestAccess(bytes32 resourceId) external {
        require(resourceOwners[resourceId] != address(0), "Resource does not exist");
        resourceRequests[resourceId][msg.sender] = true;

        // Emit AccessRequested event
        emit AccessRequested(resourceId, msg.sender);
    }

    // Function to approve access to a requester for a specific resourceId
    function approveAccess(
        bytes32 resourceId,
        address requester,
        bytes calldata signature
    ) external {
        // Hash the data that will be signed
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("AccessApproval(address requester,bytes32 resourceId)"),
                requester,
                resourceId
            )
        );

        // Hash the EIP-712 domain and the struct hash
        bytes32 digest = _hashTypedDataV4(structHash);

        // Verify that the signature is valid
        require(SignatureChecker.isValidSignatureNow(resourceOwners[resourceId], digest, signature), "Invalid signature");

        // Approve access for the requester
        resourceApprovals[resourceId][requester] = true;

        // Emit AccessApproved event
        emit AccessApproved(resourceId, requester, msg.sender);
    }

    // Function to check if a requester is authorized for a specific resourceId
    function isAuthorized(bytes32 resourceId, address requester) external view returns (bool) {
        return resourceApprovals[resourceId][requester];
    }

    // Function to check if a requester has requested access for a specific resourceId
    function hasRequestedAccess(bytes32 resourceId, address requester) external view returns (bool) {
        return resourceRequests[resourceId][requester];
    }
}
