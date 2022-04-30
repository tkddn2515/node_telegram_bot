import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { readExcel, writeExcel } from "./excel.js";
dotenv.config();
process.env.NTBA_FIX_319 = 1;

const token = process.env.TOKEN_KEY;

const bot = new TelegramBot(token, { polling: true });

const foodExcel = 'food.xlsx';
const foodExcelPath = `./${foodExcel}`;

bot.onText(/\/echo (.+)/, (msg, match) => {
	const chatId = msg.chat.id;
	const resp = match[1];

  if(resp.includes('찐찌버거') || resp.includes('도르마무') || resp.includes('돌마무') || resp.includes('한상우') || resp.includes('찐쯰버거')) {
	  bot.sendMessage(chatId, '헬라바보');
    return;
  }
	bot.sendMessage(chatId, resp);
});

bot.onText(/\/hungry/, (msg, match) => {
	const chatId = msg.chat.id;
	const jsonList = readExcel(foodExcel);

	const rand = getRandom(0, jsonList.length);

	bot.sendMessage(chatId, jsonList[rand].name);
	bot.sendMessage(chatId, jsonList[rand].position);
});

bot.onText(/\/addfood (.+)/, (msg, match) => {
  
  const chatId = msg.chat.id;
  console.log(match);
  if(!match[1] || typeof match[1] !== 'string') {
	  bot.sendMessage(chatId, 'please input /addfood {name}&{position}');
    return;
  }
  const food = match[1].split('&');
  if(!food || food.length != 2) {
	  bot.sendMessage(chatId, 'please input /addfood {name}&{position}');
    return;
  }

	const jsonList = readExcel(foodExcel);
  
  const id = jsonList.length + 1;
  const newJson = {
    id,
    name: food[0],
    position: food[1]
  };
	jsonList.push(newJson);

  writeExcel(foodExcelPath, jsonList);

  const newJsonList = readExcel(foodExcel);

	const last = newJsonList.length - 1;

  bot.sendMessage(chatId, 'success add new food');
  bot.sendMessage(chatId, jsonList[last].name);
	bot.sendMessage(chatId, jsonList[last].position);
});

bot.onText(/\/deletefood (.+)/, (msg, match) => {
  
  const chatId = msg.chat.id;
  if(!match[1] || typeof match[1] !== 'string') {
	  bot.sendMessage(chatId, 'please input /deletefood {name}');
    return;
  }
  const food = match[1];

	const jsonList = readExcel(foodExcel);
  let exist = false;

  for(let i = 0; i < jsonList.length; i++) {
    if(jsonList[i].name == food) {
      jsonList.splice(i, 1);
      i--;
      exist = true;
    }
  }

  if(exist) {
    writeExcel(foodExcelPath, jsonList);
    bot.sendMessage(chatId, `${food} is deleted!`);
  } else {
    bot.sendMessage(chatId, `${food} is not exist!`);
  }
  
});

bot.onText(/\/foodlist/, (msg, match) => {
  const chatId = msg.chat.id;
  
  // send json
	// const jsonList = readExcel(foodExcel);
  // const str = JSON.stringify(jsonList);
  // console.log(str);
  // bot.sendMessage(chatId, str);

  // send file
  bot.sendDocument(chatId, foodExcelPath);
});

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rand = Math.random() * (max - min);
  return Math.floor(rand) + min;
}

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, 'Received your message');
// });
