// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Community
 * @notice Individual community treasury contract that holds funds for a specific community
 * @dev Each community deployed by CommunityTreasury has its own instance of this contract
 */
contract Community {
    /// @notice The name of the community
    string public communityName;

    /// @notice The treasury address that manages this community
    address public treasury;

    /// @notice Total amount of funds raised for this community
    uint256 public totalFundsRaised;

    /// @notice Total amount of funds withdrawn from this community
    uint256 public totalFundsWithdrawn;

    /// @notice Mapping of beneficiary addresses to their withdrawal amounts
    mapping(address => uint256) public beneficiaryWithdrawals;

    /// @notice Event emitted when funds are deposited
    event FundsDeposited(address indexed from, uint256 amount);

    /// @notice Event emitted when funds are withdrawn by a beneficiary
    event FundsWithdrawn(address indexed beneficiary, uint256 amount);

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
        totalFundsRaised += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Withdraw funds as a beneficiary
     * @param _amount The amount of ETH to withdraw (in wei)
     */
    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(
            _amount <= getBalance(),
            "Insufficient funds in community treasury"
        );

        beneficiaryWithdrawals[msg.sender] += _amount;
        totalFundsWithdrawn += _amount;

        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(msg.sender, _amount);
    }

    /**
     * @notice Admin function to withdraw funds by treasury
     * @param _amount The amount of ETH to withdraw (in wei)
     * @param _recipient The address to receive the funds
     */
    function adminWithdraw(uint256 _amount, address payable _recipient)
        external
    {
        require(msg.sender == treasury, "Only treasury can call this");
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(
            _amount <= getBalance(),
            "Insufficient funds in community treasury"
        );

        totalFundsWithdrawn += _amount;

        (bool success, ) = _recipient.call{value: _amount}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(_recipient, _amount);
    }

    /**
     * @notice Get the current balance of this community treasury
     * @return The current balance in wei
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Get the total funds available (total raised minus withdrawn)
     * @return The total available funds in wei
     */
    function getAvailableFunds() public view returns (uint256) {
        return totalFundsRaised - totalFundsWithdrawn;
    }

    /**
     * @notice Get the beneficiary's total withdrawals
     * @param _beneficiary The beneficiary address
     * @return The total amount withdrawn by the beneficiary
     */
    function getBeneficiaryWithdrawals(address _beneficiary)
        external
        view
        returns (uint256)
    {
        return beneficiaryWithdrawals[_beneficiary];
    }
}
