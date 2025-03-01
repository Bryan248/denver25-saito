// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AuthorizationContractModule = buildModule("AuthorizationContractModule", (m) => {
  const authorizationContract = m.contract("AuthorizationContract", []);
  return { authorizationContract };
});

export default AuthorizationContractModule;
