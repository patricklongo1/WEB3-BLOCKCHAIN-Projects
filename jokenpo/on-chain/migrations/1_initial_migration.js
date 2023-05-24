const JoKenPo = artifacts.require("JoKenPo");
const JKPAdapter = artifacts.require("JKPAdapter");
const JKPLibrary = artifacts.require("JKPLibrary");

module.exports = function (deployer) {
  deployer.deploy(JoKenPo);
  deployer.deploy(JKPAdapter);
  deployer.deploy(JKPLibrary);
};
