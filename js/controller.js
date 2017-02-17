/* もとのキーボードによるコントール操作部分をすべてコメントアウトして無効にする
 キーボードを入力した時に一番最初に呼び出される処理
document.body.onkeydown = function( e ) {
  // キーに名前をセットする
  var keys = {
    37: 'left',
    39: 'right',
    40: 'down',
    38: 'rotate'
  };

  if ( typeof keys[ e.keyCode ] != 'undefined' ) {
    // セットされたキーの場合はtetris.jsに記述された処理を呼び出す
    keyPress( keys[ e.keyCode ] );
    // 描画処理を行う
    render();
  }
};
*/

// 無効にした部分を WebSocket からの入力に従って実行するように追加
var socket;
var th = 5; //. しきい値
var wsUrl = 'ws://' + location.hostname + '/ws/sensor';
function connect(){ // この処理が tetris.html のロード直後に呼ばれる
  socket = new WebSocket(wsUrl);
  socket.onmessage = function(e) {
    var sensorData = JSON.parse(e.data);

    if( sensorData.LR >= 50 ){ 
      // デバイスを右に50度傾けたら右方向キーが押されたとみなす
      keyPress( 'right' );
      render();
    }else if( sensorData.LR <= -50 ){
      // デバイスを左に50度傾けたら左方向キーが押されたとみなす
      keyPress( 'left' );
      render();
    }else if( sensorData.FB >= 50 || sensorData.FB <= -50 ){
      // デバイスを前後に50度傾けたら回転キーが押されたとみなす
      keyPress( 'rotate' );
      render();

      // 下に押されたとみなすキーは定義しない
    }
  }
}

// キーボードが押された時に呼び出される関数
function keyPress( key ) {
  :