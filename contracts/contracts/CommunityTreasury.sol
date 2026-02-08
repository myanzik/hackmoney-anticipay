// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Community} from "./Community.sol";

/**
 * @title CommunityTreasury
 * @notice Main hub contract that creates and manages individual community treasuries
 * @dev Receives funds from donors and routes them to specific community contracts
 */
contract CommunityTreasury {
    /// @notice The owner of the treasury who can create new communities
    address public owner;

    /// @notice Mapping of community names to their contract addresses
    mapping(string => address) public communityContracts;

    /// @notice Array of all community names for enumeration
    string[] public communityNames;

    /// @notice Mapping to check if a community exists
    mapping(string => bool) public communityExists;

    /// @notice Event emitted when a new community is created
    event CommunityCreated(
        string indexed communityName,
        address indexed communityContract
    );

    /// @notice Event emitted when funds are donated to a community
    event FundsDonated(
        string indexed communityName,
        address indexed donor,
        uint256 amount
    );

    /**
     * @notice Constructor to initialize the CommunityTreasury
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Create a new community and its treasury contract
     * @param _communityName The name of the community
     * @return The address of the newly created Community contract
     */
    function createCommunity(string memory _communityName)
        external
        returns (address)
    {
        require(msg.sender == owner, "Only owner can create communities");
        require(!communityExists[_communityName], "Community already exists");
        require(bytes(_communityName).length > 0, "Community name cannot be empty");

        Community community = new Community(_communityName, address(this));
        address communityAddress = address(community);

        communityContracts[_communityName] = communityAddress;
        communityNames.push(_communityName);
        communityExists[_communityName] = true;

        emit CommunityCreated(_communityName, communityAddress);

        return communityAddress;
    }

    /**
     * @notice Donate funds to a specific community
     * @param _communityName The name of the community to donate to
     */
    function donateToCommunity(string memory _communityName)
        external
        payable
    {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(communityExists[_communityName], "Community does not exist");

        address communityAddress = communityContracts[_communityName];
        (bool success, ) = communityAddress.call{value: msg.value}("");
        require(success, "Donation transfer failed");

        emit FundsDonated(_communityName, msg.sender, msg.value);
    }

    /**
     * @notice Get the contract address of a community
     * @param _communityName The name of the community
     * @return The address of the Community contract
     */
    function getCommunityContract(string memory _communityName)
        external
        view
        returns (address)
    {
        require(communityExists[_communityName], "Community does not exist");
        return communityContracts[_communityName];
    }

    /**
     * @notice Get all community names
     * @return Array of all community names
     */
    function getAllCommunities() external view returns (string[] memory) {
        return communityNames;
    }

    /**
     * @notice Get the total number of communities
     * @return The number of communities
     */
    function getCommunityCount() external view returns (uint256) {
        return communityNames.length;
    }

    /**
     * @notice Withdraw ETH from the Treasury (emergency function)
     * @param _amount The amount to withdraw
     * @param _recipient The recipient of the funds
     */
    function emergencyWithdraw(uint256 _amount, address payable _recipient)
        external
    {
        require(msg.sender == owner, "Only owner can withdraw");
        require(_amount > 0, "Withdrawal amount must be greater than 0");

        (bool success, ) = _recipient.call{value: _amount}("");
        require(success, "Withdrawal transfer failed");
    }
}
