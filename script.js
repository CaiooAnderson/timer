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
const seletorDeMusica = document.querySelectorAll('.app__music-button')

const musica = new Audio('/sons/The-Force-Theme.mp3')
const tempoZerado = new Audio('/sons/beep.mp3')
const tempoIniciado = new Audio('/sons/play.mp3')
const tempoPausado = new Audio('/sons/pause.mp3')
const musicaLofi = new Audio('/sons/Lofi.mp3')
const musicaRock = new Audio('/sons/Rock.mp3')
const musicaEletronica = new Audio('/sons/Eletronica.mp3')

let tempoEmSegundos = 1500
let intervaloId = null
let tipoAtual = ''

musica.loop = true

seletorDeMusica.forEach(botaoMusica => {
    botaoMusica.addEventListener('click', () => {
        const contexto = botaoMusica.getAttribute('data-contexto')
        marcarBotaoAtivo(botaoMusica)
        escolherMusica(contexto)
        rotacionarIcone(contexto)
    })
})

function rotacionarIcone(contexto) {
    document.querySelectorAll('.app__music-icon').forEach(icon => {
        icon.classList.remove('active');
    })
    const icon = document.querySelector(`.app__music-icon--${contexto}`)
    if (icon) {
        icon.classList.add('active')
    } if (!contexto) {
        icon.classList.remove('active')
    }
}

function marcarBotaoAtivo(botaoAtivo) {
    seletorDeMusica.forEach(botao => {
        botao.classList.remove('active')
        const contexto = botao.getAttribute('data-contexto')
        const icon = document.querySelector(`.app__music-icon--${contexto}`)
        if (icon) {
            icon.classList.remove('active')
        }
    })
    botaoAtivo.classList.add('active')
    const contexto = botaoAtivo.getAttribute('data-contexto')
    rotacionarIcone(contexto)
}

function escolherMusica(contexto) {
    musica.pause() 

    switch (contexto) {
        case 'lo-fi':
            musica.src = '/sons/Lofi.mp3'
            break
        case 'rock':
            musica.src = '/sons/Rock.mp3'
            break
        case 'eletronica':
            musica.src = '/sons/Eletronica.mp3'
            break
        default:
            escolherMusicaPadrao()
            return
    }

    tipoAtual = contexto
    if (musicaFocoInput.checked) {
    musica.play()
    } else {
        alert('Apenas tocará a música escolhida caso ative o Modo Música!')
    }
}

function escolherMusicaPadrao() {
    tipoAtual = 'padrao'
    musica.src = '/sons/The-Force-Theme.mp3'
    if (musicaFocoInput.checked) {
        musica.play()
    }
}

musicaFocoInput.addEventListener('change', () => {
    const musicaSelecionada = document.querySelector('.app__music-button.active')

    if (musicaFocoInput.checked) {
        if (musicaSelecionada) {
            const contexto = musicaSelecionada.getAttribute('data-contexto')
            escolherMusica(contexto)
        } else {
            escolherMusicaPadrao()
        }
    } else {
        musica.pause()
        if (musicaSelecionada) {
            musicaSelecionada.classList.remove('active')
        }
        escolherMusicaPadrao()
    }
})

focoBotao.addEventListener('click', () => {
    tempoEmSegundos = 1500
    alterarContexto('foco')
    focoBotao.classList.add('active')
})

curtoBotao.addEventListener('click', () => {
    tempoEmSegundos = 300
    alterarContexto('descanso-curto')
    curtoBotao.classList.add('active')
})

longoBotao.addEventListener('click', () => {
    tempoEmSegundos = 900
    alterarContexto('descanso-longo')
    longoBotao.classList.add('active')
})

function alterarContexto(contexto) {
    mostrarTempo()
    botoes.forEach(function (botao) {
        botao.classList.remove('active')
    })
    if (tipoAtual !== contexto) {
        zerar()
    }
    tipoAtual = contexto
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Foco é a arma mais poderosa.<br>
            <strong class="app__title-strong">Que a força esteja com você.</strong>
            `
            break
        case "descanso-curto":
            titulo.innerHTML = `
            Descansar você deve, padawan.<br>
            <strong class="app__title-strong">Mais forte se tornará.</strong>
            `
            break
        case "descanso-longo":
            titulo.innerHTML = `
            Cada segundo conta.<br>
            <strong class="app__title-strong">Faça valer a pena!</strong>
            `
        default:
            break
    }
}

const contagemRegressiva = () => {
    if(tempoEmSegundos <= 0) {
        tempoZerado.play()
        tempoZerado.volume = 0.75
        zerar()
        const focoAtivo = html.getAttribute('data-contexto') === 'foco'
        if (focoAtivo) {
            const event = new CustomEvent("TarefaFinalizada", {
                detail: {
                    message: "A tarefa foi concluída com sucesso!",
                    time: new Date(),
                },
                bubbles: true,
                cancelable: true
            })
            document.dispatchEvent(event);
        }
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
        zerar()
    } else if (document.visibilityState === 'visible' && !intervaloId && iniciarOuPausarBt.textContent === 'Pausar') {
        iniciarOuPausar()
    }
}

document.addEventListener('visibilitychange', pausarTempo)