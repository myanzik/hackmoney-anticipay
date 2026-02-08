// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Community
 * @notice Individual community treasury contract that holds funds for a specific community
 * @dev Supports both ETH and ERC20 tokens (primarily USDC)
 */
contract Community {
    /// @notice The name of the community
    string public communityName;

    /// @notice The treasury address that manages this community
    address public treasury;

    /// @notice USDC token address on Base (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    /// @notice Total amount of ETH raised for this community
    uint256 public totalETHRaised;

    /// @notice Total amount of USDC raised for this community
    uint256 public totalUSDCRaised;

    /// @notice Total amount of ETH withdrawn from this community
    uint256 public totalETHWithdrawn;

    /// @notice Total amount of USDC withdrawn from this community
    uint256 public totalUSDCWithdrawn;

    /// @notice Mapping of beneficiary addresses to their ETH withdrawal amounts
    mapping(address => uint256) public beneficiaryETHWithdrawals;

    /// @notice Mapping of beneficiary addresses to their USDC withdrawal amounts
    mapping(address => uint256) public beneficiaryUSDCWithdrawals;

    /// @notice Event emitted when ETH is deposited
    event ETHDeposited(address indexed from, uint256 amount);

    /// @notice Event emitted when USDC is deposited
    event USDCDeposited(address indexed from, uint256 amount);

    /// @notice Event emitted when ETH is withdrawn by a beneficiary
    event ETHWithdrawn(address indexed beneficiary, uint256 amount);

    /// @notice Event emitted when USDC is withdrawn by a beneficiary
    event USDCWithdrawn(address indexed beneficiary, uint256 amount);

    /**
     * @notice Constructor to initialize the Community contract
     * @param _communityName The name of the community
     * @param _treasury The address of the CommunityTreasury contract
     */
    constructor(string memory _communityName, address _treasury) {
        require(_treasury != address(0), "Invalid treasury address");
        communityName = _communityName;
        treasury = _treasury;
    }

    /**
     * @notice Receive ETH deposits for this community
     * @dev This function is called when the contract receives ETH without any calldata
     */
    receive() external payable {
        totalETHRaised += msg.value;
        emit ETHDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Deposit USDC for this community
     * @param _amount The amount of USDC to deposit (in wei, 6 decimals for USDC)
     */
    function depositUSDC(uint256 _amount) external {
        require(_amount > 0, "Deposit amount must be greater than 0");
        require(
            IERC20(USDC).transferFrom(msg.sender, address(this), _amount),
            "USDC transfer failed"
        );
        totalUSDCRaised += _amount;
        emit USDCDeposited(msg.sender, _amount);
    }

    /**
     * @notice Withdraw ETH as a beneficiary
     * @param _amount The amount of ETH to withdraw (in wei)
     */
    function withdrawETH(uint256 _amount) external {
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(
            _amount <= getETHBalance(),
            "Insufficient ETH in community treasury"
        );

        beneficiaryETHWithdrawals[msg.sender] += _amount;
        totalETHWithdrawn += _amount;

        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "ETH transfer failed");

        emit ETHWithdrawn(msg.sender, _amount);
    }

    /**
     * @notice Withdraw USDC as a beneficiary
     * @param _amount The amount of USDC to withdraw (in wei)
     */
    function withdrawUSDC(uint256 _amount) external {
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(
            _amount <= getUSDCBalance(),
            "Insufficient USDC in community treasury"
        );

        beneficiaryUSDCWithdrawals[msg.sender] += _amount;
        totalUSDCWithdrawn += _amount;

        require(IERC20(USDC).transfer(msg.sender, _amount), "USDC transfer failed");

        emit USDCWithdrawn(msg.sender, _amount);
    }

    /**
     * @notice Admin function to withdraw ETH by treasury
     * @param _amount The amount of ETH to withdraw (in wei)
     * @param _recipient The address to receive the funds
     */
    function adminWithdrawETH(uint256 _amount, address payable _recipient)
        external
    {
        require(msg.sender == treasury, "Only treasury can call this");
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(
            _amount <= getETHBalance(),
            "Insufficient ETH in community treasury"
        );

        totalETHWithdrawn += _amount;

        (bool success, ) = _recipient.call{value: _amount}("");
        require(success, "ETH transfer failed");

        emit ETHWithdrawn(_recipient, _amount);
    }

    /**
     * @notice Admin function to withdraw USDC by treasury
     * @param _amount The amount of USDC to withdraw (in wei)
     * @param _recipient The address to receive the funds
     */
    function adminWithdrawUSDC(uint256 _amount, address _recipient)
        external
    {
        require(msg.sender == treasury, "Only treasury can call this");
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(
            _amount <= getUSDCBalance(),
            "Insufficient USDC in community treasury"
        );

        totalUSDCWithdrawn += _amount;

        require(IERC20(USDC).transfer(_recipient, _amount), "USDC transfer failed");

        emit USDCWithdrawn(_recipient, _amount);
    }

    /**
     * @notice Get the current ETH balance of this community treasury
     * @return The current ETH balance in wei
     */
    function getETHBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Get the current USDC balance of this community treasury
     * @return The current USDC balance in wei (6 decimals)
     */
    function getUSDCBalance() public view returns (uint256) {
        return IERC20(USDC).balanceOf(address(this));
    }

    /**
     * @notice Get the total ETH funds available (total raised minus withdrawn)
     * @return The total available ETH funds in wei
     */
    function getAvailableETH() public view returns (uint256) {
        return totalETHRaised - totalETHWithdrawn;
    }

    /**
     * @notice Get the total USDC funds available (total raised minus withdrawn)
     * @return The total available USDC funds in wei
     */
    function getAvailableUSDC() public view returns (uint256) {
        return totalUSDCRaised - totalUSDCWithdrawn;
    }

    /**
     * @notice Get the beneficiary's total ETH withdrawals
     * @param _beneficiary The beneficiary address
     * @return The total ETH amount withdrawn by the beneficiary
     */
    function getBeneficiaryETHWithdrawals(address _beneficiary)
        external
        view
        returns (uint256)
    {
        return beneficiaryETHWithdrawals[_beneficiary];
    }

    /**
     * @notice Get the beneficiary's total USDC withdrawals
     * @param _beneficiary The beneficiary address
     * @return The total USDC amount withdrawn by the beneficiary
     */
    function getBeneficiaryUSDCWithdrawals(address _beneficiary)
        external
        view
        returns (uint256)
    {
        return beneficiaryUSDCWithdrawals[_beneficiary];
    }
}
