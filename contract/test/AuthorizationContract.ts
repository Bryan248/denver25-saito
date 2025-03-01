import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("AuthorizationContract", function () {
  const resourceName = "my-awesome-resource";
  const resourceId = ethers.hashMessage(resourceName); // Generate bytes32 resourceId using v6

  async function deployAuthorizationContractFixture() {

    const [owner, requester, approver]  = await hre.ethers.getSigners();

    const AuthorizationContract = await hre.ethers.getContractFactory("AuthorizationContract");
    const authorizationContract = await AuthorizationContract.deploy();
    await authorizationContract.createResource(resourceId, owner.address);

    return { authorizationContract, owner, requester, approver };
  }

  it("should approve access for a requester with valid signature", async function () {
    const { authorizationContract, owner, requester, approver } = await loadFixture(deployAuthorizationContractFixture);
    await authorizationContract.connect(requester).requestAccess(resourceId);
    const contractAddress = await authorizationContract.getAddress();

    // Ensure the contract is deployed and address is set
    console.log("Contract address:", contractAddress); // Check contract address here

    // Get the chain ID from the provider associated with the owner
    const network = await owner.provider.getNetwork();
    const domain = {
      name: "AuthorizationContract",
      version: "1",
      chainId: network.chainId,  // Use the chainId from the provider
      verifyingContract: contractAddress,
    };

    // Sign the typed data with owner's private key
    const signature = await owner.signTypedData(domain, {
      AccessApproval: [
        { name: "requester", type: "address" },
        { name: "resourceId", type: "bytes32" },
      ],
    }, { requester: requester.address, resourceId });

    // Approve access for the requester
    await expect(authorizationContract.connect(approver).approveAccess(resourceId, requester.address, signature))
      .to.emit(authorizationContract, "AccessApproved")
      .withArgs(resourceId, requester.address, approver.address);

    // Check if the requester is authorized
    expect(await authorizationContract.isAuthorized(resourceId, requester.address)).to.be.true;
  });

  it("should reject invalid signatures", async function () {
    const { authorizationContract, owner, requester, approver } = await loadFixture(deployAuthorizationContractFixture);
    await authorizationContract.connect(requester).requestAccess(resourceId);
    const contractAddress = await authorizationContract.getAddress();

    // Provide an invalid signature (this will fail)
    const invalidSignature = "0x00"; // Clearly invalid signature

    // Try to approve access with an invalid signature
    await expect(
      authorizationContract.connect(approver).approveAccess(resourceId, requester.address, invalidSignature)
    ).to.be.revertedWith("Invalid signature");
  });
});
