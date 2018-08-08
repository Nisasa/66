const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const http = require('http');
const request = require('request');
const UserService = require('./user-service');
const TOKEN = '630276501:AAGb3juad3ylbVGLR0fyxvyLKpedjqQN4dg';
const mongoose = require('mongoose');
const BotUtils = require('./utils');
const nodemailer = require('nodemailer');

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})

mongoose.connect('mongodb://jkjok:88993421q@ds147420.mlab.com:47420/jkjok', { useNewUrlParser: true });

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
}).listen(process.env.PORT || 5000);

bot.onText(new RegExp('\/start'), function (message, match) {
    // вытаскиваем id клиента из пришедшего сообщения
    const chatId = BotUtils.getClientInfo(message);

    console.dir(message);
    // посылаем ответное сообщение

    UserService.saveUser(chatId, function (saveErr, result) {
        if (saveErr) {
            bot.sendMessage(chatId, 'Some error! Sorry');

        }
        bot.sendMessage(message.chat.id, `Приветствуем Вас, ${message.from.first_name}!`, {
            reply_markup: {
                keyboard: [
                    ['📋Каталог', '🔝Топ игр'],
                    ['🛑FAQ', '📩Тех. поддержка'],
                    ['♻️Испытать удачу']
                ],
                resize_keyboard: true
            }
        })
    })
})

bot.onText(/help (.+)/, msg => {

    bot.sendMessage(msg.chat.id, 'Собщение успешно отправлено, ')

    const output = `
    <h1>Новое сообщение</h1>
    <p><b>Никнейм: </b><a href="https://t.me/${msg.from.username}">${msg.from.username}</a></p>
    <p><b>Айди:</b> ${msg.from.id}</p>
    <p><b>Текст айди:</b> ${msg.message_id}</p>
    <b>Сообщение:</b> ${msg.text}
    `;

// create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: '587',
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'vft010890@gmail.com', // generated ethereal user
            pass: '88993421qaz'  // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

// setup email data with unicode symbols
    let mailOptions = {
        from: '"Аккаунт" <testarayes@gmail.com>', // sender address
        to: 'normalno1234@gmail.com', // list of receivers
        subject: 'Информация', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    });


});

bot.on('message', msg => {
    if (msg.text === '📋Каталог') {
        const markdown = `
        *${msg.from.first_name}*, выберите интересующий Вас товар:
        
⚠В случае получения невалидного товара после оплаты, просьба в срочном порядке связаться с тех. поддержкой для его замены.
        `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [
                    ['🎮The Crew 2'],
                    ['🕹Far Cry 5'],
                    ['🎮Fortnite Deluxe Edition'],
                    ['🕹A Way Out'],
                    ['🎮Counter-Strike Go'],
                    ['🎮PUBG'],
                    ['🕹DayZ'],
                    ['🎮GTA 5'],
                    ['🕹Tom Clancys Rainbow Six: Siege'],
                    ['🎮Need For Speed Payback'],
                    ['🕹Star Wars Battlefront II'],
                    ['🎮For Honor'],
                    ['🕹Watch Dogs 2'],
                    ['🎮Titanfall 2'],
                    ['🕹Battlefield 1 Delux Edition'],
                    ['⬅️Назад'],
                ],
                resize_keyboard: true
            }
        })
    }
    else if (msg.text === "🔝Топ игр") {
        const markdown = `
        *${msg.from.first_name}*, выберите интересующий Вас товар:
        
⚠В случае получения невалидного товара после оплаты, просьба в срочном порядке связаться с тех. поддержкой для его замены.
        `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [
                    ['🎮PUBG'],
                    ['🕹DayZ'],
                    ['🎮GTA 5'],
                    ['🕹Tom Clancys Rainbow Six: Siege'],
                    ['🎮Counter-Strike Go'],
                    ['🕹Fortnite Deluxe Edition'],
                    ['🎮Need For Speed Payback'],
                    ['⬅️Назад'],
                ],
                resize_keyboard: true
            }
        })
    }
    else if (msg.text === "♻️Испытать удачу") {
        const markdown = `
   [♻](https://cdn1.savepice.ru/uploads/2018/8/6/5501aa40b011c649de042680db5d8fe9-full.jpg) *Испытай удачу*

*Участвуй в рандоме* и получи ключ для активации игры в сервисе *Steam*, *Origin* или *Uplay*.

🎮 *Список игр участвующих в рандоме:*

Counter-Strike: Global Offensive
Metro 2033
Killing Floor Bundle
DayZ 
Call of Duty: Advanced Warfare
GTA 5 
Rust
LIMBO
Titanfall 2
Far Cry 5 
Tom Clancy’s Rainbow Six: Siege
Tom Clancy’s The Division
Tom Clancy’s Ghost Recon Wildlands
The Crew 2
PUBG
Star Wars Battlefront II
Need for Speed: Payback
Battlefield Hardline
Battlefield 4
Battlefield 3
Battlefield 1
H1Z1
Payday 2

*⚠️После выпадения рандомного ключа у вас есть 24 часа для его активации.*

*⚠Если вам выпала игра уже имеющаяся на вашем аккаунте, то ключ не сгорает, можете передать его своим знакомым*.
`

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Испытать удачу - 99 ₽',
                            callback_data: 'life'
                        }
                    ]]
            }
        })
    }
    else if (msg.text === "⬅️Назад") {
        sendNext(msg)
    }
    else if (msg.text === "📩Тех. поддержка") {
        const markdown = `
   *Если у вас возникли проблемы при покупке товара или есть предложения о сотрудничестве, то:*
   
Отправьте в чат бота *ваш текст*, который будет начинаться с префикса */help*.

*Пример:*

/help Мне попался невалидный аккаунт, прошу заменить его.    
   
    `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',

        })
    }
    else if (msg.text === "🛑FAQ") {
        const markdown = `
   [📃](http://telegra.ph/FAQ-08-08-4) *FAQ*
`

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown'
        })
    }
    else if (msg.text === "🎮The Crew 2") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/3a6b04973f686f3fd2050ebed0dd3847-full.jpg) *The Crew 2*
Приобретая данный товар вы получаете:

Учетную запись *Uplay* c игрой: *The Crew 2*

Данные вида: *Login:Password* 

❗️*Важно*:
\`Доступ к почте - не предоставляется!
Для игры на платформе PlayKey данный товар не подойдет!

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'The Crew 2'
                        }
                    ]]
            }
            })
    }
    else if (msg.text === "🕹Far Cry 5") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/4d2abaf2643e43640eb625db7c27a01b-full.jpg) *Far Cry 5*
Приобретая данный товар вы получаете:

Учетную запись *Uplay* c игрой: *Far Cry 5*

Данные вида: *Login:Password* 

❗️*Важно*:
\`Доступ к почте - не предоставляется!
Для игры на платформе PlayKey данный товар не подойдет!

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'Far Cry 5'
                        }
                    ]]
            }
        })
        }
        else if (msg.text === "🎮Fortnite Deluxe Edition") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/b3955b4013a12e78470cb0fde52e1f12-full.png) *Fortnite Deluxe Edition*
Приобретая данный товар вы получаете:

Учетную запись *Epic Games* c игрой: *Fortnite Deluxe Edition*

Данные вида: *Login:Password* 

❗️*Важно*:
\`Доступ к почте - не предоставляется!

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'Fortnite Deluxe Edition'
                        }
                    ]]
            }
        })
        }
        else if (msg.text === "🕹A Way Out") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/51f03f6631fce2081cb609d46661ef6a-full.jpg) *A Way Out*
Приобретая данный товар вы получаете:

Учетную запись *Origin* c игрой: *A Way Out*

Данные вида: *Login:Password* 

❗️*Важно*:
\`Доступ к почте - не предоставляется!

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'A Way Out'
                        }
                    ]]
            }
        })
        }
        else if (msg.text === "🎮Counter-Strike Go") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/6abc75bee5ef65fa7827e4ad736b6f60-full.jpg) *Counter-Strike Go*
Приобретая данный товар вы получаете:

Учетную запись *Steam* c игрой: *Counter-Strike Go*

Данные вида: *Login:Password* 

❗️*Важно, после покупки обязательно нужно*:
\`♦ Изменить данные почты на свою
♦ Изменить пароль 
♦ Привязать номер
♦ Установить секретный вопрос
♦Включить Steam Guard

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'Counter-Strike Go'
                        }
                    ]]
            }
        })
        }
        else if (msg.text === "🕹Star Wars Battlefront II") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/db432bdce197966ce06a8180a9423cc7-full.jpg) *Star Wars Battlefront II*
Приобретая данный товар вы получаете:

Учетную запись *Origin* c игрой: *Star Wars Battlefront II*

Данные вида: *Login:Password* 

❗️*Важно*:
\`Доступ к почте - не предоставляется!
Ответ на секретный - не предоставляется!

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'Star Wars Battlefront II'
                        }
                    ]]
            }
        })
        }
        else if (msg.text === "🎮For Honor") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/d86c91d54d8db478baba8f94b2b3f4c9-full.jpg) *For Honor*
Приобретая данный товар вы получаете:

Учетную запись *Uplay* c игрой: *For Honor*

Данные вида: *Login:Password* 

❗️*Важно*:
\`Доступ к почте - не предоставляется!
Для игры на платформе PlayKey данный товар не подойдет!

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'For Honor'
                        }
                    ]]
            }
        })
        }
        else if (msg.text === "🕹Watch Dogs 2") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/80c875524f7b89cccaece3f16d700402-full.jpg) *Watch Dogs 2*
Приобретая данный товар вы получаете:

Учетную запись *Uplay* c игрой: *Watch Dogs 2*

Данные вида: *Login:Password* 

❗️*Важно*:
\`Доступ к почте - не предоставляется!
Для игры на платформе PlayKey данный товар не подойдет!

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'Watch Dogs 2'
                        }
                    ]]
            }
        })
        }
        else if (msg.text === "🎮Titanfall 2") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/a89651f6fe0f45f79963929a35ed62b5-full.jpg) *Titanfall 2*
Приобретая данный товар вы получаете:

Учетную запись *Origin* c игрой: *Titanfall 2*

Данные вида: *Login:Password* 

❗️*Важно*:
\`Доступ к почте - не предоставляется!
Ответ на секретный - не предоставляется!

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'Titanfall 2'
                        }
                    ]]
            }
        })
        }
        else if (msg.text === "🕹Battlefield 1 Delux Edition") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/02a7796d64db5cf025779c486fc5f203-full.jpg) *Battlefield 1 Delux Edition*
Приобретая данный товар вы получаете:

Учетную запись *Origin* c игрой: *Battlefield 1 Delux Edition*

Данные вида: *Login:Password* 

❗️*Важно*:
\`Доступ к почте - не предоставляется!
Ответ на секретный - не предоставляется!

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'Battlefield 1 Delux Edition'
                        }
                    ]]
            }
        })
    }
        else if (msg.text === "🎮PUBG") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/8/6/cf75191814260d677738013fff93474a-full.jpg) *PUBG*
Приобретая данный товар вы получаете:

Учетную запись *Steam* c игрой: *PUBG*

Данные вида: *Login:Password* 

❗️*Важно, после покупки обязательно нужно*:
\`♦ Изменить данные почты на свою
♦ Изменить пароль 
♦ Привязать номер
♦ Установить секретный вопрос
♦Включить Steam Guard

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'PUBG'
                        }
                    ]]
            }
        })
    }
        else if (msg.text === "🕹DayZ") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/8/6/4b3a3fac4a2fe01da8b48fe178427f07-full.jpg) *DayZ2*
Приобретая данный товар вы получаете:

Учетную запись *Steam* c игрой: *DayZ*

Данные вида: *Login:Password* 

❗️*Важно, после покупки обязательно нужно*:
\`♦ Изменить данные почты на свою
♦ Изменить пароль 
♦ Привязать номер
♦ Установить секретный вопрос
♦Включить Steam Guard

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'DayZ'
                        }
                    ]]
            }
        })
    }
        else if (msg.text === "🕹Tom Clancys Rainbow Six: Siege") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/8/6/3832c7b9e17ad6b0d121f593acefb866-full.jpg) *Tom Clancy's Rainbow Six: Siege*
Приобретая данный товар вы получаете:

Учетную запись *Uplay* c игрой: *Tom Clancy's Rainbow Six: Siege*

Данные вида: *Login:Password* 

❗️*Важно*:
\`Доступ к почте - не предоставляется!
Для игры на платформе PlayKey данный товар не подойдет!

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'Tom Clancys Rainbow Six: Siege'
                        }
                    ]]
            }
        })
    }
        else if (msg.text === "🎮GTA 5") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/8/6/fcc110642424e294188fd8c34422e14e-full.jpg) *GTA 5*
Приобретая данный товар вы получаете:

Учетную запись *Steam* c игрой: *GTA 5*

Данные вида: *Login:Password* 

❗️*Важно, после покупки обязательно нужно*:
\`♦ Изменить данные почты на свою
♦ Изменить пароль 
♦ Привязать номер
♦ Установить секретный вопрос
♦Включить Steam Guard

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'GTA 5'
                        }
                    ]]
            }
        })
    }
        else if (msg.text === "🎮Need For Speed Payback") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/8/6/ca7d4ce2bc0ce6a2b7f8383aead1d67d-full.jpg) *Need For Speed Payback*
Приобретая данный товар вы получаете:

Учетную запись *Origin* c игрой: *Need For Speed Payback*

Данные вида: *Login:Password* 

❗️*Важно*:
\`Доступ к почте - не предоставляется!
Ответ на секретный - не предоставляется!

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'Need For Speed Payback'
                        }
                    ]]
            }
        })
    }
        else if (msg.text === "🕹Fortnite Deluxe Edition") {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/b3955b4013a12e78470cb0fde52e1f12-full.png) *Fortnite Deluxe Edition*
Приобретая данный товар вы получаете:

Учетную запись *Epic Games* c игрой: *Fortnite Deluxe Edition*

Данные вида: *Login:Password* 

❗️*Важно*:
\`Доступ к почте - не предоставляется!

На аккаунте также могут присутствовать другие игры.\`
 `

        bot.sendMessage(msg.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Купить - 66 ₽',
                            callback_data: 'Fortnite Deluxe Edition'
                        }
                    ]]
            }
        })
    }
});

bot.on('callback_query', query => {

    const base = query.data
    const { message: {chat, message_id, text} } = query
    if (base === 'life') {
        const markdown = `
   [🎁](https://cdn1.savepice.ru/uploads/2018/8/6/5501aa40b011c649de042680db5d8fe9-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 99 ₽',
                            url: 'https://bit.ly/2kEJI0g'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'The Crew 2') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/3a6b04973f686f3fd2050ebed0dd3847-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'Star Wars Battlefront II') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/db432bdce197966ce06a8180a9423cc7-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'Counter-Strike Go') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/6abc75bee5ef65fa7827e4ad736b6f60-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'A Way Out') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/51f03f6631fce2081cb609d46661ef6a-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'Fortnite Deluxe Edition') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/b3955b4013a12e78470cb0fde52e1f12-full.png) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'Far Cry 5') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/4d2abaf2643e43640eb625db7c27a01b-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'For Honor') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/d86c91d54d8db478baba8f94b2b3f4c9-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'Watch Dogs 2') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/80c875524f7b89cccaece3f16d700402-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'Titanfall 2') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/a89651f6fe0f45f79963929a35ed62b5-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'Battlefield 1 Delux Edition') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/7/30/02a7796d64db5cf025779c486fc5f203-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'PUBG') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/8/6/cf75191814260d677738013fff93474a-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
            },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'DayZ') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/8/6/4b3a3fac4a2fe01da8b48fe178427f07-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'Tom Clancys Rainbow Six: Siege') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/8/6/3832c7b9e17ad6b0d121f593acefb866-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'GTA 5') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/8/6/fcc110642424e294188fd8c34422e14e-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'Need For Speed Payback') {
        const markdown = `
   [🎮](https://cdn1.savepice.ru/uploads/2018/8/6/ca7d4ce2bc0ce6a2b7f8383aead1d67d-full.jpg) После оплаты товара нажмите на кнопку «*Проверить оплату*» для завершения процедуры.
   
    `
        bot.editMessageText(markdown,{
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить - 66 ₽',
                            url: 'https://bit.ly/2OmBy9v'
                        },
                    ],
                    [
                        {
                            text: 'Проверить оплату ₽',
                            callback_data: 'Платеж не найден!'
                        },

                    ],


                ]
            }
        })
    }
    else if (base === 'Платеж не найден!') {
        const base = query.data

        bot.answerCallbackQuery({
            callback_query_id: query.id,
            text: `${base}`
        })
    }

});

function sendNext(msg) {

    bot.sendMessage(msg.chat.id, 'Что Вы хотите сделать?', {
        reply_markup: {
            keyboard: [
                ['📋Каталог', '🔝Топ игр'],
                ['🛑FAQ', '📩Тех. поддержка'],
                ['♻️Испытать удачу']
            ],
            resize_keyboard: true
        }
    })


}