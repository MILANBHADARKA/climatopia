// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnhancedBadgeNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct Badge {
        string name;
        uint256 timestamp;
    }

    mapping(address => mapping(string => bool)) public hasBadge;
    mapping(uint256 => Badge) public tokenBadges;
    mapping(string => uint256) public badgeCount; // Track how many of each badge type exist
    
    // Events
    event BadgeAwarded(address indexed user, string badgeName, uint256 tokenId);

    constructor() ERC721("EarthSim Badge", "ESB") Ownable(msg.sender) {}

    function awardBadge(
        address user,
        string memory badgeName,
        string memory uri
    ) public onlyOwner  {
        require(!hasBadge[user][badgeName], "Badge already awarded");
        
        uint256 tokenId = ++_tokenIdCounter;
        _safeMint(user, tokenId);
        _setTokenURI(tokenId, uri);
        hasBadge[user][badgeName] = true;
        tokenBadges[tokenId] = Badge(badgeName, block.timestamp);
        badgeCount[badgeName]++;
        emit BadgeAwarded(user, badgeName, tokenId);
    }

   

    // Get all token IDs owned by a user
    function getUserBadges(address user) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory badges = new uint256[](balance);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (_exists(i) && ownerOf(i) == user) {
                badges[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return badges;
    }

    // Get badge details by token ID
    function getBadgeDetails(uint256 tokenId) public view returns (Badge memory) {
        require(_exists(tokenId), "Badge does not exist");
        return tokenBadges[tokenId];
    }

  

    // Check if badge exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId <= _tokenIdCounter && _ownerOf(tokenId) != address(0);
    }

    // Get total number of badges minted
    function totalBadges() public view returns (uint256) {
        return _tokenIdCounter;
    }
}
