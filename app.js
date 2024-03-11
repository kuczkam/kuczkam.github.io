if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js')
    .then((reg) => console.log('SW registred', reg))
    .catch((err) => console.log('SW not registred', err))
}