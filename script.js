/*****************
 * @author Dennis Lange
 * Creationdate: 22.11.2018
 * Project: Calculate the network relevant information with the help of the Ip and the suffix or subnet mask!
 * Last Change: 22.11.2018 
 *****************/ 

var subnetting = subnetting || {
	
	data: {
		// octets of the ip in decimal
		ipDecOctets : [],
		// octets of the ip in binary
		ipBinOctets : [],
		// the suffix of the subnet mask
		suffix : null,
	    // the number of ip´s to be assigned that result with this subnet mask
		possibilities : null,
	    // octets of the subnetmask in decimal
		subBinOctets : [],
	    // octets of the subnetmask in binary
		subDecOctets : [],
	    // octets of the networkadress in decimal
		netzDecOctets : [],
	    // octets of the networkadress in binary
		netzBinOctets : [],
	    // octets of the broadcastadress in decimal
		broadDecOctets : [],
	    // octets of the broadcastadress in binary
		broadBinOctets : [],
	},
	/**
	* Extracts the octets of the ip
	* @param ip has to be written in dotted form. for example: 192.168.1.1
	**/
	extractOctets:function(ip) 
	{
		subnetting.data.ipDecOctets = ip.split(".");
		for (var i = 0; i < subnetting.data.ipDecOctets.length; i++) {
			subnetting.data.ipBinOctets[i] = subnetting.decimalToBinary(subnetting.data.ipDecOctets[i]);
		}
	},
	/**
	 * calculates the subnetmask and saves the result in binary & deciaml form
	 * @param sf will be the counter how often a 1 has to be written from the beginnning 
	 * for example:  sf=8  will result in 255.0.0.0 or exactly 8 times 1 followed by 24 0´s
	 */
	calculateSubnetmask: function (sf)
	{
		subnetting.data.suffix = sf;
		var binstr = "";
		for (var i = 0; i < 32; i++) {
			if (i < sf) {
				binstr += "1";
			} else {
				binstr+= "0";
			}
		}
		subnetting.data.subBinOctets[0] = binstr.substr(0,8);
		subnetting.data.subBinOctets[1] = binstr.substr(8,8);
		subnetting.data.subBinOctets[2] = binstr.substr(16,8);
		subnetting.data.subBinOctets[3] = binstr.substr(24,8);
		subnetting.data.subDecOctets[0] = subnetting.binaryToDecimal(subnetting.data.subBinOctets[0]);
		subnetting.data.subDecOctets[1] = subnetting.binaryToDecimal(subnetting.data.subBinOctets[1]);
		subnetting.data.subDecOctets[2] = subnetting.binaryToDecimal(subnetting.data.subBinOctets[2]);
		subnetting.data.subDecOctets[3] = subnetting.binaryToDecimal(subnetting.data.subBinOctets[3]);
	},
	/**
	 * calculates the possibile amount of assignable ips. note that it will be reduced by 2, since networkadress and broadcastadress has to be assigned aswell!
	 * @param sf the suffix, which will seperate host share from net share
	 */
	calculatePossibilities: function(sf) {
		subnetting.data.possibilities = Math.pow(2, (32-sf)) - 2;
	},
    /****
     * Convert a decimal value to binary system
     * The remainder of the division by 2 is determined first (modulu), which then represents the respective digit 0 or 1.
     * Then it's divided by two and rounded off
     * Note that the first division corresponds to the first digit, and so on.	
     * @param dec is the decimal value to be converted into the binary system.
     * @return bin is the binary value corresponding to the decimal value in the binary system.
     ***/
	decimalToBinary:function(dec)
	{
		var bin = ""
		while (dec != 0) {
			var rest = dec % 2;
			dec = Math.floor(dec / 2);
			bin = rest + bin;
		}
		// if the byte string length is less than 8, prefix it with 0´s
		while(bin.length < 8) {
			bin = "0" + bin;
		}
		return bin;
	},
    /***
	 * Calculates the decimal value of the binary string.
	 * The decimal number is simply multiplied by 2 after each digit and the respective value of the digit (0 or 1) is added to it.
	 * @param binstr The binary string to be converted to the decimal system.
	 * @return dec the decimal number,
	 */
	binaryToDecimal:function(binstr) {
		var dec = 0;
		for (var i = 0; i < binstr.length; i++) {
			dec = dec * 2 + parseInt(binstr[i]);
		}
		return dec;
	},
	
    /***
	 * Calculates the network address and the broadcast address!
	 * The IP is set to 0 or 1 from the position of the suffix! (0 for networkadress, 1 for broadcast)
	 */
	calculateNwAndBcAdress:function()
	{
		var sf = subnetting.data.suffix;
		var nwAdressBinstr = "";
		var bcAdressBinstr = "";
		var ipBinstr = subnetting.data.ipBinOctets.join("");
		for (var i = 0; i < ipBinstr.length; i++) {
			if (i < sf) {
				nwAdressBinstr += ipBinstr[i];
				bcAdressBinstr += ipBinstr[i];
			} else {
				nwAdressBinstr += "0";
				bcAdressBinstr += "1";
			}
		}
		subnetting.data.netzBinOctets[0] = nwAdressBinstr.substr(0,8);
		subnetting.data.netzBinOctets[1] = nwAdressBinstr.substr(8,8);
		subnetting.data.netzBinOctets[2] = nwAdressBinstr.substr(16,8);
		subnetting.data.netzBinOctets[3] = nwAdressBinstr.substr(24,8);
		
		subnetting.data.netzDecOctets[0] = subnetting.binaryToDecimal(subnetting.data.netzBinOctets[0]);
		subnetting.data.netzDecOctets[1] = subnetting.binaryToDecimal(subnetting.data.netzBinOctets[1]);
		subnetting.data.netzDecOctets[2] = subnetting.binaryToDecimal(subnetting.data.netzBinOctets[2]);
		subnetting.data.netzDecOctets[3] = subnetting.binaryToDecimal(subnetting.data.netzBinOctets[3]);
		
		subnetting.data.broadBinOctets[0] = bcAdressBinstr.substr(0,8);
		subnetting.data.broadBinOctets[1] = bcAdressBinstr.substr(8,8);
		subnetting.data.broadBinOctets[2] = bcAdressBinstr.substr(16,8);
		subnetting.data.broadBinOctets[3] = bcAdressBinstr.substr(24, 8);

		subnetting.data.broadDecOctets[0] = subnetting.binaryToDecimal(subnetting.data.broadBinOctets[0]);
		subnetting.data.broadDecOctets[1] = subnetting.binaryToDecimal(subnetting.data.broadBinOctets[1]);
		subnetting.data.broadDecOctets[2] = subnetting.binaryToDecimal(subnetting.data.broadBinOctets[2]);
		subnetting.data.broadDecOctets[3] = subnetting.binaryToDecimal(subnetting.data.broadBinOctets[3]);
	},
	
	doCalculations:function(ip, sf) {
		subnetting.extractOctets(ip);
		subnetting.calculateSubnetmask(sf);
		subnetting.calculatePossibilities(sf);
		subnetting.calculateNwAndBcAdress();
		
		/* Inner HTML change leads to reset of the Event listener!*/
		document.body.innerHTML += 
		"<div style='display:inline-block; padding:20px; box-sizing:border-box;'><p>IP: "+subnetting.data.ipDecOctets.join(".")+"</p>" +
		"<p>SUBNETMASK: "+subnetting.data.subDecOctets.join(".")+"</p>" + 
		"<p>NETWORKADDRESS: "+subnetting.data.netzDecOctets.join(".")+"</p>" +
		"<p>BROADCASTADDRESS: "+subnetting.data.broadDecOctets.join(".")+"</p>" +
		"<p>POSSIBLE IP´s: "+subnetting.data.possibilities+"</p></div>";
		addEventListeners();
	}
}

window.onload = function(){
	addEventListeners();
}

function addEventListeners(){
	document.getElementById("calc").addEventListener("click", function(){
		var ip = document.getElementById("ip").value;
		var suffix = parseInt(document.getElementById("suffix").value);
		subnetting.doCalculations(ip, suffix);
	});
}