var CollectNFT = artifacts.require("CollectNFT");
var manager = '0x81309D4628ADAd5119455983055a89be573BF53D';

module.exports = async function(deployer) {
    await deployer.deploy(CollectNFT, manager);
};
