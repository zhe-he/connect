import "../../css/wifi_help.scss";


let qrcode = "none"
let url = window.location.pathname.split("/")
if (url.length==4 && url[1]=="c") {
	qrcode = url[2]
}


_paq.push(['trackPageView','home', {dimensionQrCode: qrcode}]);

document.getElementById("download").onclick = ()=>{

	_paq.push([ 'trackEvent', 'Home', 'Click', '', '', {dimensionQrCode: qrcode} ]);
	document.getElementById("download").style.display="none";

}