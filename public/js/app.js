const InpNumber = document.getElementById('number');
const textInput = document.getElementById('message');
const button = document.getElementById('button');
const response = document.querySelector('.response');

button.addEventListener('click', send, false);

const socket = io();
socket.on('status', (data) => {
  response.innerHTML = '<h4>SMS Send to + ' + data.number + '</h4>';
});

function send() {
  const number = InpNumber.value.replace(/\D/g, '');
  const text = textInput.value;

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      number: number,
      text: text,
    }),
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
