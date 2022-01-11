// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

contract Product {

    uint id;

    struct ProductInformation {
        uint farmerId;
        string productName;
        string location;
        string exportTime;
        uint16 number;
    }

    mapping (uint => ProductInformation) internal productInformationMapping;
    mapping (address => uint) internal farmerIdMapping;

    function _set(uint _productId, string memory _productName, uint16 _number, string memory _location, string memory _exportTime) internal returns(uint) {
        productInformationMapping[_productId].farmerId = farmerIdMapping[msg.sender];
        productInformationMapping[_productId].productName = _productName;
        productInformationMapping[_productId].number = _number;
        productInformationMapping[_productId].location = _location;
        productInformationMapping[_productId].exportTime = _exportTime;
        return _productId;
    }


    function checkProduct(uint _productId) public view returns(ProductInformation memory) {
        if (productInformationMapping[_productId].number != 0) {
            return productInformationMapping[_productId];
        }
        revert("Not found");
    }
}


contract Farmer is Product {

    uint private randNonce = 0;

    address farmerAddress;
    uint farmerId;

    struct FarmerInformation {
        string name;
        uint age;
        uint[] identifiers;
    }


    mapping (uint => FarmerInformation) private farmerInformationMapping;

    modifier checkCondition() {
        require(msg.sender == farmerAddress);
        require(bytes(farmerInformationMapping[farmerId].name).length != 0);
        _;
    }


    constructor() {
        farmerAddress = msg.sender;
        randNonce++;
        uint tmpId = uint(keccak256(abi.encodePacked("farmer", block.timestamp, msg.sender, randNonce))) % (10**20);
        farmerId = tmpId;
        farmerIdMapping[farmerAddress] = tmpId;
    }


    event Initialization(uint farmerId);
    function initialization(string memory _name, uint _age) public returns(uint) {
        require(msg.sender == farmerAddress);
        farmerInformationMapping[farmerId].name = _name;
        farmerInformationMapping[farmerId].age = _age;
        emit Initialization(farmerId);
        return farmerId;
    }


    event CreateNewProduct(uint productID);
    function createNewProduct(string memory _productName, uint16 _number, string memory _location, string memory _exportTime) checkCondition public returns(uint) {
        randNonce++;
        uint productId = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % (10**20);
        farmerInformationMapping[farmerId].identifiers.push(productId);
        emit CreateNewProduct(productId);
        return _set(productId, _productName, _number, _location, _exportTime);
    }


    event EditProductInformation(string status);
    function editProductInformation(uint _productId, string memory _productName, uint16 _number, string memory _location, string memory _exportTime) checkCondition public {
        bool check = false;
        for(uint i = 0; i <  farmerInformationMapping[farmerId].identifiers.length; i++) {
            if(farmerInformationMapping[farmerId].identifiers[i] == _productId) {
                check = true;
                break;
            }
        }
        if(check){
            emit EditProductInformation("Edited succesfully");
            productInformationMapping[_productId].farmerId = farmerIdMapping[msg.sender];
            productInformationMapping[_productId].productName = _productName;
            productInformationMapping[_productId].number = _number;
            productInformationMapping[_productId].location = _location;
            productInformationMapping[_productId].exportTime = _exportTime;
        } else {
            emit EditProductInformation("Edited failed");
        }
    }


    function getMyProduct(uint16 _number) checkCondition public view returns(ProductInformation memory) {
        if (_number <= farmerInformationMapping[farmerId].identifiers.length){
            return productInformationMapping[farmerInformationMapping[farmerId].identifiers[_number - 1]];
        }
        revert("Not found");
    }


    function getNumberOfProducts(uint _tmpFarmerId) public view returns(uint) {
        return farmerInformationMapping[_tmpFarmerId].identifiers.length;
    }


    function getMyProductId(uint _tmpFarmerId) public view returns (uint[] memory) {
        return farmerInformationMapping[_tmpFarmerId].identifiers;
    }


    function getFarmerInformation (uint _farmerId) public view returns(FarmerInformation memory) {
        FarmerInformation memory tmp = farmerInformationMapping[_farmerId];
        if (tmp.age != 0) {
            return tmp;
        }
        revert("Not found");
    }
}
