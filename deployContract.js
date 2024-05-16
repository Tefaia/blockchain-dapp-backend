const path = require('path');
const fs = require('fs/promises');
const { ethers } = require('hardhat');
const { BigNumber } = require('ethers');

async function loadContractArtifacts() {
    try {
        const erc20ArtifactPath = path.resolve(__dirname, '../artifacts/contracts/MyToken.sol/MyToken.json');
        const faucetArtifactPath = path.resolve(__dirname, '../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json');

        const erc20Artifact = require(erc20ArtifactPath);
        const faucetArtifact = require(faucetArtifactPath);

        const [deployer] = await ethers.getSigners();

        const ERC20 = new ethers.ContractFactory(
            erc20Artifact.abi,
            erc20Artifact.bytecode,
            deployer
        );

        const ERC20Faucet = new ethers.ContractFactory(
            faucetArtifact.abi,
            faucetArtifact.bytecode,
            deployer
        );

        return { ERC20, ERC20Faucet };
    } catch (error) {
        throw new Error(`Error loading contract artifacts: ${error.message}`);
    }
}

async function writeContractAddressToFile(contractName, address) {
    const filePath = path.resolve(__dirname, `${contractName}Address.json`);
    const data = JSON.stringify({ address });
    await fs.writeFile(filePath, data);
}

async function getContractBalanceInETH(contract) {
    try {
        const provider = ethers.getDefaultProvider();
        const weiBalance = await contract.balanceOf(contract.address);
        const ethBalance = ethers.utils.formatUnits(weiBalance, 'ether');
        console.log(`Balance of deployed contract: ${ethBalance} ETH`);
    } catch (error) {
        console.error("Error getting contract balance:", error);
        throw new Error(`Error getting contract balance: ${error.message}`);
    }
}



async function deployAndInteract() {
    try {
        const { ERC20, ERC20Faucet } = await loadContractArtifacts();
        const [deployer] = await ethers.getSigners();
        const initialSupply = BigNumber.from('10').pow(50);

        // Deploy ERC20 Token Contract
        const erc20Token = await ERC20.deploy(initialSupply);
        await erc20Token.deployed();
        await writeContractAddressToFile('ERC20', erc20Token.address);
        console.log("ERC20 Token Contract deployed and address stored in file.");

        // Display ERC20 Token Balance (already in ETH using formatEther)
        const tokenBalance = await erc20Token.balanceOf(deployer.address);
        console.log(`Deployer's ERC20 Token Balance: ${ethers.utils.formatEther(tokenBalance)} ETH`);

        // Deploy ERC20Faucet Contract
        const faucet = await ERC20Faucet.deploy(erc20Token.address); // Pass the deployer's address as the owner
        await faucet.deployed();
        await writeContractAddressToFile('ERC20Faucet', faucet.address);
        console.log("ERC20Faucet Contract deployed and address stored in file.");

        // Transfer all tokens to ERC20Faucet
        await erc20Token.transfer(faucet.address, initialSupply);
        console.log(`Transferred ${ethers.utils.formatEther(initialSupply)} tokens to ERC20Faucet`);

        // Display ERC20Faucet Balance (converted to ETH using new function)
        await getContractBalanceInETH(faucet);

        console.log("All contracts deployed, addresses stored in files, and tokens transferred to ERC20Faucet.");

        // Log the address of the deployed faucet contract
        console.log("Deployed ERC20Faucet Contract Address:", faucet.address);

        // Use the new function to get balance in ETH
        await getContractBalanceInETH(faucet);
    } catch (error) {
        throw new Error(`Error deploying and interacting with contracts: ${error.message}`);
    }
}


deployAndInteract()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });



    