const html = document.querySelector('html')
const focoBotao = document.querySelector('.app__card-button--foco')
const curtoBotao = document.querySelector('.app__card-button--curto')
const longoBotao = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const botaoComecar = document.querySelector('#start-pause')
const musicaFocoInput = document.querySelector('#alternar-musica')
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const iconeStartStop = document.querySelector('.app__card-primary-butto-icon')
const tempoNaTela = document.querySelector('#timer')

const musica = new Audio('/sons/The-Force-Theme.mp3')
const tempoZerado = new Audio('/sons/beep.mp3')
const tempoIniciado = new Audio('/sons/play.mp3')
const tempoPausado = new Audio('/sons/pause.mp3')

let tempoEmSegundos = 1500
let intervaloId = null
let tipoAtual = ''

musica.loop = true

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

focoBotao.addEventListener('click', () => {
    tempoEmSegundos = 1500
    alterarContexto('foco')
    focoBotao.classList.add('active')
});

curtoBotao.addEventListener('click', () => {
    tempoEmSegundos = 300
    alterarContexto('descanso-curto')
    curtoBotao.classList.add('active')
});

longoBotao.addEventListener('click', () => {
    tempoEmSegundos = 900
    alterarContexto('descanso-longo')
    longoBotao.classList.add('active')
});

function alterarContexto(contexto) {
    mostrarTempo()
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active')
    })
    if (tipoAtual !== contexto) {
        zerar();
    }
    tipoAtual = contexto;
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Foco é a arma mais poderosa.<br>
            <strong class="app__title-strong">Que a força esteja com você.</strong>
            `
            break;
        case "descanso-curto":
            titulo.innerHTML = `
            Descansar você deve, padawan.<br>
            <strong class="app__title-strong">Revigorado, mais forte se tornará.</strong>
            `
            break;
        case "descanso-longo":
            titulo.innerHTML = `
            Cada segundo conta.<br>
            <strong class="app__title-strong">Faça valer a pena!</strong>
            `
        default:
            break;
    }
}


const contagemRegressiva = () => {
    if(tempoEmSegundos <= 0) {
        tempoZerado.play()
        tempoZerado.volume = 0.2
        zerar()
        return
    }
    tempoEmSegundos -= 1
    mostrarTempo()
}

botaoComecar.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    if(intervaloId) {
        tempoPausado.play()
        tempoPausado.volume = 0.5
        zerar()
        return
    }
    tempoIniciado.play()
    tempoIniciado.volume = 0.5
    intervaloId = setInterval(contagemRegressiva, 1000)
    iniciarOuPausarBt.textContent = "Pausar"
    iconeStartStop.setAttribute('src', `/imagens/pause.png`)
}

function zerar() {
    clearInterval(intervaloId)
    iniciarOuPausarBt.textContent = "Começar"
    iconeStartStop.setAttribute('src', `/imagens/play_arrow.png`)
    intervaloId = null
}

function mostrarTempo() {
    const tempo = new Date(tempoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo()

function pausarTempo() {
    if (document.visibilityState === 'hidden' && intervaloId) {
        zerar();
    } else if (document.visibilityState === 'visible' && !intervaloId && iniciarOuPausarBt.textContent === 'Pausar') {
        iniciarOuPausar();
    }
}

document.addEventListener('visibilitychange', pausarTempo);