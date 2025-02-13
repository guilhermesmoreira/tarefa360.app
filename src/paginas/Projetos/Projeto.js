import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import { Link } from "react-router-dom";
import { MdDelete, MdEdit, MdSave } from "react-icons/md";
import { useState, useEffect } from "react";
import style from "./Projeto.module.css";
import Table from "react-bootstrap/esm/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export function Projetos() {
  // Lista de projetos mockados
  const projetosMockados = [
    { id: 1, nome: "Projeto Alpha", descricao: "Descrição do Projeto Alpha" },
    { id: 2, nome: "Projeto Beta", descricao: "Descrição do Projeto Beta" },
    { id: 3, nome: "Projeto Gamma", descricao: "Descrição do Projeto Gamma" },
  ];

  const [projetos, setProjetos] = useState(projetosMockados); // Inicializa com dados mockados
  const [projetosFiltrados, setProjetosFiltrados] = useState(projetosMockados); // Inicializa com dados mockados
  const [mostrarModalDeletar, setMostrarModalDeletar] = useState(false);
  const [mostrarModalNovo, setMostrarModalNovo] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [novoProjeto, setNovoProjeto] = useState({ nome: "", descricao: "" });
  const [projetoArrastado, setProjetoArrastado] = useState(null); // Estado para armazenar o projeto sendo arrastado

  const handleDragStart = (e, index) => {
    setProjetoArrastado(index); // Armazena o índice do projeto sendo arrastado
    e.dataTransfer.effectAllowed = "move"; // Define o efeito de arrastar como "move"
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Permite que o elemento seja solto
    e.dataTransfer.dropEffect = "move"; // Define o efeito de soltar como "move"
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (projetoArrastado === null) return;

    const novaLista = [...projetos];
    const projetoMovido = novaLista[projetoArrastado]; // Projeto sendo arrastado
    novaLista.splice(projetoArrastado, 1); // Remove o projeto da posição original
    novaLista.splice(index, 0, projetoMovido); // Insere o projeto na nova posição

    setProjetos(novaLista);
    setProjetosFiltrados(novaLista); // Atualiza a lista filtrada
    setProjetoArrastado(null); // Limpa o estado do projeto arrastado
  };

  const handleClickDeletar = (projeto) => {
    setProjetoSelecionado(projeto);
    setMostrarModalDeletar(true);
  };

  const handleDeletar = async () => {
    try {
      // Simula a exclusão do projeto
      setProjetos(projetos.filter((p) => p.id !== projetoSelecionado.id));
      setProjetosFiltrados(
        projetosFiltrados.filter((p) => p.id !== projetoSelecionado.id)
      );
    } catch (error) {
      console.error("Erro ao deletar projeto", error);
    } finally {
      handleFecharModalDeletar();
    }
  };

  const handleFecharModalDeletar = () => {
    setMostrarModalDeletar(false);
    setProjetoSelecionado(null);
  };

  const handleFecharModalNovo = () => {
    setMostrarModalNovo(false);
    setNovoProjeto({ nome: "", descricao: "" });
  };

  const handleChangeFiltro = (e) => {
    const valor = e.target.value;
    setFiltro(valor);
    filtrarProjetos(valor);
  };

  const handleChangeNovoProjeto = (e) => {
    setNovoProjeto({ ...novoProjeto, [e.target.name]: e.target.value });
  };

  const handleClearFiltro = () => {
    setFiltro("");
    setProjetosFiltrados(projetos); // Restaura a lista completa ao limpar o filtro
  };

  const handleSalvarNovoProjeto = async () => {
    try {
      // Simula a criação de um novo projeto
      const novoId = projetos.length + 1; // Gera um ID simples
      const projetoSalvo = { id: novoId, ...novoProjeto };
      setProjetos([...projetos, projetoSalvo]);
      setProjetosFiltrados([...projetosFiltrados, projetoSalvo]);
      handleFecharModalNovo();
    } catch (error) {
      console.error("Erro ao salvar projeto", error);
    }
  };

  const filtrarProjetos = (valor) => {
    const filtrados = projetos.filter((projeto) =>
      projeto.nome.toLowerCase().includes(valor.toLowerCase())
    );
    setProjetosFiltrados(filtrados);
  };

  // Remove o useEffect que carrega os projetos da API, pois estamos usando dados mockados
  // useEffect(() => {
  //     carregarProjetos();
  // }, []);

  return (
    <Sidebar>
      <Topbar>
        <div className={style.pagina_conteudo}>
          <div className={style.pagina_cabecalho}>
            <h3>Projetos</h3>
            <button
              onClick={() => setMostrarModalNovo(true)}
              className={style.botao_novo}
            >
              + Novo
            </button>
          </div>
          <div className={style.inputPrincipal}>
            <input
              placeholder="Filtrar..."
              type="text"
              name="filtro"
              value={filtro}
              onChange={handleChangeFiltro}
            />
            <button className={style.button} onClick={handleClearFiltro}>
              X
            </button>
            <form className={style.formEstilizado}>
              <input className={style.inputEstilizado} autocomplete="off" required />
              <label className={style.labelEstilizado} for="Filtrar...">
                <span className={style.spanEstilizado}>Filtrar...</span>
              </label>
            </form>
          </div>

          <div className={style.tabela}>
            <Table responsive>
              <thead className={style.tabela_cabecalho}>
                <tr>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className={style.tabela_corpo}>
                {projetosFiltrados.map((projeto, index) => (
                  <tr
                    key={projeto.id}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <td>{projeto.nome}</td>
                    <td className={`${style.coluna_acoes} text-end`}>
                      <Link
                        to="/projeto/editar"
                        state={projeto.id}
                        className={style.botao_editar}
                      >
                        <MdEdit />
                      </Link>
                      <button
                        onClick={() => handleClickDeletar(projeto)}
                        className={style.botao_deletar}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Modal para deletar */}
          <Modal show={mostrarModalDeletar} onHide={handleFecharModalDeletar}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Tem certeza que deseja deletar o projeto{" "}
              {projetoSelecionado?.nome}?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleFecharModalDeletar}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDeletar}>
                Deletar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal para adicionar novo projeto */}
          <Modal show={mostrarModalNovo} onHide={handleFecharModalNovo}>
            <Modal.Header closeButton>
              <Modal.Title>Novo Projeto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Projeto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o nome do projeto"
                    name="nome"
                    value={novoProjeto.nome}
                    onChange={handleChangeNovoProjeto}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Digite a descrição do projeto"
                    name="descricao"
                    value={novoProjeto.descricao}
                    onChange={handleChangeNovoProjeto}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleFecharModalNovo}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSalvarNovoProjeto}>
                <MdSave /> Salvar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Topbar>
    </Sidebar>
  );
}
