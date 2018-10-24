this.onmessage = function(e) {
	var data = e.data;
	var map = data.map;
	var my = data.my;
	var depth = data.depth;
	var mans = {};
	var bylaw = {
		rook: function(map, y, x, my) {
			var pace = [];
			//右
			for (var i = x + 1; i < 8; i++) {
				if (map[y][i]) {
					if (mans[map[y][i]].my !== my) {
						pace.push({
							x: i,
							y: y
						});
					}
					break;
				} else {
					pace.push({
						x: i,
						y: y
					});
				}
			}
			//左
			for (var i = x - 1; i >= 0; i--) {
				if (map[y][i]) {
					if (mans[map[y][i]].my !== my) {
						pace.push({
							x: i,
							y: y
						});
					}
					break;
				} else {
					pace.push({
						x: i,
						y: y
					});
				}
			}
			//上
			for (var i = y + 1; i < 8; i++) {
				if (map[i][x]) {
					if (mans[map[i][x]].my !== my) {
						pace.push({
							x: x,
							y: i
						});
					}
					break;
				} else {
					pace.push({
						x: x,
						y: i
					});
				}
			}
			//下
			for (var i = y - 1; i >= 0; i--) {
				if (map[i][x]) {
					if (mans[map[i][x]].my !== my) {
						pace.push({
							x: x,
							y: i
						});
					}
					break;
				} else {
					pace.push({
						x: x,
						y: i
					});
				}
			}
			return pace;
		},
		knight: function(map, y, x, my) {
			var pace = [];

			if (y - 2 >= 0 && x + 1 <= 7 && (!mans[map[y - 2][x + 1]] || mans[map[y - 2][x + 1]].my !== my)) {
				pace.push({
					x: x + 1,
					y: y - 2
				})
			};
			if (y - 1 >= 0 && x + 2 <= 7 && (!mans[map[y - 1][x + 2]] || mans[map[y - 1][x + 2]].my !== my)) {
				pace.push({
					x: x + 2,
					y: y - 1
				})
			};
			if (y + 1 <= 7 && x + 2 <= 7 && (!mans[map[y + 1][x + 2]] || mans[map[y + 1][x + 2]].my !== my)) {
				pace.push({
					x: x + 2,
					y: y + 1
				})
			};
			if (y + 2 <= 7 && x + 1 <= 7 && (!mans[map[y + 2][x + 1]] || mans[map[y + 2][x + 1]].my !== my)) {
				pace.push({
					x: x + 1,
					y: y + 2
				})
			};
			if (y + 2 <= 7 && x - 1 >= 0 && (!mans[map[y + 2][x - 1]] || mans[map[y + 2][x - 1]].my !== my)) {
				pace.push({
					x: x - 1,
					y: y + 2
				})
			};
			if (y + 1 <= 7 && x - 2 >= 0 && (!mans[map[y + 1][x - 2]] || mans[map[y + 1][x - 2]].my !== my)) {
				pace.push({
					x: x - 2,
					y: y + 1
				})
			};
			if (y - 1 >= 0 && x - 2 >= 0 && (!mans[map[y - 1][x - 2]] || mans[map[y - 1][x - 2]].my !== my)) {
				pace.push({
					x: x - 2,
					y: y - 1
				})
			};
			if (y - 2 >= 0 && x - 1 >= 0 && (!mans[map[y - 2][x - 1]] || mans[map[y - 2][x - 1]].my !== my)) {
				pace.push({
					x: x - 1,
					y: y - 2
				})
			};
			return pace;
		},
		bishop: function(map, y, x, my) {
			var pace = [];
			// 右下
			for (var i = x + 1, j = y + 1; i <= 7 && j <= 7; i++, j++) {
				if (map[j][i]) {
					if (mans[map[j][i]].my !== my) {
						pace.push({
							x: i,
							y: j
						});
					}
					break;
				} else {
					pace.push({
						x: i,
						y: j
					});
				}
			}
			// 左下
			for (var i = x - 1, j = y + 1; i >= 0 && j <= 7; i--, j++) {
				if (map[j][i]) {
					if (mans[map[j][i]].my !== my) {
						pace.push({
							x: i,
							y: j
						});
					}
					break;
				} else {
					pace.push({
						x: i,
						y: j
					});
				}
			}
			// 右上
			for (var i = x + 1, j = y - 1; i <= 7 && j >= 0; i++, j--) {
				if (map[j][i]) {
					if (mans[map[j][i]].my !== my) {
						pace.push({
							x: i,
							y: j
						});
					}
					break;
				} else {
					pace.push({
						x: i,
						y: j
					});
				}
			}
			// 左上
			for (var i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
				if (map[j][i]) {
					if (mans[map[j][i]].my !== my) {
						pace.push({
							x: i,
							y: j
						});
					}
					break;
				} else {
					pace.push({
						x: i,
						y: j
					});
				}
			}

			return pace;
		},
		queen: function(map, y, x, my) {
			var pace = [];
			//右
			for (var i = x + 1; i < 8; i++) {
				if (map[y][i]) {
					if (mans[map[y][i]].my !== my) {
						pace.push({
							x: i,
							y: y
						});
					}
					break;
				} else {
					pace.push({
						x: i,
						y: y
					});
				}
			}
			//左
			for (var i = x - 1; i >= 0; i--) {
				if (map[y][i]) {
					if (mans[map[y][i]].my !== my) {
						pace.push({
							x: i,
							y: y
						});
					}
					break;
				} else {
					pace.push({
						x: i,
						y: y
					});
				}
			}
			//上
			for (var i = y + 1; i < 8; i++) {
				if (map[i][x]) {
					if (mans[map[i][x]].my !== my) {
						pace.push({
							x: x,
							y: i
						});
					}
					break;
				} else {
					pace.push({
						x: x,
						y: i
					});
				}
			}
			//下
			for (var i = y - 1; i >= 0; i--) {
				if (map[i][x]) {
					if (mans[map[i][x]].my !== my) {
						pace.push({
							x: x,
							y: i
						});
					}
					break;
				} else {
					pace.push({
						x: x,
						y: i
					});
				}
			}

			// 右下
			for (var i = x + 1, j = y + 1; i <= 7 && j <= 7; i++, j++) {
				if (map[j][i]) {
					if (mans[map[j][i]].my !== my) {
						pace.push({
							x: i,
							y: j
						});
					}
					break;
				} else {
					pace.push({
						x: i,
						y: j
					});
				}
			}
			// 左下
			for (var i = x - 1, j = y + 1; i >= 0 && j <= 7; i--, j++) {
				if (map[j][i]) {
					if (mans[map[j][i]].my !== my) {
						pace.push({
							x: i,
							y: j
						});
					}
					break;
				} else {
					pace.push({
						x: i,
						y: j
					});
				}
			}
			// 右上
			for (var i = x + 1, j = y - 1; i <= 7 && j >= 0; i++, j--) {
				if (map[j][i]) {
					if (mans[map[j][i]].my !== my) {
						pace.push({
							x: i,
							y: j
						});
					}
					break;
				} else {
					pace.push({
						x: i,
						y: j
					});
				}
			}
			// 左上
			for (var i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
				if (map[j][i]) {
					if (mans[map[j][i]].my !== my) {
						pace.push({
							x: i,
							y: j
						});
					}
					break;
				} else {
					pace.push({
						x: i,
						y: j
					});
				}
			}
			return pace;
		},
		king: function(map, y, x, my) {
			var pace = [];
			// 右上
			if (y - 1 >= 0 && x + 1 <= 7 && (!mans[map[y - 1][x + 1]] || mans[map[y - 1][x + 1]].my !== my)) {
				pace.push({
					x: x + 1,
					y: y - 1
				})
			};
			// 右下
			if (y + 1 <= 7 && x + 1 <= 7 && (!mans[map[y + 1][x + 1]] || mans[map[y + 1][x + 1]].my !== my)) {
				pace.push({
					x: x + 1,
					y: y + 1
				})
			};
			// 左上
			if (y - 1 >= 0 && x - 1 >= 0 && (!mans[map[y - 1][x - 1]] || mans[map[y - 1][x - 1]].my !== my)) {
				pace.push({
					x: x - 1,
					y: y - 1
				})
			};
			// 左下
			if (y + 1 <= 7 && x - 1 >= 0 && (!mans[map[y + 1][x - 1]] || mans[map[y + 1][x - 1]].my !== my)) {
				pace.push({
					x: x - 1,
					y: y + 1
				})
			};
			// 右
			if (y >= 0 && x + 1 <= 7 && (!mans[map[y][x + 1]] || mans[map[y][x + 1]].my !== my)) {
				pace.push({
					x: x + 1,
					y: y
				})
			};
			// 左
			if (y <= 7 && x - 1 >= 0 && (!mans[map[y][x - 1]] || mans[map[y][x - 1]].my !== my)) {
				pace.push({
					x: x - 1,
					y: y
				})
			};
			// 上
			if (y - 1 >= 0 && x >= 0 && (!mans[map[y - 1][x]] || mans[map[y - 1][x]].my !== my)) {
				pace.push({
					x: x,
					y: y - 1
				})
			};
			// 下
			if (y + 1 <= 7 && x >= 0 && (!mans[map[y + 1][x]] || mans[map[y + 1][x]].my !== my)) {
				pace.push({
					x: x,
					y: y + 1
				})
			};
			return pace;
		},
		pawn: function(map, y, x, my) {
			var pace = [];
			if (my === true) {
				// 右上
				if (y - 1 >= 0 && x + 1 <= 7 && (mans[map[y - 1][x + 1]] && mans[map[y - 1][x + 1]].my !== my)) {
					pace.push({
						x: x + 1,
						y: y - 1
					})
				};
				// 左上
				if (y - 1 >= 0 && x - 1 >= 0 && (mans[map[y - 1][x - 1]] && mans[map[y - 1][x - 1]].my !== my)) {
					pace.push({
						x: x - 1,
						y: y - 1
					})
				};
				// 上
				if (y - 1 >= 0 && x >= 0 && (!mans[map[y - 1][x]])) {
					pace.push({
						x: x,
						y: y - 1
					})
				};
			} else {
				// 右下
				if (y + 1 <= 7 && x + 1 <= 7 && (mans[map[y + 1][x + 1]] && mans[map[y + 1][x + 1]].my !== my)) {
					pace.push({
						x: x + 1,
						y: y + 1
					})
				};
				// 左下
				if (y + 1 <= 7 && x - 1 <= 7 && (mans[map[y + 1][x - 1]] && mans[map[y + 1][x - 1]].my !== my)) {
					pace.push({
						x: x - 1,
						y: y + 1
					})
				};
				// 下
				if (y + 1 <= 7 && x >= 0 && (!mans[map[y + 1][x]])) {
					pace.push({
						x: x,
						y: y + 1
					})
				};
			}

			// // 右
			// if (y >= 0 && x + 1 <= 7 && (!mans[map[y][x + 1]] || mans[map[y][x + 1]].my !== my)) {
			// 	pace.push({
			// 		x: x + 1,
			// 		y: y
			// 	})
			// };
			// // 左
			// if (y <= 7 && x - 1 >= 0 && (!mans[map[y][x - 1]] || mans[map[y][x - 1]].my !== my)) {
			// 	pace.push({
			// 		x: x - 1,
			// 		y: y
			// 	})
			// };
			return pace;
		}
	}

	var value = {};

	value.pawn = [
		[100, 100, 100, 100, 100, 100, 100, 100],
		[75, 75, 75, 75, 75, 75, 75, 75],
		[35, 35, 45, 55, 55, 45, 35, 35],
		[30, 30, 35, 40, 40, 35, 30, 30],
		[25, 25, 25, 35, 35, 25, 25, 25],
		[20, 20, 20, 25, 25, 20, 20, 20],
		[15, 15, 15, 15, 15, 15, 15, 15],
		[0, 0, 0, 0, 0, 0, 0, 0]
	]

	value.knight = [
		[80, 100, 100, 100, 100, 100, 100, 80],
		[80, 90, 100, 100, 100, 100, 90, 80],
		[90, 100, 105, 110, 110, 105, 100, 90],
		[95, 105, 110, 115, 115, 110, 105, 95],
		[95, 105, 110, 115, 115, 110, 105, 95],
		[90, 100, 105, 110, 110, 105, 100, 90],
		[80, 90, 100, 100, 100, 100, 90, 80],
		[80, 100, 100, 100, 100, 100, 100, 80],
	]

	value.bishop = [
		[75, 85, 85, 85, 85, 85, 85, 75],
		[85, 95, 95, 95, 95, 95, 95, 85],
		[85, 95, 100, 105, 105, 100, 95, 85],
		[85, 100, 100, 105, 105, 100, 100, 85],
		[85, 95, 105, 105, 105, 105, 95, 85],
		[85, 105, 105, 105, 105, 105, 105, 85],
		[85, 100, 95, 95, 95, 95, 100, 85],
		[75, 85, 85, 85, 85, 85, 85, 75]
	]

	value.rook = [
		[90, 95, 95, 95, 95, 95, 95, 90],
		[85, 85, 85, 85, 85, 85, 85, 85],
		[80, 85, 95, 95, 95, 95, 85, 80],
		[80, 85, 95, 105, 105, 95, 85, 80],
		[80, 85, 95, 105, 105, 95, 85, 80],
		[80, 85, 95, 95, 95, 95, 85, 80],
		[85, 85, 85, 85, 85, 85, 85, 85],
		[85, 85, 85, 90, 90, 85, 85, 85]
	]

	value.queen = [
		[155, 165, 165, 170, 170, 165, 165, 155],
		[165, 175, 175, 175, 175, 175, 175, 165],
		[165, 175, 180, 180, 180, 180, 175, 165],
		[170, 175, 180, 180, 180, 180, 175, 170],
		[170, 175, 180, 180, 180, 180, 175, 170],
		[165, 180, 180, 180, 180, 180, 180, 165],
		[165, 175, 175, 175, 175, 175, 175, 165],
		[155, 165, 165, 165, 165, 165, 165, 155]
	]

	value.king = [
		[500, 500, 500, 500, 500, 500, 500, 500],
		[500, 500, 500, 500, 500, 500, 500, 500],
		[500, 500, 500, 500, 500, 500, 500, 500],
		[500, 500, 500, 500, 500, 500, 500, 500],
		[500, 500, 500, 500, 500, 500, 500, 500],
		[500, 500, 500, 500, 500, 500, 500, 500],
		[500, 500, 500, 500, 500, 500, 500, 500],
		[500, 500, 500, 500, 500, 500, 500, 500]
	]

	function chessman(y, x) {
		this.checked = false;
		this.goto = function(y, x, fn) {
			delete map[this.y][this.x];
			var eat = map[y][x];
			map[y][x] = this.key;

			this.checked = false;
			this.y = y;
			this.x = x;
			fn && fn(eat);
			return eat;
		}
		this.check = function() {
			if (preman) {
				preman.checked = false;
			}
			pace = this.pace(this.y, this.x);
			this.paces = pace;
			preman = this;
			this.checked = true;
		}
		this.ablego = function(y, x) {
			var v;
			for (var i in this.paces) {
				v = this.paces[i];
				if (v.y === y && v.x === x) {
					return true;
				}
			}
			return false;
		}
	}


	function initChess() {
		for (var y = 0; y < 8; y++) {
			for (var x = 0; x < 8; x++) {
				var z = map[y][x];
				if (z) {
					var info = z.split('_');
					var man = new chessman();
					man.x = x;
					man.y = y;
					man.my = info[0] === 'white';
					man.type = info[1];
					man.key = z;
					man.value = man.my ? value[man.type] : value[man.type].slice().reverse();
					man.val = function() {
						return this.value[this.y][this.x];
					}
					man.pace = function() {
						return bylaw[this.type](map, this.y, this.x, this.my);
					}
					mans[z] = man;
				}
			}
		}
	}

	initChess();

	function getValue(my) {
		var val = 0;
		for (var y = 0; y < 8; y++) {
			for (var x = 0; x < 8; x++) {
				var z = map[y][x];
				if (z) {
					man = mans[z];
					var v = man.value[y][x];
					if (man.my === my) {
						val += v;
					} else {
						val -= v;
					}
				}
			}
		}
		return val;
	}

	function getMans(my) {
		var mymans = [];
		for (var y = 0; y < 8; y++) {
			for (var x = 0; x < 8; x++) {
				var z = map[y][x];
				if (z) {
					man = mans[z];
					if (man.my === my) {
						mymans.push(man);
					}
				}
			}
		}
		return mymans;
	}

	var getAlphaBeta = function(A, B, depth, map, my) {
		var val;
		var bestpace;

		var mymans = getMans(my);
		for (var i in mymans) {
			var man = mymans[i];
			var paces = man.pace();
			for (var t in paces) {
				var pace = paces[t];
				var x = man.x;
				var y = man.y;
				var eat = man.goto(pace.y, pace.x);
				if (depth > 1) {
					var best = getAlphaBeta(-B, -A, depth - 1, map, !my);
					if (best) {
						val = -best.val
					} else {
						val = 9999;
					}
				} else {
					val = getValue(my);
				}

				man.goto(y, x);
				map[pace.y][pace.x] = eat;

				if (val >= B) {
					return {
						key: man.key,
						x: pace.y,
						y: pace.x,
						value: B
					}
				}
				if (val > A) {
					A = val;
					bestpace = {
						key: man.key,
						y: pace.y,
						x: pace.x,
						val: val
					}
				}
			}
		}
		return bestpace;
	}

	var bestpace = getAlphaBeta(-9999, 9999, depth, map, my);
	this.postMessage(bestpace);
}