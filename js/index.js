const GAME_TITLE = 'センノユカリ～追憶の双蝶、泡沫の想ひ～';

window.onload = pageLoad;

// 前頁共通
function pageLoad(e) {
	document.title = GAME_TITLE;

	const elements = document.getElementsByClassName('game_title');

	for (const element of elements) {
		element.innerHTML = GAME_TITLE;
	}

	const key = getFileName();
	switch (key) {
		case 'product.html':
			break;

		case 'character.html':
			const tabDatas = {
				yuyuko: [
					'西行寺幽々子',
					true,
					`
						<div class="character_area">
							<img src="../resources/background.png" />
						</div>
					`,
				],
				yukari: [
					'八雲紫',
					false,
					`

					`,
				],
				youmu: [
					'魂魄妖夢',
					false,
					`

					`,
				],
			};

			tabContentsCreator('characters', tabDatas);
			break;

		default:
			break;
	}
}

function getFileName() {
	return window.location.href.split('/').pop();
}

function tabContentsCreator(tabIdName, tabValues, tabTitle = null) {
	const jsfc = new JavaScript_FunctionsCollections();
	const tabCard = document.querySelector(`.Tab_Card#${tabIdName}`);

	const tabHeader = document.createElement('div');
	const CardBody = document.createElement('div');

	tabHeader.classList.add('CardHeader', 'Tab_Header');
	if (tabTitle !== null && tabTitle !== '') {
		const title = document.createElement('p');
		title.classList.add('Title');
		title.innerHTML = tabTitle;
		tabHeader.appendChild(title);
	}

	CardBody.classList.add('CardBody', 'CardBody_Tab');
	for (let key in tabValues) {
		const tab_value = tabValues[key];

		const tabId = key;
		const tabName = tab_value[0];
		const tabInitActive = tab_value[1];
		const tabContent = tab_value[2];

		const tabButton = document.createElement('p');
		const tabContentArea = document.createElement('div');

		tabButton.classList.add('Tab_Button', tabInitActive ? 'active' : 'not_active');
		tabButton.id = `${tabId}_tab`;
		tabButton.innerHTML = tabName;
		tabButton.addEventListener('click', function (e) {
			const id = e.target.id;
			const data = jsfc.StrLeft(id, id.length - 4);
			const Tab_Contents_Elem = document.querySelectorAll(`#${tabIdName} .Tab_Contents`);
			const Tab_Button_Elem = document.querySelectorAll(`#${tabIdName} .Tab_Button`);

			for (i = 0; i < Tab_Contents_Elem.length; i++) {
				Tab_Contents_Elem[i].style.display = 'none';
			}
			document.getElementById(`${data}_content`).style.display = 'block';
			for (i = 0; i < Tab_Button_Elem.length; i++) {
				Tab_Button_Elem[i].classList.remove('active');
				Tab_Button_Elem[i].classList.add('not_active');
			}
			document.querySelector(`#${tabIdName} #${data}_tab`).classList.toggle('not_active');
			document.querySelector(`#${tabIdName} #${data}_tab`).classList.toggle('active');
			jsfc.triggerEvent(document.getElementById(`${data}_tab`), 'create');
		});
		tabHeader.appendChild(tabButton);

		tabContentArea.classList.add('Tab_Contents');
		tabContentArea.id = `${tabId}_content`;
		tabContentArea.style.display = tabInitActive ? 'block' : 'none';
		tabContentArea.innerHTML = tabContent;
		CardBody.appendChild(tabContentArea);
	}
	tabCard.appendChild(tabHeader);
	tabCard.appendChild(CardBody);
}
