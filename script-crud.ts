interface Tarefa {
    descricao: string
    concluida: boolean
}

interface EstadoAplicacao {
    tarefas: Tarefa[]
    tarefaSelecionada: Tarefa | null,
    editando: boolean
}

let estadoInicial: EstadoAplicacao = {
    tarefas: [],
    tarefaSelecionada: null,
    editando: false
}

const atualizarLocalStorage = (tarefas: Tarefa[]) => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

const carregarTarefasDoLocalStorage = (): Tarefa[] => {
    const tarefasSalvas = localStorage.getItem('tarefas');
    return tarefasSalvas ? JSON.parse(tarefasSalvas): [];
}

estadoInicial.tarefas = carregarTarefasDoLocalStorage();

const selecionarTarefa = (estado: EstadoAplicacao, tarefa: Tarefa): EstadoAplicacao => {
    return {
        ...estado,
        tarefaSelecionada: tarefa === estado.tarefaSelecionada ? null : tarefa
    }
}

const adicionarTarefa = (estado: EstadoAplicacao, tarefa: Tarefa) : EstadoAplicacao => {
    const novasTarefas = [...estado.tarefas, tarefa]
    atualizarLocalStorage(novasTarefas)
    return {
        ...estado,
        tarefas: [...estado.tarefas, tarefa]
    }
}

const deletar = (estado: EstadoAplicacao): EstadoAplicacao => {
    if (estado.tarefaSelecionada) {
        const tarefas = estado.tarefas.filter(t => t != estado.tarefaSelecionada);
        atualizarLocalStorage(tarefas);
        return { ...estado, tarefas, tarefaSelecionada: null, editando: false };
    } else {
        return estado;
    }
}
const deletarTodas = (estado: EstadoAplicacao): EstadoAplicacao => {
    atualizarLocalStorage([]);
    return { ...estado, tarefas: [], tarefaSelecionada: null, editando: false };
}
const deletarTodasConcluidas = (estado: EstadoAplicacao): EstadoAplicacao => {
    const tarefas = estado.tarefas.filter(t => !t.concluida);
    atualizarLocalStorage(tarefas);
    return { ...estado, tarefas, tarefaSelecionada: null, editando: false };
}
const editarTarefa = (estado: EstadoAplicacao, tarefa: Tarefa): EstadoAplicacao => {
    return { ...estado, editando: !estado.editando, tarefaSelecionada: tarefa };
}

const atualizarUI = () => {
    const taskIconSvg = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF" />
            <path
                d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E" />
        </svg>
    `

    const ulTarefas = document.querySelector('.app__section-task-list')
    const formAdicionarTarefa = document.querySelector<HTMLFormElement>('.app__form-add-task')
    const btnAdicionarTarefa = document.querySelector<HTMLButtonElement>('.app__button--add-task')
    const maisInfoBotao = document.querySelector('.app_button-more') as HTMLElement
    const taskHeader = document.querySelector('.app__section-task-header__ul') as HTMLElement
    const textarea = document.querySelector<HTMLTextAreaElement>('.app__form-textarea')
    const labelTarefaAtiva = document.querySelector<HTMLParagraphElement>('.app__section-active-task-description')
    const btnCancelar: HTMLButtonElement = document.querySelector('.app__form-footer__button--cancel') as HTMLButtonElement
    const btnDeletar: HTMLButtonElement = document.querySelector('.app__form-footer__button--delete') as HTMLButtonElement
    const btnDeletarConcluidas: HTMLButtonElement = document.querySelector('#btn-remover-concluidas') as HTMLButtonElement
    const btnDeletarTodas: HTMLButtonElement = document.querySelector('#btn-remover-todas') as HTMLButtonElement
    labelTarefaAtiva!.textContent = estadoInicial.tarefaSelecionada ? estadoInicial.tarefaSelecionada.descricao : null
    if (estadoInicial.editando && estadoInicial.tarefaSelecionada) {
        formAdicionarTarefa!.classList.remove('hidden')
        textarea!.value = estadoInicial.tarefaSelecionada.descricao
    } else {
        formAdicionarTarefa!.classList.add('hidden')
        textarea!.value = ''
    }

    if (!btnAdicionarTarefa) {
        throw Error("Caro indivíduo, o elemento btnAdicionarTarefa não foi encontrado. Favor conferir novamente.")
    }

    btnAdicionarTarefa.onclick = () => {
        formAdicionarTarefa?.classList.toggle('hidden')
    }

    formAdicionarTarefa!.onsubmit = (evento) => {
        evento.preventDefault()
        const descricao = textarea!.value
        estadoInicial = adicionarTarefa(estadoInicial, {
            descricao,
            concluida: false
        })
        atualizarUI()
    }

    maisInfoBotao.onclick = () => {
        taskHeader.classList.toggle('active')
    }

    document.onclick = (event: Event) => {
        if (!maisInfoBotao.contains(event.target as Node) && !taskHeader.contains (event.target as Node)) {
            taskHeader.classList.remove('active')
        }
    }

    btnCancelar.onclick = () => {
        formAdicionarTarefa!.classList.add('hidden');
    }
    btnDeletar.onclick = () => {
        estadoInicial = deletar(estadoInicial);
        formAdicionarTarefa!.classList.add('hidden');
        atualizarUI();
    }
    btnDeletarConcluidas.onclick = () => {
        estadoInicial = deletarTodasConcluidas(estadoInicial);
        taskHeader.classList.remove('active')
        atualizarUI();
    }
    btnDeletarTodas.onclick = () => {
        estadoInicial = deletarTodas(estadoInicial);
        taskHeader.classList.remove('active')
        atualizarUI();
    }

    if (ulTarefas) {
        ulTarefas.innerHTML = ''
    }

    estadoInicial.tarefas.forEach(tarefa => {
        const li = document.createElement('li')
        li.classList.add('app__section-task-list-item')
        const svgIcon = document.createElement('svg')
        svgIcon.innerHTML = taskIconSvg

        const paragraph = document.createElement('p')
        paragraph.classList.add('app__section-task-list-item-description')
        paragraph.textContent = tarefa.descricao

        const button = document.createElement('button')
        button.classList.add('app_button-edit')

        const editIcon = document.createElement('img')
        editIcon.setAttribute('src', '/imagens/edit.png')

        button.appendChild(editIcon)

        if (tarefa.concluida) {
            button.setAttribute('disabled', 'true')
            li.classList.add('app__section-task-list-item-complete')
        }

        if (tarefa == estadoInicial.tarefaSelecionada) {
            li.classList.add('app__section-task-list-item-active')
        }

        li.appendChild(svgIcon)
        li.appendChild(paragraph)
        li.appendChild(button)

        li.addEventListener('click', () => {
           estadoInicial = selecionarTarefa(estadoInicial, tarefa)
           atualizarUI()
        })

        editIcon.onclick = (evento) => {
            evento.stopPropagation();
            estadoInicial = editarTarefa(estadoInicial, tarefa);
            atualizarUI();
        }

        ulTarefas?.appendChild(li)
    })
}

document.addEventListener('TarefaFinalizada', () => {
    if (estadoInicial.tarefaSelecionada) {
        estadoInicial.tarefaSelecionada.concluida = true
        atualizarUI()
    }
})

atualizarUI()