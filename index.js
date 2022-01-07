// Source code to interact with smart contract

// web3 provider with fallback for old version
if (window.ethereum) {
  window.web3 = new Web3(window.ethereum)
  try {
      // ask user for permission
      ethereum.enable()
      // user approved permission
  } catch (error) {
      // user rejected permission
      console.log('user rejected permission')
  }
}
else if (window.web3) {
  window.web3 = new Web3(window.etherum)
  // no need to ask for permission
}
else {
  window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
}
console.log (window.etherum)

// contractAddress and abi are setted after contract deploy
// var contractAddress = '0x7a038cacd7dcc30fe891d10d799d73188542bb71';
// var abi = JSON.parse( '[{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_info","type":"string"}],"name":"setInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]' );

var contractAddress = '0xC471d6375fBaa3287687749405E8B02086Ec0c57';
var abi = JSON.parse( '[{"inputs":[{"internalType":"string","name":"_productName","type":"string"},{"internalType":"uint16","name":"_number","type":"uint16"},{"internalType":"string","name":"_location","type":"string"},{"internalType":"string","name":"_exportTime","type":"string"}],"name":"createNewProduct","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_productName","type":"string"},{"internalType":"uint16","name":"_number","type":"uint16"},{"internalType":"string","name":"_location","type":"string"},{"internalType":"string","name":"_exportTime","type":"string"}],"name":"editProductInformation","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_age","type":"uint256"}],"name":"initialization","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"_productId","type":"uint256"}],"name":"checkProduct","outputs":[{"components":[{"internalType":"uint256","name":"farmerId","type":"uint256"},{"internalType":"string","name":"farmerName","type":"string"},{"internalType":"string","name":"productName","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"exportTime","type":"string"},{"internalType":"uint16","name":"number","type":"uint16"}],"internalType":"struct Product.ProductInformation","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_farmerId","type":"uint256"}],"name":"getFarmerInformation","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"age","type":"uint256"},{"internalType":"uint256[]","name":"identifiers","type":"uint256[]"}],"internalType":"struct Farmer.FarmerInformation","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_number","type":"uint256"}],"name":"getMyProduct","outputs":[{"components":[{"internalType":"uint256","name":"farmerId","type":"uint256"},{"internalType":"string","name":"farmerName","type":"string"},{"internalType":"string","name":"productName","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"exportTime","type":"string"},{"internalType":"uint16","name":"number","type":"uint16"}],"internalType":"struct Product.ProductInformation","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumberOfProducts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]' );


//contract instance
contract = new web3.eth.Contract(abi, contractAddress);

// Accounts
var account;

web3.eth.getAccounts(function(err, accounts) {
  if (err != null) {
    alert("Error retrieving accounts.");
    return;
  }
  if (accounts.length == 0) {
    alert("No account found! Make sure the Ethereum client is configured properly.");
    return;
  }
  account = accounts[0];
  console.log('Account: ' + account);
  web3.eth.defaultAccount = account;
});

var tmp_transaction;
//Smart contract functions
function createNewProduct() {
  product_name = $("#product_name").val();
  number = $("#number").val();
  contract.methods.createNewProduct(product_name, number).send({from: account }).then(function(tx) {
      // document.getElementById('returnedProductID').innerHTML = tx.events.returnValues;
      console.log(tx.events.AnnounceIdentifier.returnValues._identifier);
      var returnValue = tx.events.AnnounceIdentifier.returnValues._identifier;
      document.getElementById('returnedProductID').innerHTML = returnValue;
    })
}

function getNumberOfProducts() {
  contract.methods.getNumberOfProducts().call().then( function( info ) {
    console.log("info: ", info);
    document.getElementById('lastInfo').innerHTML = info;
  });
}


function checkProduct() {
  //47396914436507364701241788261084924675867994480126887596521279786870260875932
  info = $("#infoCheckProduct").val();
  try {
    contract.methods.checkProduct(info).call((error, returnedValue) => {
      if(!error){
        document.getElementById("returnedValue").innerHTML = returnedValue;
      } else {
        document.getElementById("returnedValue").innerHTML =  "Not Found";
      }
    })
  } catch(error) {
    console.log(error.message)
    document.getElementById("returnedValue").innerHTML =  "Not Found";
  }
}


var tmp_transaction;
const submit_creator = document.getElementById("submit_creator")
const submit_editor = document.getElementById("submit_editor")
const submit_initialization = document.getElementById("submit_initialization")
const get_number = document.getElementById("get_number")


get_number.onclick = function() {
  contract.methods.getNumberOfProducts().call().then( function( info ) {
    console.log("info: ", info);
    document.getElementById('lastInfo').innerHTML = info;
  });
}
