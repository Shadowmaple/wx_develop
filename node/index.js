const request = require('request')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

const wx = {
    appId: '',
    secret: ''
}

var db = {
    session: {},
    user: {}
}

app.get('', (req, res) => {
    res.json({ 'message': 'Hello, world!' })
})

app.post('/login', (req, res) => {
    console.log('login code: ' + req.body.code)

    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + wx.appId +
        '&secret=' + wx.secret + '&js_code=' + req.body.code +
        '&grant_type=authorization_code'

    request(url, (err, response, body) => {
        console.log('session: ' + body)

        var session = JSON.parse(body)
        // 判断session.openid 是否存在
        if (session.openid) {
            // 生成 token
            var token = 'asdfasToKEn' + new Date().getTime() + 'sdafl'
            db.session[token] = session
            if (!db.user[session.openid]) {
                db.user[session.openid] = {
                    credit: 100,
                    create_time: new Date().getTime()
                }
            }
            res.json({
                msg: null,
                token: token
            })
            console.log('request OK!!')
            return
        }
        console.log('request failed!')
        res.json({
            msg: 'Error: code2session failed',
            token: null
        })
    })
})

app.get('/check_login', (req, res) => {
    var session = db.session[req.query.token]
    console.log('check_login session: ' + session)
    res.json({
        is_login: session != undefined,
    })
})

app.listen(3000, () => {
    console.log('server running at http://127.0.0.1:3000')
})
