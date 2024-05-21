Blockchain Network Marketplace, here's the functionality:


Faucet

• Purpose: Peer fund connection via MetaMask.

• Use Case: Allows new users to obtain initial funds to start interacting with the blockchain.

• Mechanism: Users must complete a predefined interaction within the marketplace, such as signing up, connecting to the marketplace network as a peer, and making an initial transaction to purchase an item. The 
  marketplace then receives the amount of cryptocurrency.


Miner

• Purpose: Validates transactions and adds them to the blockchain.

• Use Case: Ensures the integrity and security of the blockchain by validating transactions and creating new blocks.

• Reward: Miners receive cryptocurrency rewards (block rewards) for their efforts to create a new block using proof of work algorithm.


Wallet

• Purpose: Stores and manages users' cryptocurrency funds.

• Use Case: Enables users to send, receive, and monitor their cryptocurrency balances.


Blocks

• Purpose: Data structures that store a collection of transactions.

• Use Case: Group transactions into a single, immutable record that gets added to the blockchain.

• Components: Typically contain a header (with metadata like the previous block hash, timestamp, and nonce) and a list of transactions.


Block Explorer

• Purpose: A web interface to view the details of the blockchain.

• Use Case: Allows users to search for and view transactions, blocks, addresses, and other data on the blockchain.

• Features: Provides information such as transaction histories, block confirmations, and network status.


Peer

• Purpose: A Web interface to connect blockchain via websockets.

• Use Case: Allows peers to connect to peer network and notify other peers whenever a new block is added to the blockchain.



These components collectively enable a functioning blockchain-based marketplace by facilitating secure transactions, providing transparency, and ensuring the network's integrity and accessibility.


Getting Started
To get started with the Blockchain Network Marketplace, follow these steps:

Clone the Repository

bash
Copy code
git clone https://github.com/yourusername/blockchain-marketplace.git
cd blockchain-marketplace

Install Dependencies
Copy code
npm install
Run the Project

sql
Copy code
npm start
Access the Marketplace
Open your browser and navigate to http://localhost:3000 to access the marketplace.

How to Use

Using the Faucet

Connect your wallet to MetaMask by importing your private key.
Complete the required interaction within the marketplace to receive initial funds.


Mining

Run the mining script to start validating transactions and adding them to the blockchain.
Earn rewards for successful block validation.


Managing Funds with the Wallet

Use the integrated wallet to send, receive, and monitor your cryptocurrency funds.


Exploring the Blockchain

Use the Block Explorer to search for and view details of transactions, blocks, and addresses.






Log In 

<img width="960" alt="Dapp 1" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/d79d7d78-6937-41ee-83ff-2b5bedb1e7fd">

Wallet

<img width="960" alt="Dapp 2" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/b4e80f0f-735e-4220-b72a-b0eaf0826074">

Request Token

<img width="960" alt="Dapp 3" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/df1aa129-c934-4749-a535-3664699b108f">

Wallet Address

<img width="960" alt="Dapp 4" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/90257f3b-b7f2-4d13-be76-4211b5350bd1">

Peers

<img width="960" alt="Dapp 5" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/86dce336-be35-404e-8cbe-d31153ec33b9">

Miner Component

<img width="960" alt="Dapp 6" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/a1a7b093-4f0a-46e3-8019-ecb65d2d1654">

Blocks

<img width="960" alt="Dapp 7" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/3e6fc08a-ef87-4b6b-8a54-4ec882a93073">

Blockchain

<img width="960" alt="Dapp 8" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/70ac2ba4-4821-4695-a2b8-9d1dfcb712dd">


Marketplace with added items on Admin Account

<img width="960" alt="Dapp 9 added products" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/f07ab4ca-be3e-4960-88e8-7f370bd9b540">


Marketplace User Account purchased three items

<img width="960" alt="Dapp 10 User acct they purchased 3 items" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/1cbeecf6-bc2e-4154-b7b5-171232f54e83">


Marketplace User Account pending transactions

<img width="960" alt="Dapp 11 Users Pending Transcations" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/8025cf10-a818-4bed-835e-9570fe2aea67">


Blocks - Get Block Results 

<img width="960" alt="Dapp 12 Get Block" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/ed4a05be-684c-4ada-9cee-eef22b27b7cc">


Admin Account - Mine Tokens after User purchased items

<img width="960" alt="Dapp 13 Admin mined after User purchased items" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/d7d42595-8006-4c5e-904b-cb4458272f99">


Admin Account shows mined blocks and details also now the Users transaction are confirmed and complete at this point.

<img width="960" alt="Dapp 14 BlockExplorer Block Proof 1" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/b917ccf7-6213-4d58-bc6e-d23bbee59b28">


Confirmed transations 

<img width="960" alt="Dapp 15 BlockExplorer Proof 2 " src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/bc2eb680-ea53-4ccb-adc8-6d8b34242bc8">


Confirmed transactions

<img width="960" alt="Dapp 16 confirmed Transactions" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/d708fe25-5981-48ad-a478-3df2c41a0b94">


Admin Wallet - Note since the User made two separate transcations the balance went up from 200 which was the inital balance to 220.

<img width="960" alt="Dapp 17 Admin wallet it has gain 20 since the last two separate transactions " src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/585ed795-90c1-4fb3-a7e8-7ead42b10355">


DEPLOYED on CLOUD with Automactic startup. No need to run in the Droplet console via digital Ocean Cloud and start each componet Blockchain, Backend and frontend separately anymore. I'm only using incognito due to cache issues with my browser. http://209.38.153.171:3000

<img width="960" alt="Dapp Deployed on the CLOUD with Auto Startup im only using incognito due cache issues with my browser" src="https://github.com/Tefaia/blockchain-dapp-backend/assets/83253423/a25bd888-5a33-4dd9-a118-8c569bd7b2fb">
