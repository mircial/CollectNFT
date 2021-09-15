var CollectNFT = artifacts.require("CollectNFT");
var manager = '0x256807C23d5085ad22CC124c00852eE60989fC3E';

module.exports = async function(deployer) {
    await deployer.deploy(CollectNFT, manager);
};
