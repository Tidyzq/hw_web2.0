// ����ļ�������Զ�����ݿ�Ĳ���

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'tidyzq.com',
    user: 'hw_9',
    password: '123456',
    database: 'hw_web',
    port: 3306
});

function DBShowUser(fn) {
    conn.query('SELECT * FROM user', function (err, rows, fields) {
        fn(rows);
    });
}

function DBAddUser(user, fn) {
    conn.query('INSERT INTO user (name, id, tel, email) values("' + user.name + '", "' + user.id + '", "' + user.tel + '", "' + user.email + '")', function (err, res) {
        fn(err, res);
    });
}

function DBCheckUser(user, fn) {

}

function DBQuery(item, value, fn) {
    conn.query('SELECT * FROM user WHERE ' + item + '="' + value + '"', function (err, rows, fields) {
        fn(rows);
    });
}

conn.connect();

exports.showUser = DBShowUser;
exports.addUser = DBAddUser;
exports.query = DBQuery;