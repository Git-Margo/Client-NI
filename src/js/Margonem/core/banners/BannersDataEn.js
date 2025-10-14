export const BannersDataEn = {};

// export const BannersDataEn = {
// 	1: {
// 		lvl: [30, 700],
// 		btn: [{
// 			title: _t('premium_shop'),
// 			clb: () => Engine.banners.openPremiumShop(165)
// 		}]
// 	},
// 	2: {
// 		lvl: [20, 150],
// 	},
// 	3: {
// 		lvl: [40, 500],
// 	},
// 	4: {
// 		lvl: [20, 240],
// 		btn: [{
// 			title: _t('check'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/subcat/view,10')
// 		}]
// 	},
// 	5: {
// 		lvl: [10, 100],
// 		btn: [{
// 			title: _t('try_it_out'),
// 			clb: () => Engine.banners.openLink('https://margonem.com/art/view,2')
// 		}]
// 	},
// 	6: {
// 		lvl: [20, 500],
// 		btn: [{
// 			title: _t('get_draconite'),
// 			clb: () => Engine.banners.openLink('https://margonem.com/draconite')
// 		}]
// 	},
// 	7: {
// 		lvl: [10, 500],
// 		btn: [{
// 			title: _t('buy_gold'),
// 			clb: () => {
// 				if (!Engine.goldShop) _g('creditshop&credits_gold=-1');
// 				else Engine.goldShop.hide();
// 			}
// 		}]
// 	},
// 	8: {
// 		lvl: [10, 150],
// 		btn: [{
// 			title: _t('try_it_out'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/topic/view,2151,1')
// 		}]
// 	},
// 	9: {
// 		lvl: [20, 500],
// 	},
// 	10: {
// 		lvl: [35, 280],
// 	},
// 	12: {
// 		lvl: [30, 500],
// 	},
// 	13: {
// 		lvl: [20, 100],
// 	},
// 	14: false,
// 	15: {
// 		lvl: [40, 100],
// 	},
// 	16: {
// 		lvl: [20, 150],
// 	},
// 	17: {
// 		lvl: [20, 80],
// 	},
// 	18: {
// 		lvl: [40, 150],
// 	},
// 	20: {
// 		lvl: [50, 200],
// 	},
// 	21: false,
// 	22: false,
// 	24: {
// 		lvl: [20, 500],
// 		btn: [{
// 			title: _t('premium_shop'),
// 			clb: () => Engine.banners.openPremiumShop(166)
// 		}]
// 	},
// 	25: {
// 		lvl: [20, 500],
// 	},
// 	26: {
// 		lvl: [25, 100],
// 	},
// 	27: false,
// 	28: {
// 		lvl: [50, 500],
// 	},
// 	29: {
// 		lvl: [10, 200],
// 		btn: [{
// 			title: _t('try_it_out'),
// 			clb: () => Engine.hero.getOutfits()
// 		}]
// 	},
// 	30: false,
// 	31: {
// 		lvl: [10, 150],
// 	},
// 	32: {
// 		lvl: [10, 150],
// 	},
// 	33: false,
// 	34: {
// 		lvl: [10, 500],
// 	},
// 	35: {
// 		lvl: [20, 500],
// 	},
// 	36: {
// 		lvl: [10, 500],
// 	},
// 	37: {
// 		lvl: [25, 500],
// 	},
// 	38: {
// 		lvl: [20, 500],
// 	},
// 	39: false,
// 	40: {
// 		lvl: [10, 150],
// 	},
// 	41: {
// 		lvl: [10, 100],
// 	},
// 	42: {
// 		lvl: [25, 500],
// 	},
// 	43: {
// 		lvl: [20, 500],
// 	},
// 	44: {
// 		lvl: [45, 500],
// 	},
// 	45: {
// 		lvl: [30, 500],
// 	},
// 	46: {
// 		lvl: [10, 200],
// 	},
// 	47: {
// 		lvl: [10, 200],
// 		btn: [{
// 			title: _t('try_it_out'),
// 			clb: () => {
// 				if (!Engine.crafting.opened) Engine.crafting.open('enhancement');
// 				else Engine.crafting.close();
// 			}
// 		}]
// 	},
// 	49: {
// 		lvl: [10, 300],
// 		btn: [{
// 			title: _t('visit_steam'),
// 			clb: () => Engine.banners.openLink('https://store.steampowered.com/app/898590/Margonem/')
// 		}]
// 	},
// 	50: {
// 		lvl: [10, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/topic/view,2626,1')
// 		}]
// 	},
// 	51: {
// 		lvl: [10, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/subcat/view,10')
// 		}]
// 	},
// 	52: {
// 		lvl: [10, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/topic/view,2526,1')
// 		}]
// 	},
// 	53: {
// 		lvl: [10, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/subcat/view,13')
// 		}]
// 	},
// 	54: {
// 		lvl: [10, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/subcat/view,16')
// 		}]
// 	},
// 	55: {
// 		lvl: [23, 49],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27731')
// 		}]
// 	},
// 	56: {
// 		lvl: [50, 76],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27732')
// 		}]
// 	},
// 	57: {
// 		lvl: [77, 103],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27733')
// 		}]
// 	},
// 	58: {
// 		lvl: [104, 130],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27734')
// 		}]
// 	},
// 	59: {
// 		lvl: [131, 157],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27735')
// 		}]
// 	},
// 	60: {
// 		lvl: [158, 184],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27736')
// 		}]
// 	},
// 	61: {
// 		lvl: [185, 211],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27737')
// 		}]
// 	},
// 	62: {
// 		lvl: [212, 238],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27738')
// 		}]
// 	},
// 	63: {
// 		lvl: [239, 265],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27739')
// 		}]
// 	},
// 	64: {
// 		lvl: [266, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27740')
// 		}]
// 	},
// 	65: {
// 		lvl: [38, 64],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27690')
// 		}]
// 	},
// 	66: {
// 		lvl: [57, 83],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27691')
// 		}]
// 	},
// 	67: {
// 		lvl: [88, 114],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27692')
// 		}]
// 	},
// 	68: {
// 		lvl: [118, 144],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27694')
// 		}]
// 	},
// 	69: {
// 		lvl: [141, 167],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27695')
// 		}]
// 	},
// 	70: {
// 		lvl: [164, 190],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27696')
// 		}]
// 	},
// 	71: {
// 		lvl: [191, 217],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27697')
// 		}]
// 	},
// 	72: {
// 		lvl: [218, 244],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27698')
// 		}]
// 	},
// 	73: {
// 		lvl: [245, 271],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27699')
// 		}]
// 	},
// 	74: {
// 		lvl: [287, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 		}]
// 	},
// 	75: {
// 		lvl: [15, 34],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27776')
// 		}]
// 	},
// 	76: {
// 		lvl: [20, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27777')
// 		}]
// 	},
// 	77: {
// 		lvl: [30, 48],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27778')
// 		}]
// 	},
// 	78: {
// 		lvl: [35, 58],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27781')
// 		}]
// 	},
// 	79: {
// 		lvl: [40, 63],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27782')
// 		}]
// 	},
// 	80: {
// 		lvl: [50, 76],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27783')
// 		}]
// 	},
// 	81: {
// 		lvl: [60, 87],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27784')
// 		}]
// 	},
// 	82: {
// 		lvl: [70, 98],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27785')
// 		}]
// 	},
// 	83: {
// 		lvl: [90, 113],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27786')
// 		}]
// 	},
// 	84: {
// 		lvl: [105, 129],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27787')
// 		}]
// 	},
// 	85: {
// 		lvl: [110, 136],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27788')
// 		}]
// 	},
// 	86: {
// 		lvl: [115, 142],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27789')
// 		}]
// 	},
// 	87: {
// 		lvl: [130, 157],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27790')
// 		}]
// 	},
// 	88: {
// 		lvl: [142, 170],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27791')
// 		}]
// 	},
// 	89: {
// 		lvl: [155, 178],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27792')
// 		}]
// 	},
// 	90: {
// 		lvl: [170, 197],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27793')
// 		}]
// 	},
// 	91: {
// 		lvl: [180, 210],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27794')
// 		}]
// 	},
// 	92: {
// 		lvl: [190, 223],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27795')
// 		}]
// 	},
// 	93: {
// 		lvl: [210, 240],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27797')
// 		}]
// 	},
// 	94: {
// 		lvl: [230, 255],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27798')
// 		}]
// 	},
// 	95: {
// 		lvl: [240, 500],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27799')
// 		}]
// 	},
// 	96: {
// 		lvl: [255, 500],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27800')
// 		}]
// 	},
// 	97: {
// 		lvl: [265, 500],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27801')
// 		}]
// 	},
// 	98: {
// 		lvl: [35, 53],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27779')
// 		}]
// 	},
// 	99: {
// 		lvl: [40, 58],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27780')
// 		}]
// 	},
// 	100: {
// 		lvl: [200, 223],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27796')
// 		}]
// 	},
// 	101: {
// 		lvl: [260, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27802')
// 		}]
// 	},
// 	102: {
// 		lvl: [30, 300],
// 	},
// 	103: {
// 		lvl: [10, 300],
// 	},
// 	104: {
// 		lvl: [50, 300],
// 	},
// 	105: false,
// 	106: {
// 		lvl: [30, 250],
// 	},
// 	107: false,
// 	108: false,
// 	109: {
// 		lvl: [30, 70],
// 	},
// 	110: {
// 		lvl: [210, 300],
// 	},
// 	111: false,
// 	112: {
// 		lvl: [100, 300],
// 	},
// 	113: {
// 		lvl: [10, 300],
// 	},
// 	114: {
// 		lvl: [25, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27759')
// 		}]
// 	},
// 	115: {
// 		lvl: [25, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27759')
// 		}]
// 	},
// 	116: {
// 		lvl: [50, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27757')
// 		}]
// 	},
// 	117: {
// 		lvl: [266, 300],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27755')
// 		}]
// 	},
// 	118: {
// 		lvl: [103, 129],
// 		btn: [{
// 			title: _t('visit_forum'),
// 			clb: () => Engine.banners.openLink('https://forum.margonem.com/post/view,27693')
// 		}]
// 	},
// 	119: false,
// 	120: {
// 		lvl: [30, 300],
// 	},
// 	121: false,
// 	122: {
// 		lvl: [25, 250],
// 	},
// 	123: {
// 		lvl: [25, 150],
// 	},
// 	124: {
// 		lvl: [15, 300],
// 	},
// 	125: {
// 		lvl: [25, 300],
// 	},
// 	126: {
// 		lvl: [10, 300],
// 	},
// 	127: false,
// };