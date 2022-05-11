// process.env.NTBA_FIX_319 = 1
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { readExcel, writeExcel } from "./excel.js";
dotenv.config('./env');
process.env.NTBA_FIX_319 = 1;

const token = process.env.TOKEN_KEY;
console.log(token);
const bot = new TelegramBot(token, { polling: true });

const foodExcel = 'food.xlsx';
const foodExcelPath = `./${foodExcel}`;

bot.onText(/\/echo (.+)/, (msg, match) => {
	const chatId = msg.chat.id;
	const resp = match[1];

	bot.sendMessage(chatId, resp);
});

bot.onText(/\/h(ungry)?/, (msg, match) => {
	const chatId = msg.chat.id;
	const jsonList = readExcel(foodExcel);

  if(jsonList.length == 0) {
	  bot.sendMessage(chatId, 'There is no food list. Please add new food.');
  } else {
    const rand = getRandom(0, jsonList.length);
    bot.sendMessage(chatId, jsonList[rand].name);
    bot.sendMessage(chatId, jsonList[rand].position);
  }
});

bot.onText(/\/(addfood|af) (.+)/, (msg, match) => {
  
  const chatId = msg.chat.id;

  if(!match[1] || typeof match[1] !== 'string') {
	  bot.sendMessage(chatId, 'please input /addfood {name}&{position}');
    return;
  }
  const food = match[1].split('&');
  if(!food || food.length != 2) {
	  bot.sendMessage(chatId, 'please input /addfood {name}&{position}');
    return;
  }

  if(food[0] == '' || food[1] == '') {
    bot.sendMessage(chatId, 'Please enter your name and position.');
    return;
  }

	const jsonList = readExcel(foodExcel);

  for(let i = 0; i < jsonList.length; i++) {
    if(jsonList[i].name == food[0]) {
      bot.sendMessage(chatId, 'It already exists.');
      return;
    }
  }
  
  const newJson = {
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

bot.onText(/\/(deletefood|df) (.+)/, (msg, match) => {
  
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

bot.onText(/\/(foodlist|fl)/, (msg, match) => {
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
  const date = new Date();
  const milliseconds = date.getMilliseconds();

  let rand1 = Math.floor(Math.random() * 1000);
  let rand2 = Math.floor(Math.random() * 5000);
  const rand = (milliseconds + rand1 + rand2) % (max - min) + min;

  return rand;
}

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, 'Received your message');
// });
