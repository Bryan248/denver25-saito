# denver25-saito
Saito AI repo for ETHDenver 2025 hackthon



## 1. Introduction
Web 3 AI-driven solutions often require user data to provide personalized or contextual services. However, privacy concerns and data control are paramount. The **Memory Module** proposed here addresses these challenges by securely extracting, retrieving, and authorizing access to user data. This module is designed to work in tandem with a **Primary Agent** (trusted AI) and potentially multiple **Sub Agents** (less trusted third-party AIs).

---

## 2. High-Level Overview
### Memory Extraction:
Identifies and stores new information from user inputs or from AI-generated responses.  
For instance, when a user says, “I am in Denver this week,” the **Memory Extractor** proposes a memory record like:  
`${address}:memory_basic_info:location = "User is in Denver 2025 Feb 23rd - 2025 March 2nd"`  
This record is then uploaded to decentralized storage.

### Memory Retrieval:
Provides relevant data to enhance AI behavior and the user experience.  
For example, if the user wants to schedule a meeting, the module retrieves the user’s current location or time zone before handing necessary details to a **Sub Agent**.

### Memory Authorization:
Ensures high-sensitivity data is only accessed by authorized **Sub Agents**.  
An on-chain mechanism (**Authorization Smart Contract**) requires explicit user approval before releasing protected data.

---

## 3. Key Components
### 3.1 Memory Module
- **Extractor**  
  Parses user input (and possibly AI responses) to identify new data. Automatically proposes memory records to be stored.  
- **Retriever**  
  Locates and fetches relevant memory items from decentralized storage based on the current context.  
- **Authorizer**  
  Enforces access policies for sensitive data. If an unauthorized **Sub Agent** requests data, the user is prompted to grant explicit permission (via EIP712 signature).

### 3.2 Agents
- **Primary Agent**  
  A user-trusted AI agent, possibly self-hosted or secured by technologies like **TEE** (Trusted Execution Environment) or **OPML**.  
  Serves as the core decision-maker and host for the **Memory Module**.  
  Has a unique wallet address used for identification on-chain.  
- **Sub Agent**  
  A third-party, potentially untrusted AI agent.  
  Also holds a unique wallet address for on-chain identity.  
  Must request data through the **Primary Agent’s Memory Module**.

### 3.3 Memory Storage
- **Memory Catalog**  
  A publicly readable list of available memory keys (e.g., `${address}:memory:basic_info:location`), without revealing the actual data content.  
- **Memory Records**  
  The actual data stored under the keys published in the **Catalog**.  
  Encrypted using the **Primary Agent’s** private key for confidentiality.  
  Hosted in decentralized storage (e.g., EthStorage).

### 3.4 Authorization Smart Contract
- Deployed on **QuarkChain**.  
- Manages explicit user approvals for sensitive data access.  
- Stores **EIP712** signature data, which includes the requesting **Sub Agent** address and the resource identifier (SHA256 of the memory key).

---

## 4. Technical Architecture
### Data Flow
1. **User → Primary Agent**: The user input is processed by the **Extractor**.  
2. **Primary Agent → Storage**: Memory records are encrypted and stored.  
3. **Primary Agent → Sub Agent**: If data is needed by a **Sub Agent**, the **Retriever** checks the memory store. If the data is sensitive, the **Authorizer** verifies the user’s on-chain approval before releasing it.

### On-Chain Components
- **Wallet Addresses**: Each agent has a unique wallet address.  
- **Authorization Contract**: Ensures the requesting **Sub Agent** is authorized for specific memory records.

### Security
- **Encryption**: Memory Records are encrypted at rest using the **Primary Agent’s** private key.  
- **Partial Reveal**: The **Memory Catalog** reveals only the record keys, never the actual content.

---

## 5. Workflow Breakdown
### Memory Extraction
1. User sends input: “I am in Denver this week.”  
2. The **Primary Agent’s Extractor** identifies a relevant piece of information: user location and timeframe.  
3. A new record is proposed:  
   - **Key**: `${address}:memory_basic_info:location`  
   - **Value**: `"User is in Denver 2025 Feb 23rd - 2025 March 2nd"`  
4. This key is appended to the **Memory Catalog** (plaintext).  
5. The associated value is encrypted and uploaded to **Memory Records**.

### Memory Retrieval
1. The user says: “I want to schedule a meeting for 8PM.”  
2. The **Primary Agent’s Retriever** determines the user’s location/time zone is relevant.  
3. It decrypts the location record from the **Memory Records**.  
4. The **Primary Agent** transforms the user’s location information into Timezone.  
5. The Timezone data is then passed to, for example, a “ZoomMeeting Agent” (**Sub Agent**), facilitating accurate scheduling.

### Memory Authorization
1. Suppose a **Sub Agent** requests highly sensitive data.  
2. The **Primary Agent’s Authorizer** checks if this **Sub Agent** has permission.  
3. If not, the user must grant access on-chain by providing an **EIP712** signature that includes the **Sub Agent’s** wallet address and a SHA256 hash of the requested memory key.  
4. Once authorized, the **Primary Agent** can safely share the data with that **Sub Agent**.

---

## 6. Implementation Details
### Storage Layer:
- Utilizes **EthStorage** for decentralized data persistence.  
- **Catalog** (keys) is stored in plaintext for global discoverability.  
- **Memory Records** (values) are encrypted.

### Smart Contract Layer:
- **Authorization Contract** deployed on **QuarkChain**, address: `0xCaB58F49f33571bE60542f516985aEC792204aAA`.  
- Maintains a mapping of `{ (requesterAddress, resourceHash) → authorized }`.  
- Relies on user **EIP712** signatures for approvals.

### Agent Identification:
- Both **Primary Agent** and **Sub Agents** need to have wallet addresses for identification.  
- All on-chain operations for storing or retrieving data reference these addresses.

### Encryption:
- Not fully implemented at the hackathon stage.  
- The design still envisions the **Primary Agent’s** private key usage for secure encryption/decryption.  

---
