const horariosDisponiveis = [
  "09:00","10:00","11:00",
  "14:00","15:00","16:00","17:00"
];

const selectHorario = document.getElementById("horario");
const inputData = document.getElementById("data");
const hoje = new Date().toISOString().split("T")[0];

inputData.setAttribute("min", hoje);

inputData.addEventListener("change", function(){
  
  const dataEscolhida = new Date(this.value);
  const diaSemana = dataEscolhida.getDay();

  selectHorario.innerHTML = '<option value="">Selecione o Horário</option>';

  if(diaSemana === 0){
    alert("Não atendemos aos domingos.");
    this.value = "";
    return;
  }

  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

  horariosDisponiveis.forEach(horario => {

    const jaAgendado = agendamentos.some(a =>
      a.data === this.value && a.horario === horario
    );

    if(!jaAgendado){
      const option = document.createElement("option");
      option.value = horario;
      option.textContent = horario;
      selectHorario.appendChild(option);
    }

  });

});

function agendar(){

  const nome = document.getElementById("nome").value;
  const telefoneCliente = document.getElementById("telefone").value;
  const servico = document.getElementById("servico").value;
  const data = document.getElementById("data").value;
  const horario = document.getElementById("horario").value;

  if(nome === "" || telefoneCliente === "" || servico === "" || data === "" || horario === ""){
    alert("Preencha todos os campos.");
    return;
  }

  let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

  agendamentos.push({nome, telefoneCliente, servico, data, horario});

  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

  atualizarPainel();

  const telefoneBarbearia = "5531991915667";

  const mensagem = `Olá, me chamo ${nome}.
Gostaria de confirmar o agendamento:

Serviço: ${servico}
Data: ${data}
Horário: ${horario}
Telefone: ${telefoneCliente}`;

  const url = `https://wa.me/${telefoneBarbearia}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

// ===== ADMIN =====

const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");

adminBtn.addEventListener("click", ()=>{
  adminPanel.classList.add("ativo");
  atualizarPainel();
});

function fecharAdmin(){
  adminPanel.classList.remove("ativo");
}

function atualizarPainel(){

  const lista = document.getElementById("listaAgendamentos");
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

  lista.innerHTML = "";

  if(agendamentos.length === 0){
    lista.innerHTML = "<p>Nenhum agendamento.</p>";
    return;
  }

  agendamentos.forEach((a, index)=>{
    lista.innerHTML += `
      <div style="margin-bottom:15px;border-bottom:1px solid #333;padding-bottom:10px;">
        <strong>${a.nome}</strong><br>
        ${a.servico}<br>
        ${a.data} - ${a.horario}<br>
        ${a.telefoneCliente}<br>
        <button onclick="removerAgendamento(${index})">Remover</button>
      </div>
    `;
  });

}

function removerAgendamento(index){
  let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  agendamentos.splice(index,1);
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
  atualizarPainel();
}

function limparAgendamentos(){
  localStorage.removeItem("agendamentos");
  atualizarPainel();
}