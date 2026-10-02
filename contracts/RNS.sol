// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Ritual Name Service (RNS)
 * @dev A decentralized name service registry for the Ritual ecosystem.
 *      Names are registered as ERC721 NFTs.
 */
contract RNS is ERC721, Ownable {
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    struct Domain {
        string name;
        uint256 expiresAt;
    }

    // Mapping from Token ID (keccak256(name)) to Domain details
    mapping(uint256 => Domain) public domains;

    // Mapping from Token ID to text records (e.g., website, description)
    mapping(uint256 => mapping(string => string)) public records;

    event NameRegistered(
        uint256 indexed id,
        string name,
        address indexed owner,
        uint256 expiresAt
    );
    event NameRenewed(
        uint256 indexed id,
        string name,
        uint256 expiresAt
    );
    event RecordChanged(
        uint256 indexed id,
        string name,
        string key,
        string value
    );

    constructor() ERC721("Ritual Name Service", "RNS") Ownable(msg.sender) {}

    /**
     * @dev Generates a unique Token ID for a given name string.
     */
    function getTokenId(string memory name) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(name)));
    }

    /**
     * @dev Checks if a name is currently available for registration.
     */
    function isAvailable(uint256 id) public view returns (bool) {
        return (domains[id].expiresAt < block.timestamp);
    }

    /**
     * @dev Registers a new name or claims an expired one.
     * @param name The string representation of the name (e.g., "oahid-dao").
     * @param durationYears Number of years to register.
     */
    function register(string memory name, uint256 durationYears) external {
        uint256 id = getTokenId(name);
        
        require(durationYears > 0, "Duration must be at least 1 year");
        require(isAvailable(id), "Name is already registered and active");

        uint256 expiration = block.timestamp + (durationYears * SECONDS_PER_YEAR);

        domains[id] = Domain({
            name: name,
            expiresAt: expiration
        });

        if (_ownerOf(id) != address(0)) {
            // Burn the expired token before minting to the new owner
            _burn(id);
        }

        _mint(msg.sender, id);

        emit NameRegistered(id, name, msg.sender, expiration);
    }

    /**
     * @dev Renews an active or expired name.
     */
    function renew(string memory name, uint256 durationYears) external {
        uint256 id = getTokenId(name);
        
        require(durationYears > 0, "Duration must be at least 1 year");
        require(_ownerOf(id) != address(0), "Name does not exist");
        
        // If expired, renew from current time. If active, extend expiration.
        if (domains[id].expiresAt < block.timestamp) {
            domains[id].expiresAt = block.timestamp + (durationYears * SECONDS_PER_YEAR);
        } else {
            domains[id].expiresAt += (durationYears * SECONDS_PER_YEAR);
        }

        emit NameRenewed(id, name, domains[id].expiresAt);
    }

    /**
     * @dev Sets a text record for a name (e.g., twitter, website).
     */
    function setRecord(string memory name, string memory key, string memory value) external {
        uint256 id = getTokenId(name);
        require(ownerOf(id) == msg.sender, "Only owner can set records");
        
        records[id][key] = value;
        
        emit RecordChanged(id, name, key, value);
    }

    /**
     * @dev Retrieves a text record for a name.
     */
    function getRecord(string memory name, string memory key) external view returns (string memory) {
        uint256 id = getTokenId(name);
        return records[id][key];
    }
}
