import { parseAbi } from "viem";

export const RNS_CONTRACT_ADDRESS = "0xD0Afe6e35d78c5912D282FBB50FC579273B294F4";

export const rnsAbi = parseAbi([
  "function register(string name, uint256 durationYears) external",
  "function renew(string name, uint256 durationYears) external",
  "function setRecord(string name, string key, string value) external",
  "function getRecord(string name, string key) external view returns (string)",
  "function isAvailable(uint256 id) public view returns (bool)",
  "function getTokenId(string name) public pure returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function domains(uint256) public view returns (string name, uint256 expiresAt)",
  "event NameRegistered(uint256 indexed id, string name, address indexed owner, uint256 expiresAt)",
  "event NameRenewed(uint256 indexed id, string name, uint256 expiresAt)",
  "event RecordChanged(uint256 indexed id, string name, string key, string value)"
]);
