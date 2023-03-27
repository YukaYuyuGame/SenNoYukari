/**
 * JavaScript_FunctionsCollections
 *
 * @description JavaScriptのメソッド集
 */
class JavaScript_FunctionsCollections {
	/**
	 * Ajax通信する際のメソッド(jQuery方式)
	 *
	 * @module AjaxConnection
	 *
	 * @param {string} Path - *.php等のファイルパス
	 * @param {json} passData - 渡すデータ
	 * @param {boolean} splitSW - 配列に入れるかどうか
	 * @param {function} onDoned - 成功時のコールバック関数
	 *
	 * @returns {string or array} -  整形後のデータ
	 */
	AjaxConnection(Path = '', passData = '', splitSW = true, onDoned) {
		let returnData;

		$.ajax({
			async: false, //true(default): 非同期通信 | false: 同期通信
			cache: false, //true: キャッシュを利用する | false(default): キャッシュを利用しない
			data: passData, //ajax通信でデータを渡す
			method: 'POST', //POST(default) | GET
			url: Path,
		})
			.done((result, status, xhr) => {
				returnData = onDoned(splitSW ? this.DBReceiveDataToArray(result) : result);
			})
			.fail((error, status, xhr) => {
				alert('エラーが発生しました。\nエラーコード： コード' + xhr.status + '\n' + 'エラーステータス：  ' + status + '\n' + 'エラースロー：  ' + error.message);
			});

		return returnData;
	}

	/**
	 * Ajax通信する際のメソッド(XMLHttpRequest方式)
	 *
	 * @module AjaxConnectionNext
	 *
	 * @param {string} Path - *.php等のファイルパス
	 * @param {json} passData - 渡すデータ
	 * @param {boolean} splitSW - 配列に入れるかどうか
	 * @param {json} AuthorizationToken - 認証トークン
	 * @param {string} Method - 通信方式
	 * @param {function} onDoned - 成功時のコールバック関数
	 *
	 * @returns {string or array} -  整形後のデータ
	 */
	AjaxConnectionNext(Path = '', passData = '', splitSW = true, AuthorizationToken = '', Method = 'GET', onDoned) {
		let returnData;
		const req = new XMLHttpRequest();
		const async = false;

		req.onreadystatechange = () => {
			if (req.readyState == 4) {
				// 通信の完了時
				if (req.status == 200) {
					// 通信の成功時
					const data = onDoned(splitSW ? this.DBReceiveDataToArray(req.responseText) : req.responseText);
					returnData = data != null && data != undefined ? data : receiveData;
				}
			}
		};
		req.open(Method, Path, async);
		req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
		if (AuthorizationToken !== null && AuthorizationToken.length > 0) {
			req.setRequestHeader('Authorization', 'Bearer ' + AuthorizationToken);
		}
		req.send(passData);

		return returnData;
	}

	/**
	 * URLで[?xxx=1234]のGET通信で情報を取得するメソッド
	 *
	 * @module GetQueryString
	 *
	 * @param なし
	 *
	 * @return {dictionary} - 連想配列(キーとデータ)
	 */
	GetQueryString() {
		let result = {},
			searchData = window.location.search;

		if (1 < searchData.length) {
			searchData
				.substring(1)
				.split('&')
				.forEach((elem) => {
					elem = elem.split('=');
					result[decodeURIComponent(elem[0])] = decodeURIComponent(elem[1]);
				});
		}

		return result;
	}

	/**
	 * 日付の増減をするメソッド
	 *
	 * @module DateUpDownManagement
	 *
	 * @param {number} year - 年[デフォルト:今年]
	 * @param {number} month - 月[デフォルト:今月]
	 * @param {number} type - 1:年 / 2:月 / 3.日
	 * @param {number} IDVal - 増減値
	 *
	 * @returns {Object} - 0:(Date: date|増減後の日付データ) 1:(String: errMsg|エラーメッセージ)
	 */
	DateUpDownManagement(year = NOW_YEAR, month = NOW_MONTH, type = 2, IDVal = 1) {
		let dt = new Date(year, month, 1),
			obj = new Object(),
			errMsg = '';

		switch (type) {
			case 0: //Direct
				//直接指定のため、なし
				break;
			case 1: //Year
				dt.setFullYear(dt.getFullYear() + IDVal);
				break;
			case 2: //Month
				dt.setMonth(dt.getMonth() + IDVal);
				break;
			case 3: //Day
				dt.setDate(dt.getDate() + IDVal);
				break;
			default:
				errMsg = 'typeは0～3で設定してください。\n 0:Direct | 1:Year | 2:Month | 3:Day';
				break;
		}

		if (errMsg == '' && dt > MAX_DATE) {
			errMsg = 'これより先のカレンダーは存在しません。';
			dt = MAX_DATE;
		} else if (errMsg == '' && dt < MIN_DATE) {
			errMsg = 'これより前のカレンダーは存在しません。';
			dt = MIN_DATE;
		}

		obj.date = dt;
		obj.errMsg = errMsg;

		return obj;
	}

	/**
	 * 連番作成(Pythonのrangeに準拠)
	 *
	 * @module RangeCreator
	 *
	 * @param {number} start - 開始[デフォルト:0]
	 * @param {number} end - 終了[デフォルト:10]
	 * @param {number} step - 増減値[デフォルト: 1]
	 *
	 * @return {number[]} - 連番
	 */
	RangeCreator = (start = 0, end = 10, step = 1) => [...Array(Math.ceil((end - start + 1) / step))].map((_, i) => (i == 0 ? start : start + i * step));

	/**
	 * Dateを指定フォーマットで出力(表示形式はExcelに準拠)
	 * 参考1: https://next.rikunabi.com/journal/20170701_s01/
	 * 参考2: https://www.tipsfound.com/excel/03003
	 *
	 * @module DateTimeFormat
	 *
	 * @param {Date} date - 日付[デフォルト:今日]
	 * @param {string} format - フォーマット文字列[デフォルト: yyyy/MM/dd hh:mm:ss]
	 *
	 * @return {string} -フォーマット後の日付文字列
	 */
	DateTimeFormat = (date = NOW_DATE, format = 'yyyy/MM/dd HH:mm:ss') => {
		//月
		const MoS_s = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const MoS_l = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		//曜日
		const DoSj = ['日', '月', '火', '水', '木', '金', '土'];
		const DoSe_s = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const DoSe_l = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

		function T24HTo12H(Hour = NOW_HOUR, zpSW = true, japanSW = true) {
			const jsfc = new JavaScript_FunctionsCollections();

			return Hour >= 12 ? (japanSW ? '午後' : '') + jsfc.ZeroPadding(Hour - 12, zpSW ? 2 : 1) + (japanSW ? '' : 'p.m.') : (japanSW ? '午前' : '') + jsfc.ZeroPadding(Hour, zpSW ? 2 : 1) + (japanSW ? '' : 'a.m.');
		}

		return (
			format
				//年の表示形式
				.replace(/yyyy/, date.getFullYear())
				.replace(/yy/, this.StrRight(date.getFullYear().toString(), 2))
				//月の表示形式
				.replace(/MMMM/i, MoS_l[date.getMonth()])
				.replace(/MMM/i, MoS_s[date.getMonth()])
				.replace(/MM/, this.ZeroPadding(date.getMonth() + 1, 2))
				.replace(/M^(Mar|May|Mon)/, date.getMonth() + 1)
				//日の表示形式
				.replace(/dd/, this.ZeroPadding(date.getDate(), 2))
				.replace(/d^(Wed|day)/, date.getDate())
				//曜日の表示形式
				.replace(/dddd/, DoSe_l[date.getDay()])
				.replace(/ddd/, DoSe_s[date.getDay()])
				.replace(/aaaa/, DoSj[date.getDay()] + '曜日')
				.replace(/aaa/, DoSj[date.getDay()])
				//時間の表示形式
				.replace(/HH/, this.ZeroPadding(date.getHours(), 2))
				.replace(/H/, date.getHours())
				// .replace(/hh/, T24HTo12H(date.getHours(), true))
				// .replace(/h^(March|Thu)/, T24HTo12H(date.getHours(), false))
				//分の表示形式
				.replace(/mm/, this.ZeroPadding(date.getMinutes(), 2))
				.replace(/m^mber/, date.getMinutes())
				//秒の表示形式
				.replace(/ss/, this.ZeroPadding(date.getSeconds(), 2))
				.replace(/s^(August|Tuesday|Wednesday|Thursday)/, date.getSeconds())
		);
	};

	/**
	 * 切り上げ(ExcelのRoundUpに準拠)
	 * 参考: https://webllica.com/js-round-function/
	 *
	 * @module RoundUp
	 *
	 * @param {number} value - 数値
	 * @param {number} base - どの桁で切り上げをするか
	 *
	 * @return {number} - 切り上げ後の数字
	 */
	RoundUp = (value, digit = 0) => (Math.ceil(value * (value < 0 ? -1 : 1) * Math.pow(10, digit)) * sign) / Math.pow(10, digit);

	/**
	 * 四捨五入(ExcelのRoundに準拠)
	 * 参考: https://webllica.com/js-round-function/
	 *
	 * @module Round
	 *
	 * @param {number} value - 数値
	 * @param {number} base - どの桁で四捨五入をするか
	 *
	 * @return {number} - 四捨五入後の数字
	 */
	Round = (value, digit = 0) => Math.round(value * Math.pow(10, digit)) / Math.pow(10, digit);

	/**
	 * 切り捨て(ExcelのRoundDownに準拠)
	 * 参考: https://webllica.com/js-round-function/
	 *
	 * @module RoundDown
	 *
	 * @param {number} value - 数値
	 * @param {number} base - どの桁で切り捨てをするか
	 *
	 * @return {number} - 切り捨て後の数字
	 */
	RoundDown = (value, digit = 0) => Math.floor(value * Math.pow(10, digit)) / Math.pow(10, digit);

	/**
	 * 0埋め(整数)
	 *
	 * @module ZeroPadding
	 *
	 * @param {number} num - 0埋めする数字
	 * @param {number} length - 0埋めする長さ[デフォルト: 0]
	 *
	 * @return {string} - 0埋めした後の数字
	 */
	ZeroPadding = (num, length = 0) => ('0'.repeat(length) + num).slice(-length);

	/**
	 * 0埋め(Decimal)
	 *
	 * @module DecimalZeroPadding
	 *
	 * @param {decimal} num - 小数点以降に0を付ける数字]
	 * @param {decimal} num - 小数点以降に0を付けた後の数字(文字列)[デフォルト: 0]
	 *
	 * @return {string} - 0埋めした後の数字
	 */
	DecimalZeroPadding = (num, length = 0) => num.toFixed(length);

	/**
	 * うるう年判定
	 *
	 * @module IsLeapYear
	 *
	 * @param {number} year - うるう年判定する年[デフォルト:今年]
	 *
	 * @return {boolean} - true:うるう年 false:非うるう年
	 */
	IsLeapYear = (year = NOW_YEAR) => (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;

	/**
	 * 左から指定文字長分の文字列を抽出(ExcelのLeftに準拠)
	 *
	 * @module StrLeft
	 *
	 * @param {string} target - 文字列[デフォルト: 空白]
	 * @param {number} length - 抽出する文字長[デフォルト: 0]
	 *
	 * @return {string} - 抽出した文字列
	 */
	StrLeft = (target = '', length = 0) => target.substring(0, length);

	/**
	 * 右から指定文字長分の文字列を抽出(ExcelのRightに準拠)
	 *
	 * @module StrRight
	 *
	 * @param {string} target - 文字列[デフォルト: 空白]
	 * @param {number} length - 抽出する文字長[デフォルト: 0]
	 *
	 * @return {string} - 抽出した文字列
	 */
	StrRight = (target = '', length = 0) => target.substring(target.length - length, target.length);

	/**
	 * (左)指定位置から指定文字長分の文字列を抽出(ExcelのMidに準拠)
	 *
	 * @module StrMid
	 *
	 * @param {string} target - 文字列[デフォルト: 空白]
	 * @param {number} start - 開始位置[デフォルト: 0]
	 * @param {number} length - 抽出する文字長[デフォルト: 0]
	 *
	 * @return {string} - 抽出した文字列
	 */
	StrMid = (target = '', start = 0, length = 0) => {
		let startPos = start == 0 ? 0 : start - 1;
		return target.substring(startPos, startPos + length);
	};

	/**
	 * 月の最終日
	 *
	 * @module MonthLastDay
	 *
	 * @param {number} year - 年[デフォルト:今年]
	 * @param {number} month -月[デフォルト:今月]
	 *
	 * @return {number} - 月の最終日
	 */
	MonthLastDay = (year = NOW_YEAR, month = NOW_MONTH) => new Date(year, month, 0).getDate();

	/**
	 * テーブルの行列の入れ替え
	 *
	 * @module Transpose
	 *
	 * @param {array} tbl - 2次元配列以上
	 *
	 * @return {array} - 入れ替え後のテーブル
	 */
	Transpose = (tbl) => tbl[0].map((_, c) => tbl.map((r) => r[c]));

	/**
	 * バーコードスキャナーを起動
	 * BarcodeReaderAPI.jsが必要
	 *
	 * @module BarcodeScanner_ScanStart
	 *
	 * @param {function} callBack -バーコード読み込み後に処理する内容
	 *
	 * @return なし
	 */
	BarcodeScanner_ScanStart(callBack) {
		let code_repository = '',
			Qg = Quagga;

		Qg.init(
			{
				inputStream: {
					name: 'Live',
					type: 'LiveStream',
					target: document.getElementById('photo-area'),
				},
				decoder: {
					readers: ['ean_reader', 'ean_8_reader'],
				},
				constraints: {
					facingMode: 'environment',
				},
				area: {
					// defines rectangle of the detection/localization area
					top: '0%', // top offset
					right: '0%', // right offset
					left: '0%', // left offset
					bottom: '0%', // bottom offset
				},
				singleChannel: true, // true: only the red color-channel is read
			},
			(err) => {
				if (err) {
					// console.log('Error > ', err);
					return;
				}

				// console.log('Initialization finished. Ready to start');
				Qg.start();
				document.getElementsByClassName('drawingBuffer').innerHTML = '';
				// Set flag to is running
				_scannerIsRunning = true;
			}
		);

		//barcode read call back
		Qg.onDetected((result) => {
			let code = result.codeResult.code,
				fotmat = result.codeResult.format,
				checkresult = BarcodeScanner_CheckDigit_Calculator(code, fotmat);
			code_repository += `${code}\n`;
			if (StrLeft(code, 1) == '4' && checkresult) {
				BarcodeScanner_ScanStop(Qg);
				callBack(code);
			}
		});
	}

	/**
	 * バーコードスキャナーを停止
	 * BarcodeReaderAPI.jsが必要
	 *
	 * @module BarcodeScanner_ScanStop
	 *
	 * @param {Quagga} Qg - xxxx
	 *
	 * @return なし
	 */
	BarcodeScanner_ScanStop(Qg) {
		Qg.stop();
		// alert("・読み取りデータ> \n" + code_repository);
		document.getElementById('photo-area').innerHTML = '';
	}

	/**
	 * 読み取ったバーコードが正しいものか判定
	 *
	 * @module BarcodeScanner_CheckDigit_Calculator
	 *
	 * @param {string} Barcode - チェックするバーコード
	 * @param {string} CodeFotmat - バーコードの種類
	 *
	 * @return {boolean} - 判定結果
	 */
	BarcodeScanner_CheckDigit_Calculator(Barcode, CodeFotmat) {
		let result = false;

		switch (CodeFotmat) {
			case 'ean_13':
				switch (StrLeft(Barcode, 2)) {
					case '02':
						result = true;
						break;
					case '49':
						let oddsum = 0, //奇数
							evensum = 0; //偶数

						Barcode.split('').forEach((element, index, array) => {
							if (index < Barcode.length - 1) {
								index % 2 === 0 ? (evensum += +element) : (oddsum += +element);
							}
						});
						result = Barcode == StrLeft(Barcode, Barcode.length - 1) + StrRight(10 - StrRight(evensum * 3 + oddsum + '', 1) + '', 1);
						break;

					default:
						break;
				}

			default:
				break;
		}

		return result;
	}

	/**
	 * DBで取得したデータを配列に入れる
	 *
	 * @module DBReceiveDataToArray
	 *
	 * @param {string} data - DBで取得したデータ
	 *
	 * @return {string[]} - 二次元配列
	 */
	DBReceiveDataToArray(data) {
		let receiveData = data.split(';').map((value) => value.split(','));

		if (receiveData[receiveData.length] === '') {
			receiveData.pop();
		}

		return receiveData;
	}

	/**
	 * 文字列内を検索し、対象文字列があるか検索
	 *
	 * @module StringCheckExistence
	 *
	 * @param {string} str - 検索対象文字列
	 * @param {string} searchStr - 検索文字列
	 *
	 * @return {boolean} - 検索結果
	 */
	StringCheckExistence = (str, searchStr) => ~str.indexOf(searchStr);

	/**
	 * 指定時間後に処理実行
	 *
	 * @module DelayedCall
	 *
	 * @param {number} second - 指定時間
	 * @param {function} callBack - 処理実行する内容
	 *
	 * @return なし
	 */
	DelayedCall = (second, callBack) => setTimeout(callBack, second * 1000);

	/**
	 * 文字列をboolean化する
	 *
	 * @module stringToBoolean
	 *
	 * @param {string} data - boolean化する文字列
	 *
	 * @return {boolean} - 変換済みboolean
	 */
	StringToBoolean = (data) => data.toLowerCase() === 'true';

	/**
	 * 動的PDF作成
	 *
	 * @module DynamicPDFCreator
	 *
	 * @param {string} fileName - ファイル名
	 * @param {string} outputHTML - PDF化するHTML
	 *
	 * @return なし
	 */
	DynamicPDFCreator(fileName, outputHTML) {
		let f = document.createElement('form');
		f.method = 'POST';
		f.action = '../../../../WebApps_ApiCollections/v6/Php/API/TCPDF/tcpdf.php';
		f.innerHTML = '<p name="outputHTML">' + outputHTML + '</p><p name="fileName">' + fileName + '</p>';

		document.body.append(f);
		f.submit();
	}

	/**
	 * 対象が数字であるかチェック
	 *
	 * @module isNumber
	 *
	 * @param {string} value - チェック対象
	 *
	 * @return {boolean} - チェック結果
	 */
	isNumber = (value) => typeof value === 'number' && isFinite(value);

	/**
	 * 無理矢理イベントをトリガーさせる
	 *
	 * @module triggerEvent
	 *
	 * @param {element} element - イベントをトリガーさせる要素
	 * @param {string} event - トリガーするイベント
	 *
	 * @return なし
	 */
	triggerEvent = (element, event) =>
		element.dispatchEvent(
			new Event('commonEvent', {
				type: event,
				bubbles: true,
				cancelable: true,
			})
		);

	/**
	 * タグのプロパティを取得若しくは設定する
	 *
	 * @module Prop
	 *
	 * @param {string} node - HTML要素
	 * @param {string} name - タグに対するプロパティ
	 * @param {string} value - プロパティに設定する値
	 *
	 * @return {string} - プロパティ情報
	 */
	Prop(node, name, value) {
		if (typeof value === 'undefined') {
			return node[name];
		}
		node[name] = value;
	}

	/**
	 * 複数要素にイベントを付与
	 *
	 * @module elementsAddEvent
	 *
	 * @param {string} elementName - CSS記法
	 * @param {string} event - イベント名
	 * @param {function} process - 処理
	 *
	 * @return なし
	 */
	elementsAddEvent(elementName, event, process) {
		const nodelist = document.querySelectorAll(elementName);
		const elements = Array.prototype.slice.call(nodelist, 0);

		for (const element of elements) {
			element.addEventListener(event, process);
		}
	}

	/**
	 * 指定ページに移動
	 *
	 * @module pageMove
	 *
	 * @param {string} Url - 移動するURL
	 *
	 * @return なし
	 */
	pageMove = (Url) => (location.href = Url);

	/**
	 * 数値に変換可能かを判定(C#準拠)
	 *
	 * @module tryParsenumber
	 *
	 * @param {string} value - 数字文字列
	 *
	 * @return {boolean} - 数値変換可能か
	 */
	tryParsenumber = (value) => parseInt(value, 10) !== NaN;

	/**
	 * Clipboard APIを使用してクリップボードにテキストを送る。
	 *
	 * @module clipboardCopy
	 *
	 * @param {string} text - クリップボードに送る文字列
	 *
	 * @return boolean - コピー成否
	 */
	clipboardCopy = (text) => {
		if (!navigator.clipboard) {
			alert('クリップボードにコピーできませんでした');
			return false;
		}
		navigator.clipboard.writeText(text).then(
			() => alert('クリップボードにコピーしました'),
			() => alert('クリップボードにコピーできませんでした')
		);
		return true;
	};

	/**
	 * GPSデータを取得
	 *
	 * @module getGPSPosition
	 * @param なし
	 * @return {object} - GPSデータ
	 */
	getGPSPosition() {
		let positionArgs = new Object();

		if (typeof navigator.geolocation === 'undefined') {
			alert('ブラウザが位置情報取得に対応していません');
			return false;
		}

		var wOptions = {
			enableHighAccuracy: true,
			timeout: 10000,
			maximumAge: 0,
		};

		navigator.geolocation.getCurrentPosition(
			function (argPos) {
				positionArgs.latitude = argPos.coords.latitude;
				positionArgs.longitude = argPos.coords.longitude;
				positionArgs.accuracy = argPos.coords.accuracy;
				positionArgs.altitude = argPos.coords.altitude;
				positionArgs.altitudeAccuracy = argPos.coords.altitudeAccuracy;
				positionArgs.heading = argPos.coords.heading;
				positionArgs.speed = argPos.coords.speed;
			},
			function (argErr) {
				var wErrMsg = '';
				switch (argErr.code) {
					case 1:
						wErrMsg = '位置情報の利用が許可されていません';
						break;
					case 2:
						wErrMsg = 'デバイスの位置が判定できません';
						break;
					case 3:
						wErrMsg = 'タイムアウトしました';
						break;
				}
				if (wErrMsg == '') {
					wErrMsg = argErr.message;
				}

				alert(wErrMsg);
			},
			wOptions
		);

		return positionArgs;
	}

	/**
	 * 関数かどうかを判定
	 *
	 * @module IsFunctionChecker
	 *
	 * @param {object} functionName - 関数名
	 * @param {function} successCallBack - 成功時に実行する処理
	 * @param {function} failCallBack - 失敗時に実行する処理
	 *
	 * @return {object} - callBackから返却した値
	 */
	IsFunctionChecker(functionName, successCallBack, failCallBack) {
		let obj = new Object();

		obj.isFunction = typeof functionName === 'function';
		if (obj.isFunction) {
			obj.result = successCallBack();
		} else {
			if (failCallBack !== null && failCallBack !== undefined) {
				obj.result = failCallBack();
			}
		}

		return obj;
	}

	/**
	 *  サーバ上からjsonファイルを取得してjson化して貰う
	 *
	 * @module getJsonOnServer
	 *
	 * @param {string} url - jsonファイルURL
	 *
	 * @return {json} - jsonデータ
	 */
	getJsonOnServer(url) {
		const req = new XMLHttpRequest(); // XMLHttpRequest オブジェクトを生成する
		let result;

		req.onreadystatechange = function () {
			// XMLHttpRequest オブジェクトの状態が変化した際に呼び出されるイベントハンドラ
			if (req.readyState == 4 && req.status == 200) {
				// サーバーからのレスポンスが完了し、かつ、通信が正常に終了した場合
				result = JSON.parse(req.response);
			}
		};
		req.open('GET', url, false); // HTTPメソッドとアクセスするサーバーの　URL　を指定
		req.send(null); // 実際にサーバーへリクエストを送信

		return result;
	}

	/**
	 * HTMLを作成する
	 *
	 * @module HTMLCreator
	 *
	 * @param {number} startPos - 開始位置
	 * @param {number} endPos - 終了位置
	 * @param {string} beforeHTML - 前追加
	 * @param {string} insertHTML - 置き換え対象
	 * @param {string} afterHTML - 後追加
	 * @param {array} replaceSettings - 置き換え設定
	 *
	 * @return {string} -置き換え設定の設定後HTML
	 */
	HTMLCreator(startPos = 0, endPos = 0, beforeHTML = '', targetHTML = '', afterHTML = '', replaceSettings = []) {
		let createHTML = '';

		// 前置詞
		createHTML += beforeHTML;

		// 本体
		for (let i = startPos; i < endPos; i++) {
			createHTML += this.stringReplaces(startPos, endPos, i, targetHTML, replaceSettings);
		}

		// 後置詞
		createHTML += afterHTML;

		return createHTML;
	}

	/**
	 * 文字置き換え
	 *
	 * @module  stringReplaces
	 *
	 * @param {number} startPos - 開始位置
	 * @param {number} endPos - 終了位置
	 * @param {number} nowPos - 現在位置
	 * @param {string} targetString - 置き換え対象
	 * @param {array} replaceSettings - 置き換え設定
	 *
	 * @return {string} - 置き換え後文字
	 */
	stringReplaces(startPos = 0, endPos = 0, nowPos = 0, targetString = '', replaceSettings = []) {
		let replacedString = targetString;

		for (let key in replaceSettings) {
			replacedString = replacedString.replaceAll(key, () => {
				let values = replaceSettings[key];
				switch (typeof values) {
					case 'function':
						return values(startPos, endPos, nowPos);
					case 'number':
					case 'string':
						return values;

					default:
						console.log(`[DEBUG] values > `, typeof values);
						return key;
				}
			});
		}

		return replacedString;
	}
}

// インスタンス初期化
const jsfc = new JavaScript_FunctionsCollections();
