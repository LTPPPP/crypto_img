let dataURL;
document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const image_path = URL.createObjectURL(file);
    document.getElementById('imageContainer').innerHTML = `<img src="${image_path}" alt="Selected Image">`;
    toDataURLImagePath(image_path);
});
// Function to convert image file to Base64
//Encode with img path
function toDataURLImagePath(imagePath) {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Address CORS issues
    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL('image/png').substring(22); // Use PNG format for NFTs
    };
    img.src = imagePath;
}
//1- connect metamask
let account;
const connectMetamask = async () => {
    if (window.ethereum !== "undefined") {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        account = accounts[0];
        document.getElementById("accountArea").innerHTML = account;
    }
}

//2- connect to smart contract
const connectContract = async () => {
    const ABI = [
        {
            "inputs": [],
            "name": "getURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_uri",
                    "type": "string"
                }
            ],
            "name": "setURI",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "uri",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const Address = "0xd9145CCE52D386f254917e481eB44e9943F39138";
    window.web3 = await new Web3(window.ethereum);
    window.contract = await new window.web3.eth.Contract(ABI, Address);
    document.getElementById("contractArea").innerHTML = "connected to smart contract";
}

//3-read data from smart contract
const readContract = async () => {
    if (!dataURL) {
        console.error("Please select an image first!");
        return;
    }

    // Call the contract function to set URI
    await window.contract.methods.setURI(dataURL).send({ from: account });
    console.log("URI stored in the contract!");
}
