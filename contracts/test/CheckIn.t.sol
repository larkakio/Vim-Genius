// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CheckIn} from "../src/CheckIn.sol";

contract CheckInTest is Test {
    CheckIn internal c;
    address internal alice = address(0xA11CE);

    function setUp() public {
        c = new CheckIn();
    }

    function test_checkIn_first_time_emits() public {
        vm.startPrank(alice);
        vm.expectEmit(true, true, false, true);
        emit CheckIn.CheckedIn(alice, block.timestamp / 86400, 1);
        c.checkIn();
        vm.stopPrank();
    }

    function test_RevertWhen_value_sent() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        vm.expectRevert(CheckIn.ValueNotZero.selector);
        c.checkIn{value: 1 wei}();
    }

    function test_RevertWhen_double_same_day() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.expectRevert(CheckIn.AlreadyCheckedInToday.selector);
        c.checkIn();
        vm.stopPrank();
    }

    function test_streak_consecutive_days() public {
        vm.startPrank(alice);
        c.checkIn();
        assertEq(c.currentStreak(alice), 1);

        vm.warp(block.timestamp + 86400);
        c.checkIn();
        assertEq(c.currentStreak(alice), 2);

        vm.warp(block.timestamp + 86400);
        c.checkIn();
        assertEq(c.currentStreak(alice), 3);
        vm.stopPrank();
    }

    function test_streak_resets_after_gap() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.warp(block.timestamp + 86400);
        c.checkIn();
        assertEq(c.currentStreak(alice), 2);

        vm.warp(block.timestamp + 3 * 86400);
        c.checkIn();
        assertEq(c.currentStreak(alice), 1);
        vm.stopPrank();
    }
}
