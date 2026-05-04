// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Daily check-in on Base. User pays only gas; no ETH accepted.
/// @dev `lastDayEncoded` stores `day + 1` so day 0 is distinguishable from "never checked".
contract CheckIn {
    error ValueNotZero();
    error AlreadyCheckedInToday();

    event CheckedIn(address indexed user, uint256 indexed dayIndex, uint256 streak);

    uint256 internal constant SECONDS_PER_DAY = 86400;

    /// @dev 0 = never checked; otherwise stores `dayIndex + 1` from last successful check-in.
    mapping(address => uint256) internal lastDayEncoded;
    mapping(address => uint256) internal streakForUser;

    function checkIn() external payable {
        if (msg.value != 0) revert ValueNotZero();

        uint256 day = block.timestamp / SECONDS_PER_DAY;
        uint256 enc = lastDayEncoded[msg.sender];

        if (enc != 0 && enc - 1 == day) revert AlreadyCheckedInToday();

        uint256 lastDay = enc == 0 ? type(uint256).max : enc - 1;

        uint256 newStreak;
        if (enc == 0) {
            newStreak = 1;
        } else if (day == lastDay + 1) {
            newStreak = streakForUser[msg.sender] + 1;
        } else {
            newStreak = 1;
        }

        streakForUser[msg.sender] = newStreak;
        lastDayEncoded[msg.sender] = day + 1;

        emit CheckedIn(msg.sender, day, newStreak);
    }

    /// @return dayIndex UTC day index (`block.timestamp / 86400`) of last check-in, or 0 if never.
    function lastCheckInDay(address user) external view returns (uint256) {
        uint256 enc = lastDayEncoded[user];
        return enc == 0 ? 0 : enc - 1;
    }

    function currentStreak(address user) external view returns (uint256) {
        return streakForUser[user];
    }
}
