const qs = Object.fromEntries(
	window.location.href.split('?')[1].split('&').map(v => v.split('=')));

export default qs;
