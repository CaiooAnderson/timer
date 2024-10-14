"use strict";
let estadoInicial = {
    tarefas: [
        {
            descricao: 'Tarefa concluída',
            concluida: true
        },
        {
            descricao: 'Tarefa pendente 1',
            concluida: false
        },
        {
            descricao: 'Tarefa pendente 2',
            concluida: false
        }
    ],
    tarefaSelecionada: null
};
const selecionarTarefa = (estado, tarefa) => {
    return Object.assign(Object.assign({}, estado), { tarefaSelecionada: tarefa === estado.tarefaSelecionada ? null : tarefa });
};
const adicionarTarefa = (estado, tarefa) => {
    return Object.assign(Object.assign({}, estado), { tarefas: [...estado.tarefas, tarefa] });
};
const atualizarUI = () => {
    const taskIconSvg = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF" />
            <path
                d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E" />
        </svg>
    `;
    const ulTarefas = document.querySelector('.app__section-task-list');
    const formAdicionarTarefa = document.querySelector('.app__form-add-task');
    const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
    const textarea = document.querySelector('.app__form-textarea');
    if (!btnAdicionarTarefa) {
        throw Error("Caro indivíduo, o elemento btnAdicionarTarefa não foi encontrado. Favor conferir novamente.");
    }
    btnAdicionarTarefa.onclick = () => {
        formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.toggle('hidden');
    };
    formAdicionarTarefa.onsubmit = (evento) => {
        evento.preventDefault();
        const descricao = textarea.value;
        estadoInicial = adicionarTarefa(estadoInicial, {
            descricao,
            concluida: false
        });
        atualizarUI();
    };
    if (ulTarefas) {
        ulTarefas.innerHTML = '';
    }
    estadoInicial.tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.classList.add('app__section-task-list-item');
        const svgIcon = document.createElement('svg');
        svgIcon.innerHTML = taskIconSvg;
        const paragraph = document.createElement('p');
        paragraph.classList.add('app__section-task-list-item-description');
        paragraph.textContent = tarefa.descricao;
        const button = document.createElement('button');
        button.classList.add('app_button-edit');
        const editIcon = document.createElement('img');
        editIcon.setAttribute('src', '/imagens/edit.png');
        if (tarefa.concluida) {
            button.setAttribute('disabled', 'true');
            li.classList.add('app__section-task-list-item-complete');
        }
        li.appendChild(svgIcon);
        li.appendChild(paragraph);
        li.appendChild(button);
        li.addEventListener('click', () => {
            console.log('A tarefa foi clicada', tarefa);
            estadoInicial = selecionarTarefa(estadoInicial, tarefa);
            atualizarUI();
        });
        ulTarefas === null || ulTarefas === void 0 ? void 0 : ulTarefas.appendChild(li);
    });
};
document.addEventListener('TarefaFinalizada', () => {
    if (estadoInicial.tarefaSelecionada) {
        estadoInicial.tarefaSelecionada.concluida = true;
        atualizarUI();
    }
});
atualizarUI();
