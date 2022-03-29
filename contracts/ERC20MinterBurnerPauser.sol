// SPDX-License-Identifier: MIT
// Meter.io

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

/**
 * @dev {ERC20} token, including:
 *
 *  - ability for holders to burn (destroy) their tokens
 *  - a minter role that allows for token minting (creation)
 *  - a pauser role that allows to stop all token transfers
 *  - EIP712 permit
 *
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 *
 * The account that deploys the contract will be granted the minter and pauser
 * roles, as well as the default admin role, which will let it grant both minter
 * and pauser roles to aother accounts
 */
contract ERC20MinterBurnerPauser is ERC20PresetMinterPauser, ERC20Permit {
    mapping(address => bool) private suspended;
    uint8 private immutable _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals
    ) public ERC20PresetMinterPauser(name, symbol) ERC20Permit(name) {
        _decimals = decimals;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20PresetMinterPauser, ERC20) {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(!suspended[from], "account is suspended!");
        super._afterTokenTransfer(from, to, amount);
    }

    function setAccountSuspend(address account) external {
        require(
            hasRole(PAUSER_ROLE, _msgSender()),
            "ERC20MinterBurnerPauser: must have pauser role to suspend account"
        );

        suspended[account] = true;
    }

    function unsetAccountSuspend(address account) external {
        require(
            hasRole(PAUSER_ROLE, _msgSender()),
            "ERC20MinterBurnerPauser: must have pauser role to unsuspend account"
        );
        suspended[account] = false;
    }

    function accontSuspended(address account) external view returns (bool) {
        return suspended[account];
    }
}
