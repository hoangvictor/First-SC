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
} else if (window.web3) {
  window.web3 = new Web3(window.etherum)
  // no need to ask for permission
} else {
  window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
}
console.log(window.etherum)

// contractAddress and abi are setted after contract deploy
// var contractAddress = '0x7a038cacd7dcc30fe891d10d799d73188542bb71';
// var abi = JSON.parse( '[{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_info","type":"string"}],"name":"setInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]' );

var contractAddress = '0xcFB7BeF602c0FfB238eEE74415bEFf112B860719'
var abi = JSON.parse('[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"productID","type":"uint256"}],"name":"CreateNewProduct","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"status","type":"string"}],"name":"EditProductInformation","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"farmerId","type":"uint256"}],"name":"Initialization","type":"event"},{"inputs":[{"internalType":"uint256","name":"_productId","type":"uint256"}],"name":"checkProduct","outputs":[{"components":[{"internalType":"uint256","name":"farmerId","type":"uint256"},{"internalType":"string","name":"productName","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"exportTime","type":"string"},{"internalType":"uint16","name":"number","type":"uint16"}],"internalType":"struct Product.ProductInformation","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_productName","type":"string"},{"internalType":"uint16","name":"_number","type":"uint16"},{"internalType":"string","name":"_location","type":"string"},{"internalType":"string","name":"_exportTime","type":"string"}],"name":"createNewProduct","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_productId","type":"uint256"},{"internalType":"string","name":"_productName","type":"string"},{"internalType":"uint16","name":"_number","type":"uint16"},{"internalType":"string","name":"_location","type":"string"},{"internalType":"string","name":"_exportTime","type":"string"}],"name":"editProductInformation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_farmerId","type":"uint256"}],"name":"getFarmerInformation","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"age","type":"uint256"},{"internalType":"uint256[]","name":"identifiers","type":"uint256[]"}],"internalType":"struct Farmer.FarmerInformation","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"_number","type":"uint16"}],"name":"getMyProduct","outputs":[{"components":[{"internalType":"uint256","name":"farmerId","type":"uint256"},{"internalType":"string","name":"productName","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"exportTime","type":"string"},{"internalType":"uint16","name":"number","type":"uint16"}],"internalType":"struct Product.ProductInformation","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tmpFarmerId","type":"uint256"}],"name":"getMyProductId","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tmpFarmerId","type":"uint256"}],"name":"getNumberOfProducts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_age","type":"uint256"}],"name":"initialization","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]')


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


// Id variables
const submit_creator = $("#submit_creator")[0]
const submit_editor = $("#submit_editor")[0]
const submit_initialization = $("#submit_initialization")[0]
const get_number = $("#get_number")[0]
const get_product_id = $("#get_product_id")[0]

submit_initialization.onclick = async function() {
  farmer_name = $("#farmer_name").val()
  farmer_age = $("#farmer_age").val()
  await contract.methods.initialization(farmer_name, Number(farmer_age)).send({
    from: account
  }).then(function(tx) {
    console.log(tx)
    submit_initialization.innerHTML = 'Farmer ID: ' + tx.events.Initialization.returnValues.farmerId
  })
}


submit_creator.onclick = async function() {
  product_name_creator = $("#product_name_creator").val()
  number_of_product_creator = $("#number_of_product_creator").val()
  place_creator = $("#place_creator").val()
  time_creator = $("#time_creator").val()
  await contract.methods.createNewProduct(product_name_creator, Number(number_of_product_creator), place_creator, time_creator).send({
    from: account
  }).then(function(tx) {
    console.log(tx)
    submit_creator.innerHTML = 'Product ID: ' + tx.events.CreateNewProduct.returnValues.productID
  })
}

submit_editor.onclick = async function() {
  product_id_editor = $("#product_id_editor").val()
  product_name_editor = $("#product_name_editor").val()
  number_of_product_editor = $("#number_of_product_editor").val()
  place_editor = $("#place_editor").val()
  time_editor = $("#time_editor").val()
  await contract.methods.editProductInformation(Number(product_id_editor), product_name_editor, Number(number_of_product_editor), place_editor, time_editor).send({
    from: account
  }).then(function(tx) {
    console.log(tx)
    submit_editor.innerHTML = 'Status: ' + tx.events.EditProductInformation.returnValues.status
  })
}
